const crypto = require('crypto');

// Function to generate a secure random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

// Generate secure access and refresh token secrets
const accessSecret = generateRandomString(128);
const refreshSecret = generateRandomString(128);

console.log(`ACCESS_TOKEN_SECRET=${accessSecret}`);
console.log(`REFRESH_TOKEN_SECRET=${refreshSecret}`);
