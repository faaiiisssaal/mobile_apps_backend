const { Connection, Request, TYPES } = require("tedious");
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postFamilyUser = async (request, h) => {
    const { empid } = request.payload;
  
    // Validate empid
    if (!empid) {
      if (!empid) {
          return handleFailure("Member ID is required", h);
      } else {
          return handleFailure("Plan is required", h);
      }
  }
  
    const connection = new Connection(config);
    let result = [];
  
    try {
      await new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
          if (err) {
            reject(err);
          } else {
            const request = new Request("dbo.Family_Member_Query", (err, rowCount) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
  
            request.addParameter('empid', TYPES.VarChar, empid);
  
            request.on("row", (columns) => {
              const item = {
                name: columns[0].value,
                memberno: columns[1].value,
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
    postFamilyUser,
};
