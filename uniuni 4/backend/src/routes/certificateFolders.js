const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all folders for a student
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
        // If demo student already exists, try to find existing
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
    
    const folders = await prisma.certificateFolder.findMany({
      where: { studentId: student.id },
      include: {
        certificates: {
          select: {
            id: true,
            title: true,
            certificateType: true,
            isImportant: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
    
    res.json({
      success: true,
      data: { folders }
    });
    
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching folders: ' + error.message 
    });
  }
});

// Create new folder
router.post('/', async (req, res) => {
  try {
    const { name, description, color = '#3B82F6' } = req.body;
    const studentId = req.body.studentId || 'demo-student-id'; // In real app, get from auth
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required'
      });
    }
    
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
        // If demo student creation fails, return error
        return res.status(400).json({
          success: false,
          message: 'Unable to create demo student for testing'
        });
      }
    }
    
    // Check if folder with same name exists
    const existingFolder = await prisma.certificateFolder.findFirst({
      where: {
        studentId,
        name: name.trim()
      }
    });
    
    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: 'A folder with this name already exists'
      });
    }
    
    // Get the next order index
    const lastFolder = await prisma.certificateFolder.findFirst({
      where: { studentId },
      orderBy: { orderIndex: 'desc' }
    });
    
    const orderIndex = lastFolder ? lastFolder.orderIndex + 1 : 0;
    
    const folder = await prisma.certificateFolder.create({
      data: {
        studentId,
        name: name.trim(),
        description: description?.trim() || null,
        color,
        orderIndex
      },
      include: {
        certificates: {
          select: {
            id: true,
            title: true,
            certificateType: true,
            isImportant: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: { folder },
      message: 'Folder created successfully'
    });
    
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating folder: ' + error.message 
    });
  }
});

// Update folder
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    const studentId = req.body.studentId || 'demo-student-id';
    
    // Check if folder exists and belongs to student
    const existingFolder = await prisma.certificateFolder.findFirst({
      where: { id, studentId }
    });
    
    if (!existingFolder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    // Check for name conflicts (if name is being changed)
    if (name && name !== existingFolder.name) {
      const nameConflict = await prisma.certificateFolder.findFirst({
        where: {
          studentId,
          name: name.trim(),
          id: { not: id }
        }
      });
      
      if (nameConflict) {
        return res.status(400).json({
          success: false,
          message: 'A folder with this name already exists'
        });
      }
    }
    
    const folder = await prisma.certificateFolder.update({
      where: { id },
      data: {
        name: name?.trim() || existingFolder.name,
        description: description?.trim() || existingFolder.description,
        color: color || existingFolder.color
      },
      include: {
        certificates: {
          select: {
            id: true,
            title: true,
            certificateType: true,
            isImportant: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: { folder },
      message: 'Folder updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating folder: ' + error.message 
    });
  }
});

// Delete folder
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.query.studentId || 'demo-student-id';
    
    // Check if folder exists and belongs to student
    const folder = await prisma.certificateFolder.findFirst({
      where: { id, studentId },
      include: {
        certificates: true
      }
    });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    // Move certificates to no folder (null)
    if (folder.certificates.length > 0) {
      await prisma.certificate.updateMany({
        where: { folderId: id },
        data: { folderId: null }
      });
    }
    
    // Delete the folder
    await prisma.certificateFolder.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: `Folder deleted successfully. ${folder.certificates.length} certificates moved to root.`
    });
    
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting folder: ' + error.message 
    });
  }
});

// Reorder folders
router.put('/reorder', async (req, res) => {
  try {
    const { folderIds } = req.body;
    const studentId = req.body.studentId || 'demo-student-id';
    
    if (!Array.isArray(folderIds)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder order data'
      });
    }
    
    // Update order indices
    const updatePromises = folderIds.map((folderId, index) =>
      prisma.certificateFolder.updateMany({
        where: { id: folderId, studentId },
        data: { orderIndex: index }
      })
    );
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Folder order updated successfully'
    });
    
  } catch (error) {
    console.error('Error reordering folders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error reordering folders: ' + error.message 
    });
  }
});

// Move certificates to folder
router.post('/:id/certificates', async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateIds } = req.body;
    const studentId = req.body.studentId || 'demo-student-id';
    
    // Verify folder exists and belongs to student
    const folder = await prisma.certificateFolder.findFirst({
      where: { id, studentId }
    });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    // Update certificates
    const result = await prisma.certificate.updateMany({
      where: {
        id: { in: certificateIds },
        studentId
      },
      data: { folderId: id }
    });
    
    res.json({
      success: true,
      data: { updatedCount: result.count },
      message: `${result.count} certificates moved to folder`
    });
    
  } catch (error) {
    console.error('Error moving certificates to folder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error moving certificates: ' + error.message 
    });
  }
});

// Remove certificates from folder
router.delete('/:id/certificates', async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateIds } = req.body;
    const studentId = req.body.studentId || 'demo-student-id';
    
    // Update certificates to remove from folder
    const result = await prisma.certificate.updateMany({
      where: {
        id: { in: certificateIds },
        studentId,
        folderId: id
      },
      data: { folderId: null }
    });
    
    res.json({
      success: true,
      data: { updatedCount: result.count },
      message: `${result.count} certificates removed from folder`
    });
    
  } catch (error) {
    console.error('Error removing certificates from folder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing certificates: ' + error.message 
    });
  }
});

module.exports = router;