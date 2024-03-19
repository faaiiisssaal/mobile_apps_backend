const { postBenefitData }        = require("../model/benefit");
const { getMemberData }         = require("../model/member");
const { getPolicyData }         = require("../model/policy");
const { getListMemData }        = require("../model/list_member");
const { getProviderArea }       = require("../model/area");
const { getProviderLoc }        = require("../model/provider");
const { postUserLogin }          = require("../model/user");
  
  const routes = [
    
    //BENEFIT
    {
      method: "POST",
      path: "/src/model/benefit",
      handler: postBenefitData,
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
      method: "POST",
      path: "/src/model/user",
      handler: (request, h) => {
        return postUserLogin(request, h);
      }
    },

    // PROVIDER LOC
    {
      method: "GET",
      path: "/src/model/provider",
      handler: getProviderLoc
    },
  ];
  
  module.exports = routes;
  