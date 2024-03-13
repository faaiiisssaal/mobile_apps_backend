// apiKeyMiddleware.js
const apiKeyMiddleware = (request, h) => {
    const requestApiKey = request.headers.authorization;
  
    if (requestApiKey !== process.env.API_KEY) {
      return h.response({ error: "Unauthorized" }).code(401);
    }
  
    return h.continue;
  };
  
  module.exports = apiKeyMiddleware;
  