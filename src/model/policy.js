const { Connection, Request, TYPES } = require("tedious");
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postPolicyData = async (request, h) => {
  const { clientID } = request.payload;

  const connection = new Connection(config);
  let result = [];

  try {
    await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          reject(err);
        } else {
          const request = new Request("dbo.Policy_Check", (err, rowCount) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

          request.addParameter('clientID', TYPES.VarChar, clientID);

          request.on("row", (columns) => {
            const item = {
              effectiveDate: columns[0].value,
              renewalDate: columns[1].value,
              policyID: columns[2].value,
              clientID: columns[3].value,
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
  postPolicyData,
};
