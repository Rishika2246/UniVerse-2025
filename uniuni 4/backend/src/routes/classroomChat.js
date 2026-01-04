const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure multer for file uploads in chat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/chat-files';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `chat-${uniqueSuffix}-${sanitizedName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload supported file formats.'));
    }
  }
});

// Get all messages for a classroom
router.get('/:classroomId/messages', async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const messages = await prisma.chatMessage.findMany({
      where: { classroomId },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true }
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: { id: true, fullName: true }
            }
          }
        },
        replies: {
          include: {
            sender: {
              select: { id: true, fullName: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset
    });

    res.json({
      success: true,
      data: { messages: messages.reverse() } // Reverse to show oldest first
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages: ' + error.message
    });
  }
});

// Send a new message
router.post('/:classroomId/messages', upload.array('attachments', 5), async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { content, messageType = 'text', replyToId, senderId = 'demo-student-id' } = req.body;

    if (!content && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message content or attachments required'
      });
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        classroomId,
        senderId,
        content: content || '',
        messageType,
        replyToId: replyToId || null
      },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const attachments = await Promise.all(
        req.files.map(file => 
          prisma.chatAttachment.create({
            data: {
              messageId: message.id,
              fileName: file.originalname,
              fileUrl: `/uploads/chat-files/${file.filename}`,
              fileType: file.mimetype,
              fileSize: file.size
            }
          })
        )
      );

      message.attachments = attachments;
    }

    res.json({
      success: true,
      data: { message }
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message: ' + error.message
    });
  }
});

// Add reaction to message
router.post('/messages/:messageId/reactions', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji, userId = 'demo-student-id' } = req.body;

    // Check if user already reacted with this emoji
    const existingReaction = await prisma.chatReaction.findFirst({
      where: {
        messageId,
        userId,
        emoji
      }
    });

    if (existingReaction) {
      // Remove reaction if it exists
      await prisma.chatReaction.delete({
        where: { id: existingReaction.id }
      });
      
      res.json({
        success: true,
        data: { action: 'removed', emoji }
      });
    } else {
      // Add new reaction
      const reaction = await prisma.chatReaction.create({
        data: {
          messageId,
          userId,
          emoji
        },
        include: {
          user: {
            select: { id: true, fullName: true }
          }
        }
      });

      res.json({
        success: true,
        data: { action: 'added', reaction }
      });
    }

  } catch (error) {
    console.error('Error handling reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error handling reaction: ' + error.message
    });
  }
});

// Delete message
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId = 'demo-student-id' } = req.body;

    // Check if user owns the message
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { attachments: true }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    // Delete associated files
    if (message.attachments) {
      for (const attachment of message.attachments) {
        const filePath = path.join(__dirname, '../../', attachment.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete message (cascade will handle attachments, reactions, replies)
    await prisma.chatMessage.delete({
      where: { id: messageId }
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message: ' + error.message
    });
  }
});

// Edit message
router.put('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, userId = 'demo-student-id' } = req.body;

    // Check if user owns the message
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages'
      });
    }

    // Update message
    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date()
      },
      include: {
        sender: {
          select: { id: true, fullName: true }
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: { id: true, fullName: true }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: { message: updatedMessage }
    });

  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({
      success: false,
      message: 'Error editing message: ' + error.message
    });
  }
});

// Get online users in classroom
router.get('/:classroomId/online-users', async (req, res) => {
  try {
    const { classroomId } = req.params;

    // In a real implementation, you'd track online users with WebSocket connections
    // For now, return mock data
    const onlineUsers = [
      { id: 'demo-student-id', fullName: 'Demo Student', lastSeen: new Date() },
      { id: 'user-2', fullName: 'Aarav Sharma', lastSeen: new Date() },
      { id: 'user-3', fullName: 'Diya Patel', lastSeen: new Date() }
    ];

    res.json({
      success: true,
      data: { onlineUsers }
    });

  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching online users: ' + error.message
    });
  }
});

// Mark messages as read
router.post('/:classroomId/mark-read', async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { userId = 'demo-student-id', messageIds } = req.body;

    // In a real implementation, you'd track read status
    // For now, just return success
    res.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read: ' + error.message
    });
  }
});

// Search messages
router.get('/:classroomId/search', async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { q, type = 'all', limit = 20 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const whereClause = {
      classroomId,
      content: {
        contains: q,
        mode: 'insensitive'
      }
    };

    if (type !== 'all') {
      whereClause.messageType = type;
    }

    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { id: true, fullName: true }
        },
        attachments: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({
      success: true,
      data: { messages }
    });

  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching messages: ' + error.message
    });
  }
});

module.exports = router;