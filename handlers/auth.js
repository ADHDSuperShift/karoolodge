// No AWS SDK needed for this simple auth handler

exports.getApiKey = async (event) => {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization"
            },
            body: ''
        };
    }

    try {
        // In production, you'd validate the JWT token here
        const body = JSON.parse(event.body || '{}');
        
        // Return the API key for authenticated users
        const apiKey = process.env.UPLOAD_API_KEY || '79dc174817e715e1f30906b9f4d09be74d0323d8bf387962c95f728762e60159';
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ apiKey })
        };
    } catch (error) {
        console.error('Error in getApiKey:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization"
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
