const cloudinary = require('./config/cloudinary').cloudinary;

// Test Cloudinary connection
async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');
    
    // Test upload a simple text file
    const result = await cloudinary.uploader.upload('data:text/plain;base64,SGVsbG8gV29ybGQ=', {
      folder: 'timebank/test',
      public_id: 'test-connection',
      resource_type: 'raw'
    });
    
    console.log('✅ Cloudinary test successful!');
    console.log('File URL:', result.secure_url);
    
    // Clean up test file
    await cloudinary.uploader.destroy('timebank/test/test-connection', { resource_type: 'raw' });
    console.log('✅ Test file cleaned up');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testCloudinary();
