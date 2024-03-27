const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const { TYPES } = require("tedious");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postUserLogin = async (request, h) => {
  const { memberno, bdate } = request.payload;

  // Validate memberno and bdate
  if (!memberno || !bdate) {
    return handleFailure("Member number and birthdate are required", h);
  }

  const connection = new Connection(config);
  let result = [];

  try {
    await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          reject(err);
        } else {
          const request = new Request("dbo.Login_User_Query", (err, rowCount, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
          request.addParameter('memberno', TYPES.VarChar, memberno);
          request.addParameter('bdate', TYPES.SmallDateTime, bdate);

          request.on("row", (columns) => {
            const item = {
              companyName: columns[0].value,
              clientID: columns[1].value,
              policyNo: columns[2].value,
              cardNo: columns[3].value,
              empID: columns[4].value,
              memberID: columns[5].value,
              memberName: columns[6].value,
              classNo: columns[7].value,
              memberSex: columns[8].value,
              memberPlan: columns[9].value,
              memberBirthDate: columns[10].value,
              effectiveDate: columns[11].value,
              ipDetail: columns[12].value,
              opDetail: columns[13].value,
            }; 
            result.push(item);
            console.log(item);
          });

          request.on("requestCompleted", (rowCount, more) => {
            resolve();
          });

          connection.callProcedure(request);
        }
      });
      connection.connect();
    });

    if (result.length === 0) {
      throw new Error("No data found for the provided credentials");
    }

    const token = generateToken(memberno, bdate);
    return handleSuccess(token, result, h);
  } catch (error) {
    return handleFailure(error.message, h);
  } finally {
    connection.close();
  }
};

const generateToken = (memberno, bdate) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ memberno, bdate }, secretKey, { expiresIn: '1h' });
};

const handleSuccess = (token, result, h) => {
  return h.response({
    status: "success",
    message: "Login successful",
    data: {
      token: token,
      result
    },
  }).code(200);
};

const handleFailure = (rejectionReason, h) => {
  return h.response({
    status: "failure",
    message: "Login failed",
    rejectionReason
  }).code(401);
};

module.exports = {
  postUserLogin,
};
