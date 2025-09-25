const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
};

exports.getApiKey = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: require('./baseHeaders'), body: '' };
  }

  try {
    const apiKey =
      process.env.UPLOAD_API_KEY ||
      '79dc174817e715e1f30906b9f4d09be74d0323d8bf387962c95f728762e60159';

    return {
      statusCode: 200,
  headers: { ...require('./baseHeaders'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    };
  } catch (err) {
    return {
      statusCode: 500,
  headers: require('./baseHeaders'),
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
