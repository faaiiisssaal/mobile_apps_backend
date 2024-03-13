var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var async = require("async");
const jwt = require('jsonwebtoken');

const { config } = require("../db/db");

const getUserLogin = (request, h) => {

  var connection = new Connection(config); // load data from another file
  connection.connect();  // Connecting to the Server

  // Initialize for data Query
  var result = [
  ]

  function responseVersion() {

    // Read all rows from table
    var request =
      new Request(
        "....",
        function (err, rowCount, rows) {
          if (err) {
            closeConnection();
          } else {
            console.log("Data has executed");
          }
        }
      );

    // Print the rows read
    request.on("row", function (columns) {
      const item = {
        Namee: columns[0].value,
        Birth_Date: columns[1].value
      };

      // Add a clone of the 'item' object to the 'result' array
      result.push({ ...item });

      // print the "item" data in terminal
      console.log(item);

      // Reset the 'item' object properties for the next iteration
      item.Namee = "";
      item.Birth_Date = "";
    });

    // Event handler for the "requestCompleted" event
    // This event is triggered when the SQL request has been successfully completed

    request.on("requestCompleted", function (rowCount, more) {
      // Close the database connection
      connection.close();
    });

    // Execute SQL statement
    connection.execSql(request);
  }

  function Complete(err, result) {
    if (err) {
      closeConnection();
    } else {
    }
  }

  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", function (err) {
    if (err) {
      closeConnection();
    } else {
      // Execute all functions in the array serially
      async.waterfall([responseVersion], Complete());
    }
  });

  function closeConnection() {
    message = "Connection Timeout";
    connection.close();
  }

  // Timeout Connection
  setTimeout(closeConnection, 8000);

  // Generate JWT token
  function generateToken(username) {
    return jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
  }

  // Send JSON Response
  const checkResponse = async () => {
    return new Promise((resolve, reject) => {
      connection.on("end", function () {
        if (Object.keys(result).length === 0) {
          reject("Empty data");
        } else {
          const token = generateToken(username); // Assuming you have access to the username
          resolve(token);
        }
      });
    });
  };

  const handleSuccess = (token) => {
    const response = h.response({
      status: "success",
      message: "Login successful",
      token: token,
      data: { result },
    });
    response.code(200);
    return response;
  };

  const handleFailure = (rejectionReason) => {
    const response = h.response({
      status: "failure",
      message: "Login failed",
      rejectionReason,
    });
    response.code(401);
    return response;
  };

  return checkResponse().then(handleSuccess, handleFailure);
};

module.exports = {
  getUserLogin,
};
