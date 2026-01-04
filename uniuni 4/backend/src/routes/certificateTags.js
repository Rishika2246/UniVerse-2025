const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all tags for a student's certificates
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId || 'demo-student-id';
    
    const tags = await prisma.certificateTag.findMany({
      where: {
        certificate: {
          studentId
        }
      },
      select: {
        tag: true,
        tagType: true
      },
      distinct: ['tag', 'tagType']
    });
    
    // Group tags by type
    const groupedTags = tags.reduce((acc, { tag, tagType }) => {
      if (!acc[tagType]) {
        acc[tagType] = [];
      }
      if (!acc[tagType].includes(tag)) {
        acc[tagType].push(tag);
      }
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: { tags: groupedTags }
    });
    
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tags: ' + error.message 
    });
  }
});

// Add tags to certificate
router.post('/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { tags } = req.body;
    
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tags array is required'
      });
    }
    
    // Verify certificate exists
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId }
    });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Add tags (ignore duplicates)
    const createdTags = [];
    for (const tag of tags) {
      try {
        const createdTag = await prisma.certificateTag.create({
          data: {
            certificateId,
            tag: tag.name || tag.tag,
            tagType: tag.type || tag.tagType || 'SKILL'
          }
        });
        createdTags.push(createdTag);
      } catch (error) {
        // Ignore duplicate tag errors
        if (!error.message.includes('Unique constraint')) {
          throw error;
        }
      }
    }
    
    res.json({
      success: true,
      data: { tags: createdTags },
      message: `${createdTags.length} tags added successfully`
    });
    
  } catch (error) {
    console.error('Error adding tags:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding tags: ' + error.message 
    });
  }
});

// Remove tag from certificate
router.delete('/:certificateId/:tag', async (req, res) => {
  try {
    const { certificateId, tag } = req.params;
    
    const deletedTag = await prisma.certificateTag.deleteMany({
      where: {
        certificateId,
        tag: decodeURIComponent(tag)
      }
    });
    
    res.json({
      success: true,
      data: { deletedCount: deletedTag.count },
      message: 'Tag removed successfully'
    });
    
  } catch (error) {
    console.error('Error removing tag:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing tag: ' + error.message 
    });
  }
});

// Get popular tags (most used)
router.get('/popular', async (req, res) => {
  try {
    const studentId = req.query.studentId || 'demo-student-id';
    const limit = parseInt(req.query.limit) || 20;
    
    const popularTags = await prisma.certificateTag.groupBy({
      by: ['tag', 'tagType'],
      where: {
        certificate: {
          studentId
        }
      },
      _count: {
        tag: true
      },
      orderBy: {
        _count: {
          tag: 'desc'
        }
      },
      take: limit
    });
    
    const formattedTags = popularTags.map(item => ({
      tag: item.tag,
      tagType: item.tagType,
      count: item._count.tag
    }));
    
    res.json({
      success: true,
      data: { tags: formattedTags }
    });
    
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching popular tags: ' + error.message 
    });
  }
});

// Get tag suggestions based on certificate type and organization
router.get('/suggestions', async (req, res) => {
  try {
    const { certificateType, organization } = req.query;
    
    const suggestions = [];
    
    // Skill suggestions based on certificate type
    const skillSuggestions = {
      'COURSE': ['Programming', 'Web Development', 'Data Science', 'Machine Learning', 'Database'],
      'INTERNSHIP': ['Professional Experience', 'Industry Knowledge', 'Teamwork', 'Project Management'],
      'HACKATHON': ['Problem Solving', 'Innovation', 'Rapid Development', 'Collaboration'],
      'WORKSHOP': ['Learning', 'Skill Development', 'Networking', 'Professional Growth'],
      'EXAM': ['Certification', 'Technical Knowledge', 'Assessment', 'Qualification'],
      'ACHIEVEMENT': ['Excellence', 'Recognition', 'Leadership', 'Performance']
    };
    
    if (certificateType && skillSuggestions[certificateType]) {
      suggestions.push(...skillSuggestions[certificateType].map(skill => ({
        tag: skill,
        tagType: 'SKILL',
        source: 'type_based'
      })));
    }
    
    // Organization-based suggestions
    if (organization) {
      suggestions.push({
        tag: organization,
        tagType: 'ORGANIZATION',
        source: 'organization'
      });
      
      // Add year suggestion
      const currentYear = new Date().getFullYear();
      suggestions.push({
        tag: currentYear.toString(),
        tagType: 'YEAR',
        source: 'current_year'
      });
    }
    
    // Get popular tags from similar certificates
    if (certificateType) {
      try {
        const similarTags = await prisma.certificateTag.groupBy({
          by: ['tag', 'tagType'],
          where: {
            certificate: {
              certificateType
            }
          },
          _count: {
            tag: true
          },
          orderBy: {
            _count: {
              tag: 'desc'
            }
          },
          take: 5
        });
        
        suggestions.push(...similarTags.map(item => ({
          tag: item.tag,
          tagType: item.tagType,
          count: item._count.tag,
          source: 'similar_certificates'
        })));
      } catch (error) {
        // Ignore errors in fetching similar tags
      }
    }
    
    // Remove duplicates
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
      index === self.findIndex(s => s.tag === suggestion.tag && s.tagType === suggestion.tagType)
    );
    
    res.json({
      success: true,
      data: { suggestions: uniqueSuggestions }
    });
    
  } catch (error) {
    console.error('Error fetching tag suggestions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching suggestions: ' + error.message 
    });
  }
});

module.exports = router;