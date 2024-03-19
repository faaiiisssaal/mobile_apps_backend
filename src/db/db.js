var config = {
    server: "192.168.60.3",
    authentication: {
      type: "default",
      options: {
        userName: "query", // update me
        password: "ITtpa23", // update me
      },
    },
    options: {
      encrypt: false,
      database: "SEA_MEDAPI",
      collation: 'SQL_Latin1_General_CP1_CI_AS'
    },
  };
  
  module.exports = {
    config,
  };
  