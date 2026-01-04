const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure multer for certificate uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/certificates';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `cert-${uniqueSuffix}-${sanitizedName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload PDF, JPG, PNG, or WebP files.'));
    }
  }
});

// Helper functions
function generateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

function generateShareToken() {
  return crypto.randomBytes(32).toString('hex');
}

function detectCertificateType(filename, title) {
  const lowerFilename = filename.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  if (lowerFilename.includes('internship') || lowerTitle.includes('internship')) {
    return 'INTERNSHIP';
  }
  if (lowerFilename.includes('hackathon') || lowerTitle.includes('hackathon')) {
    return 'HACKATHON';
  }
  if (lowerFilename.includes('workshop') || lowerTitle.includes('workshop')) {
    return 'WORKSHOP';
  }
  if (lowerFilename.includes('exam') || lowerTitle.includes('exam') || lowerTitle.includes('test')) {
    return 'EXAM';
  }
  if (lowerFilename.includes('course') || lowerTitle.includes('course') || lowerTitle.includes('completion')) {
    return 'COURSE';
  }
  return 'ACHIEVEMENT';
}

function extractMetadata(filename, title, organization) {
  // Simple metadata extraction - in production, use OCR
  const metadata = {
    extractedTitle: title || filename.replace(/\.[^/.]+$/, ""),
    extractedOrganization: organization || null,
    extractedDate: null,
    confidence: 0.8
  };
  
  // Try to extract year from filename or title
  const yearMatch = (filename + ' ' + title).match(/20\d{2}/);
  if (yearMatch) {
    metadata.extractedYear = parseInt(yearMatch[0]);
  }
  
  return metadata;
}

// Routes

// Get all certificates for a student
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId || 'demo-student-id'; // In real app, get from auth
    
    // Check if student exists, if not create a demo student
    let student = await prisma.user.findUnique({
      where: { id: studentId }
    });
    
    if (!student) {
      // Create a demo student for testing
      try {
        student = await prisma.user.create({
          data: {
            id: studentId,
            email: 'demo@student.com',
            passwordHash: 'demo-hash',
            fullName: 'Demo Student',
            rollNo: 'DEMO001'
          }
        });
      } catch (error) {
        // If demo student already exists or creation fails, try to find existing
        student = await prisma.user.findFirst({
          where: { email: 'demo@student.com' }
        });
        if (!student) {
          return res.status(400).json({
            success: false,
            message: 'Unable to create or find demo student for testing'
          });
        }
      }
    }
    
    const certificates = await prisma.certificate.findMany({
      where: { studentId: student.id },
      include: {
        folder: true,
        tags: true,
        attachments: true,
        verifier: {
          select: { id: true, fullName: true }
        }
      },
      orderBy: [
        { isImportant: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    res.json({
      success: true,
      data: { certificates }
    });
    
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching certificates: ' + error.message 
    });
  }
});

// Upload single certificate
router.post('/upload', upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const {
      title,
      organization,
      issueDate,
      expiryDate,
      certificateType,
      category = 'ACADEMIC',
      folderId,
      tags = '[]',
      isImportant = false,
      isResumeVisible = false,
      isPortfolioVisible = true
    } = req.body;
    
    const studentId = req.body.studentId || 'demo-student-id'; // In real app, get from auth
    const filePath = req.file.path;
    const fileHash = generateFileHash(filePath);
    
    // Check for duplicates
    const existingCert = await prisma.certificate.findFirst({
      where: {
        studentId,
        fileHash
      }
    });
    
    if (existingCert) {
      fs.unlinkSync(filePath); // Clean up uploaded file
      return res.status(400).json({
        success: false,
        message: 'This certificate has already been uploaded',
        duplicate: existingCert
      });
    }
    
    // Auto-detect certificate type if not provided
    const detectedType = certificateType || detectCertificateType(req.file.originalname, title);
    
    // Extract metadata
    const metadata = extractMetadata(req.file.originalname, title, organization);
    
    // Create certificate record
    const certificate = await prisma.certificate.create({
      data: {
        studentId,
        title: title || metadata.extractedTitle,
        organization: organization || metadata.extractedOrganization,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        certificateType: detectedType,
        category,
        fileUrl: `/uploads/certificates/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileHash,
        isImportant: isImportant === 'true',
        isResumeVisible: isResumeVisible === 'true',
        isPortfolioVisible: isPortfolioVisible === 'true',
        folderId: folderId || null,
        metadata: JSON.stringify(metadata),
        shareToken: generateShareToken()
      },
      include: {
        folder: true,
        tags: true
      }
    });
    
    // Add tags if provided
    if (tags && tags !== '[]') {
      const tagList = JSON.parse(tags);
      for (const tag of tagList) {
        await prisma.certificateTag.create({
          data: {
            certificateId: certificate.id,
            tag: tag.name,
            tagType: tag.type || 'SKILL'
          }
        });
      }
    }
    
    // Auto-generate tags based on certificate type and organization
    const autoTags = [];
    if (certificate.organization) {
      autoTags.push({ tag: certificate.organization, tagType: 'ORGANIZATION' });
    }
    if (certificate.issueDate) {
      autoTags.push({ tag: certificate.issueDate.getFullYear().toString(), tagType: 'YEAR' });
    }
    
    for (const autoTag of autoTags) {
      try {
        await prisma.certificateTag.create({
          data: {
            certificateId: certificate.id,
            tag: autoTag.tag,
            tagType: autoTag.tagType
          }
        });
      } catch (error) {
        // Ignore duplicate tag errors
      }
    }
    
    res.json({
      success: true,
      data: { certificate },
      message: 'Certificate uploaded successfully'
    });
    
  } catch (error) {
    console.error('Error uploading certificate:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading certificate: ' + error.message 
    });
  }
});

// Bulk upload certificates
router.post('/bulk-upload', upload.array('certificates', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const studentId = req.body.studentId || 'demo-student-id';
    const results = {
      success: [],
      failed: [],
      duplicates: []
    };
    
    for (const file of req.files) {
      try {
        const fileHash = generateFileHash(file.path);
        
        // Check for duplicates
        const existingCert = await prisma.certificate.findFirst({
          where: { studentId, fileHash }
        });
        
        if (existingCert) {
          fs.unlinkSync(file.path);
          results.duplicates.push({
            filename: file.originalname,
            reason: 'Already exists'
          });
          continue;
        }
        
        const detectedType = detectCertificateType(file.originalname, '');
        const metadata = extractMetadata(file.originalname, '', '');
        
        const certificate = await prisma.certificate.create({
          data: {
            studentId,
            title: metadata.extractedTitle,
            certificateType: detectedType,
            category: 'ACADEMIC',
            fileUrl: `/uploads/certificates/${file.filename}`,
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileHash,
            metadata: JSON.stringify(metadata),
            shareToken: generateShareToken()
          }
        });
        
        results.success.push({
          filename: file.originalname,
          certificateId: certificate.id
        });
        
      } catch (error) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        results.failed.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      data: results,
      message: `Processed ${req.files.length} files. ${results.success.length} uploaded, ${results.failed.length} failed, ${results.duplicates.length} duplicates.`
    });
    
  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error in bulk upload: ' + error.message 
    });
  }
});

// Update certificate metadata
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      organization,
      issueDate,
      expiryDate,
      certificateType,
      category,
      folderId,
      isImportant,
      isResumeVisible,
      isPortfolioVisible
    } = req.body;
    
    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        title,
        organization,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        certificateType,
        category,
        folderId: folderId || null,
        isImportant,
        isResumeVisible,
        isPortfolioVisible
      },
      include: {
        folder: true,
        tags: true
      }
    });
    
    res.json({
      success: true,
      data: { certificate },
      message: 'Certificate updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating certificate: ' + error.message 
    });
  }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const certificate = await prisma.certificate.findUnique({
      where: { id }
    });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', certificate.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database (cascade will handle tags and attachments)
    await prisma.certificate.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting certificate: ' + error.message 
    });
  }
});

// Get certificate by share token (public access)
router.get('/share/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const certificate = await prisma.certificate.findUnique({
      where: { shareToken: token },
      include: {
        student: {
          select: { fullName: true, email: true }
        },
        folder: true,
        tags: true
      }
    });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or link expired'
      });
    }
    
    res.json({
      success: true,
      data: { certificate }
    });
    
  } catch (error) {
    console.error('Error fetching shared certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching certificate: ' + error.message 
    });
  }
});

// Search certificates
router.get('/search', async (req, res) => {
  try {
    const { 
      q, 
      studentId = 'demo-student-id',
      type,
      category,
      year,
      organization,
      verified,
      folder
    } = req.query;
    
    const where = { studentId };
    
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { organization: { contains: q, mode: 'insensitive' } },
        { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } }
      ];
    }
    
    if (type) where.certificateType = type;
    if (category) where.category = category;
    if (verified !== undefined) where.isVerified = verified === 'true';
    if (folder) where.folderId = folder;
    if (organization) where.organization = { contains: organization, mode: 'insensitive' };
    
    if (year) {
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31`);
      where.issueDate = {
        gte: yearStart,
        lte: yearEnd
      };
    }
    
    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        folder: true,
        tags: true,
        verifier: {
          select: { fullName: true }
        }
      },
      orderBy: [
        { isImportant: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    res.json({
      success: true,
      data: { certificates }
    });
    
  } catch (error) {
    console.error('Error searching certificates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching certificates: ' + error.message 
    });
  }
});

// Get certificates for resume
router.get('/resume', async (req, res) => {
  try {
    const studentId = req.query.studentId || 'demo-student-id';
    
    const certificates = await prisma.certificate.findMany({
      where: {
        studentId,
        isResumeVisible: true
      },
      include: {
        tags: true
      },
      orderBy: [
        { isImportant: 'desc' },
        { issueDate: 'desc' }
      ]
    });
    
    res.json({
      success: true,
      data: { certificates }
    });
    
  } catch (error) {
    console.error('Error fetching resume certificates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching resume certificates: ' + error.message 
    });
  }
});

// Download certificates as ZIP
router.post('/download-zip', async (req, res) => {
  try {
    const { certificateIds } = req.body;
    
    if (!certificateIds || certificateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No certificates selected'
      });
    }
    
    const certificates = await prisma.certificate.findMany({
      where: {
        id: { in: certificateIds }
      }
    });
    
    // In a real implementation, create a ZIP file here
    // For now, return the file URLs
    const fileUrls = certificates.map(cert => ({
      id: cert.id,
      title: cert.title,
      fileUrl: cert.fileUrl,
      fileName: cert.fileName
    }));
    
    res.json({
      success: true,
      data: { files: fileUrls },
      message: 'Certificate files ready for download'
    });
    
  } catch (error) {
    console.error('Error preparing certificate download:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error preparing download: ' + error.message 
    });
  }
});

module.exports = router;