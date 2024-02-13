const { getBenefitData }        = require("../model/benefit");
const { getMemberData }         = require("../model/member");
const { getPolicyData }         = require("../model/policy");
const { getListMemData }        = require("../model/list_member");
const { getProviderArea }       = require("../model/area");
const { getProviderLoc }        = require("../model/provider");
const { getUserLogin }          = require("../user/user");
  
  const routes = [
    //BENEFIT
    {
      method: "GET",
      path: "/src/model/benefit",
      handler: getBenefitData,
    },

    //MEMBER
    {
      method: "GET",
      path: "/src/model/member",
      handler: getMemberData,
    },

    //POLICY
    {
      method: "GET",
      path: "/src/model/policy",
      handler: getPolicyData,
    },

    // LIST_MEMBER
    {
      method: "GET",
      path: "/src/model/list_member",
      handler: getListMemData
    },

    // PROVIDER AREA
    {
      method: "GET",
      path: "/src/model/area",
      handler: getProviderArea
    },

    // LIST_USER
    {
      method: "GET",
      path: "/src/user/user",
      handler: getUserLogin
    },

    // PROVIDER LOC
    {
      method: "GET",
      path: "/src/model/provider",
      handler: getProviderLoc
    },
  ];
  
  module.exports = routes;
  