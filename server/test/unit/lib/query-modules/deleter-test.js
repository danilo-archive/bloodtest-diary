const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const deleter = rewire("../../../../lib/query-modules/deleter.js");

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
deleter.__set__("actionLogger",actionLogger);

describe("Deleter queries tests", function(){
    context("Delete hospital", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(deleter.deleteHospital);
      })
      it("Fail deletion due to an error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          }
        }
        deleter.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Accept delete request (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "OK", err: {query:"OK", affectedRows:1}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
    context("Delete carer", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(deleter.deleteCarer);
      })
      it("Fail deletion due to an error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Accept delete request (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "OK", err: {query:"OK", affectedRows:1}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
    context("Delete test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(deleter.deleteTest);
      })
      it("Fail deletion due to an error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("500");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Accept delete request (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "OK", err: {query:"OK", affectedRows:1}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("600");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
    context("Delete patient", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(deleter.deletePatient);
      })
      it("Fail deletion due to an error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Accept delete request (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "OK", err: {query:"OK", affectedRows:1}
          }
        }}
        deleter.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
})
describe("Other functionality", function(){
  context("Execute delete query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(deleter.deleteQueryDatabase);
    })
    it("Correctly execute delete query (STUBBED)", async function(){
      const dbController = {
        deleteQuery: async function() {
          return {status: "OK", response: {query: "OK",  affectedRows: 1}}
        }
      }
      deleter.__set__("databaseController",dbController);
      const response = await spy("table","id","sql", "actionUsername");
      response.success.should.equal(true);
      response.response.should.equal("Entry deleted");
    })
    it("Reject delete query - random error (STUBBED)", async function(){
      const dbController = {
        deleteQuery: async function() {
          return {status: "ERR", err:{error:"STUBBED ERROR"}}
        }
      }
      deleter.__set__("databaseController",dbController);
      const response = await spy("table","id","sql", "actionUsername");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR")
    })
    it("Reject delete query - SQL error (STUBBED)", async function(){
      const dbController = {
        deleteQuery: async function() {
          return {status: "ERR", err:{type:"SQL Error", error:"STUBBED ERROR"}}
        }
      }
      deleter.__set__("databaseController",dbController);
      const response = await spy("table","id","sql", "actionUsername");
      response.success.should.equal(false);
    })
  })
  context("Prepare delete query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(deleter.prepareDeleteSQL);
    })
    it("Prepare Delete query 1", function() {
      const sql = spy("Test", "test_id", "400")
      sql.should.equal("DELETE FROM Test WHERE test_id='400' LIMIT 1;");
    })
    it("Prepare Delete query 2", function() {
      const sql = spy("Patient", "patient_no", "500")
      sql.should.equal("DELETE FROM Patient WHERE patient_no='500' LIMIT 1;");
    })
  })
})
