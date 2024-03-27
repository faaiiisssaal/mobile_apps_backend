const { Connection, Request, TYPES } = require("tedious");
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postClaimMember = async (request, h) => {
  const { cno, type } = request.payload;

  const connection = new Connection(config);
  let result = [];

  try {
    await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          reject(err);
        } else {
          const request = new Request("dbo.Provider_Location", (err, rowCount) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

          request.addParameter('cno', TYPES.VarChar, cno);
          request.addParameter('type', TYPES.VarChar, type);

          request.on("row", (columns) => {
            const item = {
              id: columns[2].value,
              description: columns[1].value,
              name: columns[5].value,
              address: columns[3].value,
              notelp: columns[4].value,
              ip: columns[6].value,
              op: columns[7].value,
              dt: columns[8].value,
              ma: columns[9].value,
            }; 
            result.push(item);
            console.log(item);
          });

          request.on("requestCompleted", () => {
            resolve();
          });

          connection.callProcedure(request);
        }
      });
      connection.connect();
    });

    if (result.length === 0) {
      throw new Error("No data found");
    }

    return handleSuccess(result, h);
  } catch (error) {
    return handleFailure(error.message, h);
  } finally {
    connection.close();
  }
};

const handleSuccess = (result, h) => {
  return h.response({
    status: "success",
    message: "Data has been retrieved successfully",
    data: {
      result
    },
  }).code(200);
};

const handleFailure = (rejectionReason, h) => {
  return h.response({
    status: "failure",
    message: "Failed to retrieve data",
    rejectionReason
  }).code(401);
};

module.exports = {
  postClaimMember,
};
