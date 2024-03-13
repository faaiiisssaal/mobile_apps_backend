// generateApiKey.js
const crypto = require("crypto");

const generateApiKey = () => {
    const apiKey = crypto.randomBytes(32).toString("hex");
    console.log("Generated API Key:", apiKey); // Log the generated API key
    return apiKey;
};

module.exports = generateApiKey;
