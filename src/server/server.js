require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../routes/routes");
const fs = require("node:fs");
const Jwt = require("jsonwebtoken");
const Bcrypt = require("bcrypt");
const crypto = require("crypto");
const generateApiKey = require("../properties/generateAPIkeys");
const apiKeyMiddleware = require("../properties/apiKeyMiddle");

// Get API key from environment variable or generate a new one
const apiKey = process.env.API_KEY || generateApiKey();

const init = async () => {
  const server = Hapi.server({
    port: 1433,
    host: "192.168.60.10",
    routes: {
      cors: {
        origin: ["*"],
      },
    },

    // tls: {
    //   key: fs.readFileSync("privkey.key", "ascii"),
    //   cert: fs.readFileSync("fullchaincert.crt", "ascii"),
    // },
  });

  // Apply the API key authorization middleware to all routes
  server.ext("onPreHandler", apiKeyMiddleware);

  server.route(routes);

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();