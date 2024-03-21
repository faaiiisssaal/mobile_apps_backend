const { getMemberData }             = require("../model/member");
const { getPolicyData }             = require("../model/policy");
const { getListMemData }            = require("../model/list_member");
const { getProviderArea }           = require("../model/area");
const { getProviderLoc }            = require("../model/provider");
const { postUserLogin }             = require("../model/user");
const { postFamilyUser }            = require("../model/family");
const { postBenefitUser }           = require("../model/benefit");
  
  const routes = [
  
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


    // Success Deploy API to Mobile Apps

    // LIST_USER
    {
      method: "POST",
      path: "/src/model/user",
      handler: (request, h) => {
        return postUserLogin(request, h);
      }
    },

    // LIST_FAMILY_USER
    {
      method: "POST",
      path: "/src/model/familyuser",
      handler: (request, h) => {
        return postFamilyUser(request, h);
      }
    },

    // LIST_BENEFIT_USER
    {
      method: "POST",
      path: "/src/model/benefituser",
      handler: (request, h) => {
        return postBenefitUser(request, h);
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
  