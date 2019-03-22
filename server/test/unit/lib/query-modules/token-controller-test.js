const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const tokenController = rewire("../../../../lib/query-modules/token-controller.js");

//Tests for query controller do NOT depend on action-actionLogger
//We can safely assume the function do not disturb execution of the program
const actionLogger = {
  logInsert:function() {
    return 4;
  },
  logUpdate:function() {
    return 3;
  },
  logDelete:function() {
    return 2;
  },
  logOther:function() {
    return 1;
  }
};
tokenController.__set__("actionLogger",actionLogger);

describe("Token controller functionality", function(){
  context("Request token cancelation", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(tokenController.returnToken);
    })
    it("Accept token cancelation request (STUBBED)", async function(){
      const dbController = {
        cancelEditing: async function() {
          return {status: "OK", response: "Editing successfully cancelled."}
        }
      }
      tokenController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      response.success.should.equal(true);
      response.response.should.equal("Token cancelled")
    })
    it("Reject token cancelation request - random error (STUBBED)", async function(){
      const dbController = {
        cancelEditing: async function() {
          return {status: "ERR", err: {error:"Stubbed error"}}
        }
      }
      tokenController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      response.success.should.equal(false);
      response.response.error.should.equal("Stubbed error")
    })
    it("Reject token cancelation request - SQL error (STUBBED)", async function(){
      const dbController = {
        cancelEditing: async function() {
          return {status: "ERR", err:{type:"SQL Error", error:"STUBBED ERROR"}}
        }
      }
      tokenController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR")
    })
  })
  context("Request token", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(tokenController.requestEditing);
    })
    it("Accept token request (STUBBED)", async function(){
      const dbController = {
        requestEditing: async function() {
          return {status: "OK", response:{token: "3000"}}
        }
      }
      tokenController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      response.should.equal("3000");
    })
    it("Reject token request (STUBBED)", async function(){
      const dbController = {
        requestEditing: async function() {
          return {status: "ERR", err:{error:"STUBBED ERROR"}}
        }
      }
      tokenController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      expect(typeof response).to.equal('undefined');
    })
  })
})
