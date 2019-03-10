const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);

const queryController = rewire("../../../lib/query-controller");

const logger = require('./../../../lib/action-logger');
logger.disableConsoleOutput(); // for a cleaner output

const testActionUsername = "admin"; // action username that is used throughout the tests.

describe("Select queries tests", function(){
  context("Get All patients", function(){
    test(queryController.getAllPatients);
  })
  context("Get Patient", function(){
    test(queryController.getPatient, "4000");
  })
  context("Get Carer", function(){
    test(queryController.getCarer, "4000");
  })
  context("Get Hosiptal", function(){
    test(queryController.getHospital, "300");
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
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.getTestWithinWeek);
    })
    it("Should return all days (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[]}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("2018-04-03");
      spy.calledWith("2018-04-03").should.equal(true);
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(6);
    });
    it("Should return error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "ERR", err:{ }}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("2018-04-03");
        spy.calledWith("2018-04-03").should.equal(true);
        spy.calledOnce.should.equal(true);
        response.success.should.equal(false);
    });
  });
  context("Get Sorted Overdue Weeks", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.getSortedOverdueWeeks);
    })
    it("Should return all overdue weeks grouped (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[
            {test_id:"100", Monday:"1"},
            {test_id:"110", Monday:"1"},
            {test_id:"200", Monday:"2"},
            {test_id:"203", Monday:"2"},
            {test_id:"201", Monday:"2"},
            {test_id:"307", Monday:"3"},
          ]}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy();
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(3);
      response.response[0].tests.length.should.equal(2);
      response.response[1].tests.length.should.equal(3);
      response.response[2].tests.length.should.equal(1);
      response.response[0].class.should.equal("1");
      response.response[1].class.should.equal("2");
      response.response[2].class.should.equal("3");
    });
    it("Should return empty overdue weeks (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[]}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy();
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    });
    it("Should return error (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status: "ERR", err: {error:"stubbed error"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy();
      spy.calledOnce.should.equal(true);
      response.success.should.equal(false);
      response.response.error.should.equal("stubbed error");
    });
  })
});

describe("Insert queries tests", function(){
    context("Insert new test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.addTest);
      })
      it("Should accept new test (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
      it("Should reject new test (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
    })
    context("Add new User", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.addUser);
      })
      it("Should accept new User (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{username:"admin",hashed_password:"21828728218",email:"email@email.com"})
      })
      it("Should reject new User (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{username:"admin",hashed_password:"21828728218",email:"email@email.com"})
      })
    })
    context("Add new Patient", function(){
      let spy;
      beforeEach(()=>{
          //TODO : delete JSON
          spy = sinon.spy(queryController.addPatient);
      })
      it("Should accept new patient (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
      it("Should reject new patient (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
    })
    context("Add new Hospital", function(){
      let spy;
      beforeEach(()=>{
          //TODO : delete JSON
          spy = sinon.spy(queryController.addHospital);
      })
      it("Should accept new hospital (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
      it("Should reject new hospital (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
    })
    context("Add new Carer", function(){
      let spy;
      beforeEach(()=>{
          //TODO : delete JSON
          spy = sinon.spy(queryController.addCarer);
      })
      it("Should accept new carer (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
      it("Should reject new carer (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
    })
})

describe("Update queries tests", function(){
    context("Change test status", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.changeTestStatus);
      })
      it("Fail, as somebody is editing (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "ERR", err:{ type: "Invalid request.", cause: "stubbed error" }}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"late"}, testActionUsername);
        response.success.should.equal(false);
        spy.calledOnce.should.equal(true);
      })
      it("Reject random update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{ token:"30000" }}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"ERROR"}, testActionUsername);
        response.success.should.equal(false);
        response.response.should.equal("NO SUCH UPDATE");
        spy.calledOnce.should.equal(true);
      })
      it("Accept completed update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400"}]}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"completed"}, testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject completed update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400"}]}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"completed"}, testActionUsername);
        response.success.should.equal(false);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept late update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"late"}, testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject late update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
          },
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"late"}, testActionUsername);
        response.success.should.equal(false);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept in review update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400"}]}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"inReview"}, testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject in review update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
          },
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"inReview"}, testActionUsername);
        response.success.should.equal(false);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Update password", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.updatePassword);
      })
      it("Correctly update password (STUBBED)", async function()
      {
        const dbController = {
          selectQuery: async function() {
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
        const response = await spy({username:"admin",hashed_password:"373723172173732"}, testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Fail due to password being edited (STUBBED)", async function() {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:"admin",iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status:"ERR", err: { type: "Invalid request.", cause: "NO TOKEN" }}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:"admin",hashed_password:"373723172173732"}, testActionUsername);
        response.success.should.equal(false);
        response.response.problem.should.equal("Token in use/No token defined");
      })
      it("Fail due to no user found (STUBBED)", async function() {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[]}}
          },
          requestEditing: async function() {
            return {status:"ERR", err: { type: "Invalid request.", cause: "NO TOKEN" }}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:"admin",hashed_password:"373723172173732"}, testActionUsername);
        response.success.should.equal(false);
        response.response.should.equal("No user found");
      })
      it("Fail due to update query error (STUBBED)", async function() {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:"admin",iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err:"Error here"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:"admin",hashed_password:"373723172173732"}, testActionUsername);
        response.success.should.equal(false);
        response.response.should.equal("Error here");
      })
      it("Fail due to getUser query error (STUBBED)", async function()
      {
        const dbController = {
          selectQuery: async function() {
            return {status:"ERR", err: { type: "SQL error", sqlMessage: "stubbed error"}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:"admin",hashed_password:"373723172173732"}, testActionUsername);
        response.success.should.equal(false);
      })
    })
    context("Edit Patient", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.editPatient);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabae();
        const response = await spy({patient_no:"400",patient_name:"Mark"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"},"400", testActionUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"}, undefined, testActionUsername);
        response.response.problem.should.equal("Token in use/No token defined");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Carer", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.editCarer);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabae();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"},"400", testActionUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"}, undefined, testActionUsername);
        response.response.problem.should.equal("Token in use/No token defined");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Hospital", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.editHospital);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabae();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"},"400", testActionUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"}, undefined, testActionUsername);
        response.response.problem.should.equal("Token in use/No token defined");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.editTest);
      })
      it("Accept test edit and add new test (depending on data from database) - in review (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2}]}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Accept test edit and add new test (depending on data passed) - in review (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2}]}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",patient_no:"300",completed_status:"in review", occurrences:"3", frequency:"5-W",notes:"Test", due_date:"2020-01-01"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Accept test edit without adding new test - in review (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", occurrences:0}]}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject test edit - in review (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testActionUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept test edit - late (STUBBED)", async function(){
        setAcceptUpdateQueryDatabae();
        const response = await spy("400",{test_id:"400",completed_status:"no"},"400", testActionUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject test edit - late (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"no"},"400", testActionUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
    })


})

describe("Other functionality", function(){
  context("Get Overdue Groups", function(){
    const spy = sinon.spy(queryController.getOverdueGroups);
    it("Groups tests correctly by the intervals (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
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
<<<<<<< HEAD
      response = response.response;
=======
      response = response.response; // TODO: is this okay?
>>>>>>> 875c3cda68f5e8e04d749cbc5ce51556af0b0b21
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
      const dbController = {
        selectQuery: async function() {
          return {status:"ERR",
                  response:{error:"ERROR"}
                  }
        }
      }
      queryController.__set__("databaseController",dbController);
      let response = await spy();
<<<<<<< HEAD
      response = response.response;
=======
      response = response.response; // TODO: is this okay?
>>>>>>> 875c3cda68f5e8e04d749cbc5ce51556af0b0b21
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


//=====================================
//  HELPER FUNCTIONS BELOW:
//=====================================


async function stubbedErrorInsertTest(spy,data){
  setFaultyInsert();
  const response = await spy(data, testActionUsername);
  spy.calledOnce.should.equal(true);
  response.success.should.equal(false);
}

async function stubbedPositiveInsertTest(spy,data){
  setPositiveInsert();
  const response = await spy(data, testActionUsername);
  spy.calledWith(data).should.equal(true);
  spy.calledOnce.should.equal(true);
  response.success.should.equal(true);
}

async function test(query,data=null){
  let spy;
  beforeEach(()=>{
      spy = sinon.spy(query);
  })
  it("Should return error (STUBBED)", async function(){
      stubbedErrorSelectTest(spy,data)
  });
  it("Should return all data (STUBBED)", async function(){
      stubbedPositiveSelectTest(spy,data)
  });
}

async function stubbedErrorSelectTest(spy,data=null){
  const dbController = {
    selectQuery: async function() {
      return {status: "ERR", error:{ }}
    }
  }
  queryController.__set__("databaseController",dbController);
  const response = await spy(data);
  if(data)
  {
    spy.calledWith(data).should.equal(true);
  }
  spy.calledOnce.should.equal(true);
  response.success.should.equal(false);
}

async function stubbedPositiveSelectTest(spy,data=null){
  const dbController = {
    selectQuery: async function() {
      return {status:"OK", response:{ rows:[]}}
    }
  }
  queryController.__set__("databaseController",dbController);
  const response = await spy(data);
  if(data)
  {
    spy.calledWith(data).should.equal(true);
  }
  spy.calledOnce.should.equal(true);
  response.success.should.equal(true);
  response.response.length.should.equal(0);
}

function setFaultyInsert(){
  const dbController = {
    insertQuery: async function() {
      return {status:"ERR", err: { type: "SQL error", sqlMessage: "stubbed SQL Message"}}
    }
  }
  queryController.__set__("databaseController",dbController);
}

function setPositiveInsert(){
  const dbController = {
    insertQuery: async function() {
      return {status:"OK", response: { insertId: "test_insert_id"}}
    }
  }
  queryController.__set__("databaseController",dbController);
}

function setRejectUpdateQueryDatabase(){
  const dbController = {
    updateQuery: async function() {
      return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
    }
  }
  queryController.__set__("databaseController",dbController);
}

function setAcceptUpdateQueryDatabae(){
  const dbController = {
  updateQuery: async function() {
    return {status: "OK", response:{affectedRows:1}}
  }
  }
  queryController.__set__("databaseController",dbController);
}
