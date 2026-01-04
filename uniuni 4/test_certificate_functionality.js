const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testCertificateFunctionality() {
  console.log('🧪 Testing Certificate Vault Functionality...\n');

  try {
    // Test 1: Get existing certificates
    console.log('1. Testing certificate retrieval...');
    const certsResponse = await axios.get(`${API_BASE_URL}/certificates`);
    console.log(`   ✅ Found ${certsResponse.data.data.certificates.length} certificates`);

    // Test 2: Get existing folders
    console.log('2. Testing folder retrieval...');
    const foldersResponse = await axios.get(`${API_BASE_URL}/certificate-folders`);
    console.log(`   ✅ Found ${foldersResponse.data.data.folders.length} folders`);

    // Test 3: Create a new folder
    console.log('3. Testing folder creation...');
    const newFolderData = {
      name: 'Test Folder ' + Date.now(),
      description: 'A test folder created by automation',
      color: '#FF5722'
    };

    const createFolderResponse = await axios.post(`${API_BASE_URL}/certificate-folders`, newFolderData);
    if (createFolderResponse.data.success) {
      console.log(`   ✅ Created folder: ${createFolderResponse.data.data.folder.name}`);
      console.log(`   📁 Folder ID: ${createFolderResponse.data.data.folder.id}`);
    } else {
      console.log(`   ❌ Failed to create folder: ${createFolderResponse.data.message}`);
    }

    // Test 4: Verify folder appears in list
    console.log('4. Verifying new folder appears in list...');
    const updatedFoldersResponse = await axios.get(`${API_BASE_URL}/certificate-folders`);
    const newFolder = updatedFoldersResponse.data.data.folders.find(f => f.name === newFolderData.name);
    if (newFolder) {
      console.log(`   ✅ New folder found in list with color: ${newFolder.color}`);
    } else {
      console.log(`   ❌ New folder not found in list`);
    }

    console.log('\n🎉 Certificate functionality tests completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Total certificates: ${certsResponse.data.data.certificates.length}`);
    console.log(`   - Total folders: ${updatedFoldersResponse.data.data.folders.length}`);
    console.log(`   - New folder created: ${newFolderData.name}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
testCertificateFunctionality();