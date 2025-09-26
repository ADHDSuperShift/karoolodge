// Test the upload handler locally
const handler = require('./handlers/upload.cjs');

const testEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        filename: 'test.jpg',
        contentType: 'image/jpeg',
        folder: 'uploads'
    }),
    headers: {
        'x-api-key': '79dc174817e715e1f30906b9f4d09be74d0323d8bf387962c95f728762e60159'
    }
};

handler.getUploadUrl(testEvent)
    .then(response => {
        console.log('Success:', JSON.stringify(response, null, 2));
    })
    .catch(error => {
        console.error('Error:', error);
    });
