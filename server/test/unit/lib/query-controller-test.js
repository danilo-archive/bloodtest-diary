const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);

var queryController = rewire("../../../lib/query-controller");

describe("Select queries tests", function(){
  context("Get All patients", function(){
    test(queryController.getAllPatients);
  })
  context("Get All Tests", function(){
    test(queryController.getAllTests)
  })
  context("Get All Tests of Patient", function(){
    test(queryController.getTestsOfPatient,"50005");
  })
  context("Get User", function(){
    test(queryController.getUser,"admin");
  });
  context("Get All tests on date", function(){
    test(queryController.getAllTestsOnDate,"2018-04-03");
  });
  context("Get Overdue tests", function(){
    test(queryController.getOverdueTests);
  });
  context("Get Overdue tests with additional data", function(){
    test(queryController.getOverdueTestsExtended);
  });
  context("Get Tests Within week", function(){
    var spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.getTestWithinWeek);
    })
    it("Should return error (STUBBED)", async function(){
      var dbController = {
        selectQuery: async function(sql) {
          return {status:"OK", response:{ rows:[]}}
        }
      }
      queryController.__set__("databaseController",dbController);
      let response = await spy("2018-04-03");
      if(data)
      {
        spy.calledWith("2018-04-03").should.equal(true);
      }
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(6);
    });
    it("Should return all patients (STUBBED)", async function(){;
        var dbController = {
          selectQuery: async function(sql) {
            return {status: "ERR", err:{ }}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2018-04-03");
        if(data)
        {
          spy.calledWith("2018-04-03").should.equal(true);
        }
        spy.calledOnce.should.equal(true);
        response.success.should.equal(false);
    });
  });
});

describe("Insert queries tests", function(){
    context("Insert new test", function(){
      var spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.addTest);
      })
      it("Should accept new test", async function() {
        var dbController = {
          insertQuery: async function(sql) {
            return {status:"OK"}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("50005","2018-03-04",null,"weekly",1);
        spy.calledWith("50005","2018-03-04",null,"weekly",1).should.equal(true);
        spy.calledOnce.should.equal(true);
        response.success.should.equal(true);
      })
      it("Should reject new test", async function() {
        var dbController = {
          insertQuery: async function(sql) {
            return {status:"ERR"}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy();
        spy.calledOnce.should.equal(true);
        response.success.should.equal(false);
      })
    })
})

describe("Update queries tests", function(){
    context("Change test status", function(){
      var spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.changeTestStatus);
      })
      it("Fail, as sombody is editing", async function(){
        var dbController = {
          requestEditing: async function(sql) {
            return {status: "ERR", response:{}}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2000","ERRROR");
        response.success.should.equal(false);
        spy.calledOnce.should.equal(true);
      })
      it("Reject random update", async function(){
        var dbController = {
          requestEditing: async function(sql) {
            return {status: "Ok", response:{ token:"30000" }}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2000","ERRROR");
        response.success.should.equal(false);
        response.response.token.should.equal("30000");
        spy.calledOnce.should.equal(true);
      })
      it("Accept completed update", async function(){
        var dbController = {
          requestEditing: async function(sql) {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function(sql) {
            return {status: "OK", response:{affectedRows:1}}
          },
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2000","completed");
        console.log(response);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject compled update", async function(){
        var dbController = {
          requestEditing: async function(sql) {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function(sql) {
            return {status: "ERR", response:{error:"Error here"}}
          },
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2000","completed");
        console.log(response);
        response.success.should.equal(true);
        response.response.error.should.equal("Error here");
        spy.calledOnce.should.equal(true);
      })
      it("Accept late update", async function(){
        var dbController = {
          requestEditing: async function(sql) {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function(sql) {
            return {status: "OK", response:{affectedRows:1}}
          },
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2000","late");
        console.log(response);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject late update", async function(){
        var dbController = {
          requestEditing: async function(sql) {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function(sql) {
            return {status: "ERR", response:{error:"Error here"}}
          },
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("2000","late");
        console.log(response);
        response.success.should.equal(true);
        response.response.error.should.equal("Error here");
        spy.calledOnce.should.equal(true);
      })
    })
})

async function test(query,data=null)
{
  var spy;
  beforeEach(()=>{
      spy = sinon.spy(query);
  })
  it("Should return error (STUBBED)", async function(){
      stubbedErrorSelectTest(spy,data)
  });
  it("Should return all patients (STUBBED)", async function(){;
      stubbedPositiveSelectTest(spy,data)
  });
}

async function stubbedErrorSelectTest(spy,data=null)
{
  var dbController = {
    selectQuery: async function(sql) {
      return {status: "ERR", error:{ }}
    }
  }
  queryController.__set__("databaseController",dbController);
  let response = await spy(data);
  if(data)
  {
    spy.calledWith(data).should.equal(true);
  }
  spy.calledOnce.should.equal(true);
  response.success.should.equal(false);
}

async function stubbedPositiveSelectTest(spy,data=null)
{
  var dbController = {
    selectQuery: async function(sql) {
      return {status:"OK", response:{ rows:[]}}
    }
  }
  queryController.__set__("databaseController",dbController);
  let response = await spy(data);
  if(data)
  {
    spy.calledWith(data).should.equal(true);
  }
  spy.calledOnce.should.equal(true);
  response.success.should.equal(true);
  response.response.length.should.equal(0);
}
