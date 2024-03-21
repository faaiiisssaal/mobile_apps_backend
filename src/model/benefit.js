const { Connection, Request, TYPES } = require("tedious");
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postBenefitUser = async (request, h) => {
  const { memberno, plan} = request.payload;

  // Validate empid
  if (!memberno || !plan) {
    if (!memberno) {
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
          const request = new Request("dbo.Benefit_Query", (err, rowCount) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

          request.addParameter('memberno', TYPES.VarChar, memberno);
          request.addParameter('plan', TYPES.VarChar, plan);

          request.on("row", (columns) => {
            const item = {
              no: columns[0].value,
              benefitName: columns[1].value,
              maxAmount: columns[2].value,
              pplan: columns[3].value,
              planName: columns[4].value,
              benefitID : columns[5].value,
              benefitNo: columns[6].value,
              annualLimit: columns[7].value,
              overalllimitamount : columns[8].value,
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
    postBenefitUser,
};
