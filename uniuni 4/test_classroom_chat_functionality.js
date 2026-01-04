const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testClassroomChatFunctionality() {
  console.log('🧪 Testing Classroom Chat Functionality...\n');

  try {
    // Test 1: Get messages for a classroom
    console.log('1. Testing get messages...');
    const messagesResponse = await axios.get(`${API_BASE_URL}/classroom-chat/cs301/messages`);
    console.log('✅ Get messages successful');
    console.log(`   Found ${messagesResponse.data.data.messages.length} messages`);

    // Test 2: Send a new message
    console.log('\n2. Testing send message...');
    const messageData = {
      content: 'Hello from automated test! This is a test message.',
      senderId: 'demo-student-id'
    };
    
    const sendResponse = await axios.post(`${API_BASE_URL}/classroom-chat/cs301/messages`, messageData);
    console.log('✅ Send message successful');
    console.log(`   Message ID: ${sendResponse.data.data.message.id}`);
    const messageId = sendResponse.data.data.message.id;

    // Test 3: Add reaction to message
    console.log('\n3. Testing add reaction...');
    const reactionData = {
      emoji: '👍',
      userId: 'demo-student-id'
    };
    
    const reactionResponse = await axios.post(`${API_BASE_URL}/classroom-chat/messages/${messageId}/reactions`, reactionData);
    console.log('✅ Add reaction successful');
    console.log(`   Action: ${reactionResponse.data.data.action}`);

    // Test 4: Get online users
    console.log('\n4. Testing get online users...');
    const onlineUsersResponse = await axios.get(`${API_BASE_URL}/classroom-chat/cs301/online-users`);
    console.log('✅ Get online users successful');
    console.log(`   Online users: ${onlineUsersResponse.data.data.onlineUsers.length}`);

    // Test 5: Search messages
    console.log('\n5. Testing search messages...');
    const searchResponse = await axios.get(`${API_BASE_URL}/classroom-chat/cs301/search?q=test`);
    console.log('✅ Search messages successful');
    console.log(`   Found ${searchResponse.data.data.messages.length} matching messages`);

    // Test 6: Edit message
    console.log('\n6. Testing edit message...');
    const editData = {
      content: 'Hello from automated test! This message has been edited.',
      userId: 'demo-student-id'
    };
    
    const editResponse = await axios.put(`${API_BASE_URL}/classroom-chat/messages/${messageId}`, editData);
    console.log('✅ Edit message successful');
    console.log(`   Edited: ${editResponse.data.data.message.isEdited}`);

    // Test 7: Delete message
    console.log('\n7. Testing delete message...');
    const deleteData = {
      userId: 'demo-student-id'
    };
    
    const deleteResponse = await axios.delete(`${API_BASE_URL}/classroom-chat/messages/${messageId}`, { data: deleteData });
    console.log('✅ Delete message successful');

    console.log('\n🎉 All classroom chat functionality tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Get messages');
    console.log('   ✅ Send message');
    console.log('   ✅ Add reaction');
    console.log('   ✅ Get online users');
    console.log('   ✅ Search messages');
    console.log('   ✅ Edit message');
    console.log('   ✅ Delete message');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test
testClassroomChatFunctionality();