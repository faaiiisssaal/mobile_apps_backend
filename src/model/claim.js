const { Connection, Request, TYPES } = require("tedious");
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postClaimMember = async (request, h) => {
  const { memberno, policyid } = request.payload;

  const connection = new Connection(config);
  let result = [];

  try {
    await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          reject(err);
        } else {
          const request = new Request("dbo.List_Claim_User", (err, rowCount) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

          request.addParameter('memberno', TYPES.VarChar, memberno);
          request.addParameter('policyid', TYPES.VarChar, policyid);

          request.on("row", (columns) => {
            const item = {
              cno: columns[8].value,
              refNo: columns[20].value,
              productType: columns[18].value,
              provider: columns[14].value,
              start: columns[16].value,
              finish: columns[17].value,
              doctor: columns[21].value,
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
