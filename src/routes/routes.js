const { getMemberData }             = require("../model/member");
const { getListMemData }            = require("../model/list_member");
const { postPolicyData }            = require("../model/policy");
const { getProviderArea }           = require("../model/area");
const { postProviderLoc }           = require("../model/provider");
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

    //POLICY
    {
      method: "POST",
      path: "/src/model/policysort",
      handler: (request, h) => {
        return postPolicyData(request, h);
      }
    },

    //LIST_CLAIM_USER
    {
      method: "POST",
      path: "/src/model/listclaim",
      handler: (request, h) => {
        return postPolicyData(request, h);
      }
    },

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
      method: "POST",
      path: "/src/model/provider",
      handler: (request, h) => {
        return postProviderLoc(request, h);
      }
    },
  ];
  
  module.exports = routes;
  