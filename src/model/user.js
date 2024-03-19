const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const { TYPES } = require("tedious");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const { config } = require("../db/db");

const postUserLogin = async (request, h) => {
  const { memberno, bdate } = request.payload;
  const connection = new Connection(config);
  try {
    const result = await new Promise((resolve, reject) => {
      connection.on('connect', (err) => {
        if (err) {
          reject(err);
        } else {
          const request = new Request("dbo.Login_User_Query", (err, rowCount, rows) => {
            if (err) {
              reject(err);
            }
          });
          request.addParameter('memberno', TYPES.VarChar, memberno);
          request.addParameter('bdate', TYPES.SmallDateTime, bdate);

          const result = [];
          request.on("row", (columns) => {
            const item = {
              company_name: columns[0].value,
              policy_no: columns[1].value,
              card_no: columns[2].value,
              emp_id: columns[3].value,
              member_id: columns[4].value,
              member_name: columns[5].value,
              class_no: columns[6].value,
              member_sex: columns[7].value,
              member_plan: columns[8].value,
              member_birth_date: columns[9].value,
              effective_date: columns[10].value,
              ip_detail: columns[11].value,
              op_detail: columns[12].value,
            };
            result.push(item);
            console.log(item);
          });

          request.on("requestCompleted", (rowCount, more) => {
            resolve(result);
          });

          connection.callProcedure(request);
        }
      });
      connection.connect();
    });
    const token = generateToken(memberno);
    return handleSuccess(token, result, h);
  } catch (error) {
    return handleFailure(error.message, h);
  } finally {
    connection.close();
  }
};

const generateToken = (memberno) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ memberno }, secretKey, { expiresIn: '1h' });
};

const handleSuccess = (token, result, h) => {
  return h.response({
    status: "success",
    message: "Login successful",
    token: token,
    result: result
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
