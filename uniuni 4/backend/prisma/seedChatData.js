const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedChatData() {
  console.log('🗨️ Seeding classroom chat data...');

  try {
    // Get some existing users
    const users = await prisma.user.findMany({ take: 10 });
    
    if (users.length === 0) {
      console.log('No users found. Please run the main seed first.');
      return;
    }

    const classrooms = ['cs301', 'cs302', 'cs401', 'math201'];
    
    for (const classroomId of classrooms) {
      console.log(`Creating messages for ${classroomId}...`);
      
      // Create some sample messages
      const sampleMessages = [
        {
          content: "Good morning everyone! Hope you're all ready for today's lecture on binary trees.",
          senderId: users[0].id,
          messageType: 'text'
        },
        {
          content: "Hi Prof! I have a question about the assignment. When is it due?",
          senderId: users[1].id,
          messageType: 'text'
        },
        {
          content: "The assignment is due next Friday. Make sure to submit it before midnight!",
          senderId: users[0].id,
          messageType: 'text'
        },
        {
          content: "Can someone share the lecture notes from yesterday? I missed the class.",
          senderId: users[2].id,
          messageType: 'text'
        },
        {
          content: "Sure! I'll upload them to the files section.",
          senderId: users[3].id,
          messageType: 'text'
        },
        {
          content: "Thanks! Really appreciate it 😊",
          senderId: users[2].id,
          messageType: 'text'
        },
        {
          content: "Does anyone want to form a study group for the upcoming exam?",
          senderId: users[4].id,
          messageType: 'text'
        },
        {
          content: "I'm interested! When are you thinking?",
          senderId: users[5].id,
          messageType: 'text'
        },
        {
          content: "How about this weekend? We could meet in the library.",
          senderId: users[4].id,
          messageType: 'text'
        },
        {
          content: "Sounds good to me! Count me in 👍",
          senderId: users[1].id,
          messageType: 'text'
        }
      ];

      // Create messages with some time spacing
      for (let i = 0; i < sampleMessages.length; i++) {
        const messageData = sampleMessages[i];
        const createdAt = new Date(Date.now() - (sampleMessages.length - i) * 60000); // 1 minute apart
        
        const message = await prisma.chatMessage.create({
          data: {
            classroomId,
            senderId: messageData.senderId,
            content: messageData.content,
            messageType: messageData.messageType,
            createdAt
          }
        });

        // Add some reactions to random messages
        if (Math.random() > 0.7) {
          const reactors = users.slice(0, Math.floor(Math.random() * 3) + 1);
          const emojis = ['👍', '❤️', '😂', '😮'];
          
          for (const reactor of reactors) {
            if (reactor.id !== message.senderId) {
              try {
                await prisma.chatReaction.create({
                  data: {
                    messageId: message.id,
                    userId: reactor.id,
                    emoji: emojis[Math.floor(Math.random() * emojis.length)]
                  }
                });
              } catch (error) {
                // Ignore duplicate reactions
              }
            }
          }
        }
      }

      // Create some reply messages
      const messages = await prisma.chatMessage.findMany({
        where: { classroomId },
        take: 3
      });

      if (messages.length > 0) {
        await prisma.chatMessage.create({
          data: {
            classroomId,
            senderId: users[6].id,
            content: "Great question! Let me explain that in more detail.",
            messageType: 'text',
            replyToId: messages[0].id,
            createdAt: new Date()
          }
        });
      }
    }

    console.log('✅ Chat data seeded successfully!');
    
    // Show summary
    const totalMessages = await prisma.chatMessage.count();
    const totalReactions = await prisma.chatReaction.count();
    
    console.log(`📊 Summary:`);
    console.log(`   - Total Messages: ${totalMessages}`);
    console.log(`   - Total Reactions: ${totalReactions}`);
    console.log(`   - Classrooms: ${classrooms.length}`);

  } catch (error) {
    console.error('Error seeding chat data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChatData();