const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

const users = {
  john: {
    username: 'john',
    password: '$2b$10$sdv1w6wOelBlULkM2KpFGODxSsW/n5lQbMQ9H4fZDk7bXeFb0lEny',
  },
};

const apiKeys = {
  apiKey: process.env.API_KEY,
};

const secretKey = 'your_secret_key';

const generateToken = async (username, password) => {
  if (users[username] && (await Bcrypt.compare(password, users[username].password))) {
    const accessToken = Jwt.sign({ username }, secretKey, { expiresIn: '15m' });
    const refreshToken = Jwt.sign({ username }, secretKey, { expiresIn: '1d' });

    return { accessToken, refreshToken };
  } else {
    throw new Error('Invalid credentials');
  }
};

const validateApiKey = (apiKey) => {
  return apiKey && apiKeys[apiKey];
};

module.exports = { generateToken, validateApiKey };
