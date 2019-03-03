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
    context("Add new User", function(){
      var spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.addUser);
      })
      it("Should accept new User  (STUBBED)", async function() {
        var dbController = {
          insertQuery: async function(sql) {
            return {status:"OK"}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","21828728218","email@email.com");
        spy.calledWith("admin","21828728218","email@email.com").should.equal(true);
        spy.calledOnce.should.equal(true);
        response.success.should.equal(true);
      })
      it("Should reject new User  (STUBBED)", async function() {
        var dbController = {
          insertQuery: async function(sql) {
            return {status:"ERR"}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","21828728218","email@email.com");
        spy.calledOnce.should.equal(true);
        response.success.should.equal(false);
      })
      it("Should reject new User without full data (STUBBED)", async function() {
        var dbController = {
          insertQuery: async function(sql) {
            return {status:"ERR"}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","21828728218");
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
        let response = await spy("2000","late");
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
        response.response.should.equal("NO SUCH UPDATE");
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
        response.success.should.equal(true);
        response.response.error.should.equal("Error here");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Update password", function(){
      var spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.updatePassword);
      })
      it("Correctly update password (STUBBED)", async function()
      {
        var dbController = {
          selectQuery: async function(sql) {
            return {status:"OK", response:{ rows:[{username:"admin",iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","373723172173732");
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Fail due to password beeing edited (STUBBED)", async function() {
        var dbController = {
          selectQuery: async function(sql) {
            return {status:"OK", response:{ rows:[{username:"admin",iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status:"ERR", response:"NO TOKEN"}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","373723172173732");
        response.success.should.equal(false);
        response.response.should.equal("Token in use");
      })
      it("Fail due to no user found (STUBBED)", async function() {
        var dbController = {
          selectQuery: async function(sql) {
            return {status:"OK", response:{ rows:[]}}
          },
          requestEditing: async function() {
            return {status:"ERR", response:"NO TOKEN"}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","373723172173732");
        response.success.should.equal(false);
        response.response.should.equal("No user found");
      })
      it("Fail due to update query error (STUBBED)", async function() {
        var dbController = {
          selectQuery: async function(sql) {
            return {status:"OK", response:{ rows:[{username:"admin",iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", response: "ERROR"}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","373723172173732");
        response.success.should.equal(true);
        response.response.should.equal("ERROR");
      })
      it("Fail due to getUser query error (STUBBED)", async function()
      {
        var dbController = {
          selectQuery: async function(sql) {
            return {status:"ERR", response:"ERROR"}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        let response = await spy("admin","373723172173732");
        response.success.should.equal(false);
      })
    })
})

describe("Other functionality", function(){
  context("Get Overdue Groups", function(){
    var spy = spy = sinon.spy(queryController.getOverdueGroups);
    it("Groups tests correctly by the intervals (STUBBED)", async function(){
      var dbController = {
        selectQuery: async function(sql) {
          return {status:"OK",
                  response:{
                        rows:[{test_id:10, difference:400},
                              {test_id:1, difference:366},
                              {test_id:2, difference:200},
                              {test_id:9, difference:200},
                              {test_id:8, difference:50},
                              {test_id:3, difference:30},
                              {test_id:7, difference:20},
                              {test_id:4, difference:14},
                              {test_id:6, difference:7},
                              {test_id:5, difference:5},
                            ]
                            }
                  }
        }
      }
      queryController.__set__("databaseController",dbController);
      let response = await spy();
      response[0].class.should.equal('Year+');
      response[0].tests.length.should.equal(2);
      response[0].tests[0].test_id.should.equal(10);
      response[0].tests[1].test_id.should.equal(1);

      response[1].class.should.equal('6+ months');
      response[1].tests.length.should.equal(2);
      response[1].tests[0].test_id.should.equal(2);
      response[1].tests[1].test_id.should.equal(9);

      response[2].class.should.equal('1-6 months');
      response[2].tests.length.should.equal(2);
      response[2].tests[0].test_id.should.equal(8);
      response[2].tests[1].test_id.should.equal(3);

      response[3].class.should.equal('2-4 weeks');
      response[3].tests.length.should.equal(2);
      response[3].tests[0].test_id.should.equal(7);
      response[3].tests[1].test_id.should.equal(4);

      response[4].class.should.equal('Less than 2 weeks');
      response[4].tests.length.should.equal(2);
      response[4].tests[0].test_id.should.equal(6);
      response[4].tests[1].test_id.should.equal(5);
    })
    it("Error On the way (STUBBED)", async function()
    {
      var dbController = {
        selectQuery: async function(sql) {
          return {status:"ERR",
                  response:{error:"ERROR"}
                  }
        }
      }
      queryController.__set__("databaseController",dbController);
      let response = await spy();
      response[0].class.should.equal('Year+');
      response[0].tests.length.should.equal(0);

      response[1].class.should.equal('6+ months');
      response[1].tests.length.should.equal(0);

      response[2].class.should.equal('1-6 months');
      response[2].tests.length.should.equal(0);

      response[3].class.should.equal('2-4 weeks');
      response[3].tests.length.should.equal(0);

      response[4].class.should.equal('Less than 2 weeks');
      response[4].tests.length.should.equal(0);
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
  it("Should return all data (STUBBED)", async function(){;
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
