var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var async = require("async");

const { config } = require("../db/connect");

const getProviderLoc = (request, h) => {

  var connection = new Connection(config); // load data from another file
  connection.connect();  // Connecting to the Server

  // Initialize for data Query
  var result = [
  ]

  function responseVersion() {

    // Read all rows from table
    var request = 
    new Request(
      "SELECT P.ID, P.Name, P.Address_1, P.Address_2, A.Description FROM Profile P INNER JOIN Area A ON P.Area = A.Area ORDER BY Description ASC", 
      function (err, rowCount, rows) {
        if (err) {
          closeConnection();
        } else {
          console.log("Data has done executed");
        }
      }
    ); 

    // Print the rows read
    request.on("row", function (columns) {
      const item = {
        Area: columns[0].value,
        Description: columns[1].value
      };
    
      // Add a clone of the 'item' object to the 'result' array
      result.push({ ...item });

      // print the "item" data in terminal
      console.log(item);
      
      // Reset the 'item' object properties for the next iteration
      item.Area = "";
      item.Description = "";
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


  // Send JSON Response
  const checkResponse = async () => {
    return new Promise((resolve, reject) => {
      connection.on("end", function () {
        if (Object.keys(result).length === 0) {
          reject("Empty data");
        } else {
          resolve("Available data");
        }
      });
    });
  };

  const handleSuccess = (resolvedValue) => {
    const response = h.response({
      status: "success",
      message: resolvedValue,
      data: { result },
    });
    response.code(200);
    return response;
  };

  const handleFailure = (rejectionReason) => {
    const response = h.response({
      status: "success-empty",
      data: { result },
      rejectionReason,
    });
    response.code(200);
    return response;
  };

  return checkResponse().then(handleSuccess, handleFailure);
};

module.exports = {
    getProviderLoc,
};