require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../routes/routes");
const fs = require("node:fs");

const init = async () => {
  const server = Hapi.server({
    port: 1433,
    host: "192.168.60.10",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();