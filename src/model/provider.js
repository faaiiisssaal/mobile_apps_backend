var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var async = require("async");

const { config } = require("../db/db");

const getProviderLoc = (request, h) => {

  var connection = new Connection(config); 
  connection.connect();  
  var result = []
  function responseVersion() {

    var request = 
    new Request(
      "SELECT DISTINCT P.ID, Ar.Description, Pr.Name, Pr.Address_1, Pr.Phone_1 FROM provider_facility PF INNER JOIN Provider P ON P.Pno = PF.PNO INNER JOIN Profile PR ON P.ID = PR.ID INNER JOIN Area AR ON AR.Area = PR.Area WHERE P.ProviderF = 1 ORDER BY Ar.Description ASC"
      , 
      function (err, rowCount, rows) {
        if (err) {
          closeConnection();
          console.log("Why "+err);
        } else {
          console.log("Data has done executed");
        }
      }
    ); 

    request.on("row", function (columns) {
         
    const item = {
        id: columns[0].value,
        description: columns[1].value,
        name: columns[2].value,
        address: columns[3].value,
        notelp: columns[4].value,
    };

      result.push({ ...item });
      console.log(item);

      item.area = "";
      item.description = "";
      item.name = "";
    });

    request.on("requestCompleted", function (rowCount, more) {
      connection.close();
    });
    connection.execSql(request);
  }

  function Complete(err, result) {
    if (err) {
      closeConnection();
    } else {
    }
  }

  connection.on("connect", function (err) {
    if (err) {
      closeConnection();
    } else {
      async.waterfall([responseVersion], Complete());
    }
  });

  function closeConnection() {
    message = "Connection Timeout";
    connection.close();
  }
  setTimeout(closeConnection, 8000);

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
      status  : "success",
      message : resolvedValue,
      data    : { 
                  result
                },
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
