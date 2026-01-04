const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Sample certificate data
const sampleCertificates = [
  {
    title: "Full Stack Web Development Certification",
    organization: "Tech Academy",
    issueDate: "2024-08-15",
    certificateType: "COURSE",
    category: "TECHNICAL",
    tags: ["JavaScript", "React", "Node.js", "MongoDB", "Full Stack"],
    isImportant: true,
    isResumeVisible: true,
    fileName: "fullstack_certificate.pdf"
  },
  {
    title: "AWS Cloud Practitioner",
    organization: "Amazon Web Services",
    issueDate: "2024-06-20",
    expiryDate: "2027-06-20",
    certificateType: "EXAM",
    category: "TECHNICAL",
    tags: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
    isImportant: true,
    isResumeVisible: true,
    fileName: "aws_cloud_practitioner.pdf"
  },
  {
    title: "Machine Learning Specialization",
    organization: "Stanford University",
    issueDate: "2024-05-10",
    certificateType: "COURSE",
    category: "ACADEMIC",
    tags: ["Machine Learning", "Python", "TensorFlow", "Data Science"],
    isImportant: true,
    isResumeVisible: true,
    fileName: "ml_specialization.pdf"
  },
  {
    title: "Google Analytics Certified",
    organization: "Google",
    issueDate: "2024-07-03",
    expiryDate: "2025-07-03",
    certificateType: "EXAM",
    category: "TECHNICAL",
    tags: ["Analytics", "Marketing", "Google", "Data Analysis"],
    isResumeVisible: true,
    fileName: "google_analytics.pdf"
  },
  {
    title: "Hackathon Winner - Smart City Solutions",
    organization: "TechFest 2024",
    issueDate: "2024-03-22",
    certificateType: "HACKATHON",
    category: "CO_CURRICULAR",
    tags: ["Hackathon", "IoT", "Smart City", "Innovation", "Winner"],
    isImportant: true,
    isResumeVisible: true,
    fileName: "hackathon_winner.pdf"
  },
  {
    title: "React Native Mobile Development",
    organization: "Meta",
    issueDate: "2024-04-18",
    certificateType: "COURSE",
    category: "TECHNICAL",
    tags: ["React Native", "Mobile Development", "JavaScript", "iOS", "Android"],
    isResumeVisible: true,
    fileName: "react_native_cert.pdf"
  },
  {
    title: "Cybersecurity Fundamentals",
    organization: "IBM",
    issueDate: "2024-02-14",
    certificateType: "COURSE",
    category: "TECHNICAL",
    tags: ["Cybersecurity", "Network Security", "Ethical Hacking", "IBM"],
    isResumeVisible: true,
    fileName: "cybersecurity_fundamentals.pdf"
  },
  {
    title: "Leadership Excellence Workshop",
    organization: "Harvard Business School",
    issueDate: "2024-01-30",
    certificateType: "WORKSHOP",
    category: "CO_CURRICULAR",
    tags: ["Leadership", "Management", "Soft Skills", "Harvard"],
    isImportant: false,
    isResumeVisible: false,
    fileName: "leadership_workshop.pdf"
  },
  {
    title: "Data Structures and Algorithms",
    organization: "University of California",
    issueDate: "2023-12-15",
    certificateType: "COURSE",
    category: "ACADEMIC",
    tags: ["Data Structures", "Algorithms", "Computer Science", "Programming"],
    isResumeVisible: true,
    fileName: "dsa_certificate.pdf"
  },
  {
    title: "Digital Marketing Certification",
    organization: "HubSpot Academy",
    issueDate: "2024-09-05",
    certificateType: "COURSE",
    category: "TECHNICAL",
    tags: ["Digital Marketing", "SEO", "Content Marketing", "Social Media"],
    isResumeVisible: false,
    fileName: "digital_marketing.pdf"
  },
  {
    title: "Python Programming Mastery",
    organization: "Python Institute",
    issueDate: "2023-11-20",
    certificateType: "EXAM",
    category: "TECHNICAL",
    tags: ["Python", "Programming", "Software Development", "Certification"],
    isImportant: true,
    isResumeVisible: true,
    fileName: "python_mastery.pdf"
  },
  {
    title: "Blockchain Technology Fundamentals",
    organization: "MIT OpenCourseWare",
    issueDate: "2024-10-12",
    certificateType: "COURSE",
    category: "TECHNICAL",
    tags: ["Blockchain", "Cryptocurrency", "Web3", "Decentralized"],
    isResumeVisible: true,
    fileName: "blockchain_fundamentals.pdf"
  },
  {
    title: "UI/UX Design Principles",
    organization: "Adobe",
    issueDate: "2024-08-28",
    certificateType: "COURSE",
    category: "TECHNICAL",
    tags: ["UI Design", "UX Design", "Adobe", "Design Thinking", "Figma"],
    isResumeVisible: true,
    fileName: "ui_ux_design.pdf"
  },
  {
    title: "Agile Project Management",
    organization: "Scrum Alliance",
    issueDate: "2024-07-16",
    certificateType: "WORKSHOP",
    category: "CO_CURRICULAR",
    tags: ["Agile", "Scrum", "Project Management", "Team Leadership"],
    isResumeVisible: true,
    fileName: "agile_pm.pdf"
  },
  {
    title: "Environmental Sustainability Champion",
    organization: "Green Tech Initiative",
    issueDate: "2024-06-08",
    certificateType: "ACHIEVEMENT",
    category: "CO_CURRICULAR",
    tags: ["Sustainability", "Environment", "Green Technology", "Social Impact"],
    isImportant: false,
    isResumeVisible: false,
    fileName: "sustainability_champion.pdf"
  }
];

// Sample folders
const sampleFolders = [
  {
    name: "Technical Certifications",
    description: "Programming, cloud, and technical skill certifications",
    color: "#3B82F6"
  },
  {
    name: "Academic Achievements",
    description: "University courses and academic accomplishments",
    color: "#10B981"
  },
  {
    name: "Professional Development",
    description: "Workshops, leadership, and soft skill certifications",
    color: "#F59E0B"
  },
  {
    name: "Competitions & Awards",
    description: "Hackathons, contests, and recognition awards",
    color: "#EF4444"
  }
];

function generateFileHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateShareToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function seedCertificateData() {
  console.log('🏆 Seeding certificate vault data...');

  try {
    // Ensure demo student exists
    let demoStudent = await prisma.user.findUnique({
      where: { id: 'demo-student-id' }
    });

    if (!demoStudent) {
      demoStudent = await prisma.user.create({
        data: {
          id: 'demo-student-id',
          email: 'demo@student.com',
          passwordHash: 'demo-hash',
          fullName: 'Demo Student',
          rollNo: 'DEMO001'
        }
      });
      console.log('✅ Created demo student');
    }

    // Create certificate folders
    console.log('📁 Creating certificate folders...');
    const createdFolders = [];
    
    for (const folderData of sampleFolders) {
      try {
        const folder = await prisma.certificateFolder.create({
          data: {
            studentId: demoStudent.id,
            name: folderData.name,
            description: folderData.description,
            color: folderData.color,
            orderIndex: createdFolders.length
          }
        });
        createdFolders.push(folder);
        console.log(`   ✓ Created folder: ${folder.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   - Folder "${folderData.name}" already exists`);
          const existingFolder = await prisma.certificateFolder.findFirst({
            where: {
              studentId: demoStudent.id,
              name: folderData.name
            }
          });
          if (existingFolder) createdFolders.push(existingFolder);
        } else {
          throw error;
        }
      }
    }

    // Create certificates directory if it doesn't exist
    const certificatesDir = path.join(__dirname, '../uploads/certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Create sample certificates
    console.log('🏆 Creating sample certificates...');
    const createdCertificates = [];

    for (let i = 0; i < sampleCertificates.length; i++) {
      const certData = sampleCertificates[i];
      
      // Create a dummy PDF file
      const dummyContent = `Certificate: ${certData.title}\nOrganization: ${certData.organization}\nIssued: ${certData.issueDate}\n\nThis is a sample certificate for demonstration purposes.`;
      const fileName = `cert-${Date.now()}-${i}-${certData.fileName}`;
      const filePath = path.join(certificatesDir, fileName);
      
      fs.writeFileSync(filePath, dummyContent);
      const fileHash = generateFileHash(dummyContent);
      
      // Assign folder based on category
      let folderId = null;
      if (certData.category === 'TECHNICAL') {
        folderId = createdFolders.find(f => f.name === 'Technical Certifications')?.id;
      } else if (certData.category === 'ACADEMIC') {
        folderId = createdFolders.find(f => f.name === 'Academic Achievements')?.id;
      } else if (certData.certificateType === 'HACKATHON' || certData.certificateType === 'ACHIEVEMENT') {
        folderId = createdFolders.find(f => f.name === 'Competitions & Awards')?.id;
      } else {
        folderId = createdFolders.find(f => f.name === 'Professional Development')?.id;
      }

      try {
        const certificate = await prisma.certificate.create({
          data: {
            studentId: demoStudent.id,
            title: certData.title,
            organization: certData.organization,
            issueDate: new Date(certData.issueDate),
            expiryDate: certData.expiryDate ? new Date(certData.expiryDate) : null,
            certificateType: certData.certificateType,
            category: certData.category,
            fileUrl: `/uploads/certificates/${fileName}`,
            fileName: certData.fileName,
            fileType: 'application/pdf',
            fileSize: dummyContent.length,
            fileHash: fileHash,
            isImportant: certData.isImportant || false,
            isResumeVisible: certData.isResumeVisible || false,
            isPortfolioVisible: true,
            folderId: folderId,
            shareToken: generateShareToken(),
            metadata: JSON.stringify({
              extractedTitle: certData.title,
              extractedOrganization: certData.organization,
              extractedDate: certData.issueDate,
              confidence: 0.95
            })
          }
        });

        // Add tags
        for (const tagName of certData.tags) {
          await prisma.certificateTag.create({
            data: {
              certificateId: certificate.id,
              tag: tagName,
              tagType: 'SKILL'
            }
          });
        }

        // Add organization tag
        if (certData.organization) {
          try {
            await prisma.certificateTag.create({
              data: {
                certificateId: certificate.id,
                tag: certData.organization,
                tagType: 'ORGANIZATION'
              }
            });
          } catch (error) {
            // Ignore duplicate tag errors
          }
        }

        // Add year tag
        const year = new Date(certData.issueDate).getFullYear().toString();
        try {
          await prisma.certificateTag.create({
            data: {
              certificateId: certificate.id,
              tag: year,
              tagType: 'YEAR'
            }
          });
        } catch (error) {
          // Ignore duplicate tag errors
        }

        createdCertificates.push(certificate);
        console.log(`   ✓ Created certificate: ${certificate.title}`);
        
      } catch (error) {
        console.error(`   ✗ Failed to create certificate "${certData.title}":`, error.message);
        // Clean up file if certificate creation failed
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    console.log('\n✅ Certificate vault data seeded successfully!');
    
    // Show summary
    const totalCertificates = await prisma.certificate.count({
      where: { studentId: demoStudent.id }
    });
    const totalFolders = await prisma.certificateFolder.count({
      where: { studentId: demoStudent.id }
    });
    const totalTags = await prisma.certificateTag.count({
      where: {
        certificate: {
          studentId: demoStudent.id
        }
      }
    });
    
    console.log(`📊 Summary:`);
    console.log(`   - Total Certificates: ${totalCertificates}`);
    console.log(`   - Total Folders: ${totalFolders}`);
    console.log(`   - Total Tags: ${totalTags}`);
    console.log(`   - Resume-visible: ${createdCertificates.filter(c => c.isResumeVisible).length}`);
    console.log(`   - Important: ${createdCertificates.filter(c => c.isImportant).length}`);

    // Show folder distribution
    console.log(`\n📁 Folder Distribution:`);
    for (const folder of createdFolders) {
      const count = await prisma.certificate.count({
        where: {
          studentId: demoStudent.id,
          folderId: folder.id
        }
      });
      console.log(`   - ${folder.name}: ${count} certificates`);
    }

    // Show category distribution
    console.log(`\n📋 Category Distribution:`);
    const categories = await prisma.certificate.groupBy({
      by: ['category'],
      where: { studentId: demoStudent.id },
      _count: { category: true }
    });
    
    for (const cat of categories) {
      console.log(`   - ${cat.category}: ${cat._count.category} certificates`);
    }

  } catch (error) {
    console.error('Error seeding certificate data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCertificateData();