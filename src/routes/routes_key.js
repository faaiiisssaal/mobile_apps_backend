const { generateToken, validateApiKey } = require('./auth');

const routes = [
  {
    method: 'POST',
    path: '/generateToken',
    handler: async (request, h) => {
      try {
        const { username, password } = request.payload;
        const tokens = await generateToken(username, password);
        return tokens;
      } catch (error) {
        return h.response(error.message).code(401);
      }
    },
  },
  {
    method: 'GET',
    path: '/protectedResource',
    handler: (request, h) => {
      const apiKey = request.headers['x-api-key'];
      const contentType = request.headers['content-type'];
      const accept = request.headers['accept'];
      const authorization = request.headers['authorization'];

      // Check for required headers
      if (!apiKey || !contentType || !accept || !authorization) {
        return h.response('Missing required headers').code(400);
      }

      // Validate API key
      if (validateApiKey(apiKey)) {
        return 'This is a protected resource.';
      } else {
        return h.response('Unauthorized').code(401);
      }
    },
  },
];

module.exports = routes_key;
