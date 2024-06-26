var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var async = require("async");

const { config } = require("../db/db");

const getProviderArea = (request, h) => {

  var connection = new Connection(config); // load data from another file
  connection.connect();  // Connecting to the Server

  // Initialize for data Query
  var result = [
  ]

  function responseVersion() {

    // Read all rows from table
    var request = 
    new Request(
      "SELECT DISTINCT PR.Area, AR.Description FROM provider_facility PF INNER JOIN Provider P ON P.Pno = PF.PNO INNER JOIN Profile PR ON P.ID = PR.ID INNER JOIN Area AR ON AR.Area = PR.Area WHERE P.ProviderF = 1 AND AR.Description IS NOT NULL AND Pr.Area LIKE '%%' AND Pr.Area NOT IN ('11', 'N/A') ORDER BY PR.Area ASC", 
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
        area: columns[0].value,
        description: columns[1].value
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
    getProviderArea,
};
