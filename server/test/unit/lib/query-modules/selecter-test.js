const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const selecter = rewire("../../../../lib/query-modules/selecter.js");
const testUsername = "admin";

describe("Select queries tests", function(){
  context("Get All patients (adults)", function(){
    test(selecter.getAllPatients,true);
  })
  context("Get All patients (children)", function(){
    test(selecter.getAllPatients,false);
  })
  context("Get Next Test of patient", function(){
    test(selecter.getNextTestsOfPatient,"400")
  })
  context("Get Patient", function(){
    test(selecter.getPatient, "4000");
  })
  context("Get Carer", function(){
    test(selecter.getCarer, "4000");
  })
  context("Get Hospital", function(){
    test(selecter.getHospital, "300");
  })
  context("Get User", function(){
    test(selecter.getUser,testUsername);
  });
  context("Get All Users", function(){
    test(selecter.getAllUsers,);
  });
  context("Get Full Patient Info", function(){
    test(selecter.getFullPatientInfo,"P400");
  });
  context("Get Full Test Info", function(){
    test(selecter.getTestInfo,"400");
  });
  context("Get Tests Within week", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(selecter.getTestWithinWeek);
    })
    it("Should return all days (adult) (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[]}}
        }
      }
      selecter.__set__("databaseController",dbController);
      const response = await spy("2018-04-03",true);
      spy.calledWith("2018-04-03",true).should.equal(true);
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(6);
    });
    it("Should return error (adult) (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "ERR", err:{ }}
          }
        }
        selecter.__set__("databaseController",dbController);
        const response = await spy("2018-04-03",true);
        spy.calledWith("2018-04-03",true).should.equal(true);
        spy.calledOnce.should.equal(true);
        response.success.should.equal(false);
    });
    it("Should return all days (children) (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[]}}
        }
      }
      selecter.__set__("databaseController",dbController);
      const response = await spy("2018-04-04",false);
      spy.calledWith("2018-04-04",false).should.equal(true);
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(6);
    });
    it("Should return error (children) (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "ERR", err:{ }}
          }
        }
        selecter.__set__("databaseController",dbController);
        const response = await spy("2018-04-04",false);
        spy.calledWith("2018-04-04",false).should.equal(true);
        spy.calledOnce.should.equal(true);
        response.success.should.equal(false);
    });
  });
  context("Get Sorted Overdue Weeks", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(selecter.getSortedOverdueWeeks);
    })
    it("Should return all overdue weeks grouped (children) (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[
            {test_id:"110", Monday:"1", isAdult:"no"},
            {test_id:"203", Monday:"2", isAdult:"no"},
            {test_id:"201", Monday:"2", isAdult:"no"}
          ]}}
        }
      }
      selecter.__set__("databaseController",dbController);
      const response = await spy(false);
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(2);
      response.response[0].tests.length.should.equal(1);
      response.response[1].tests.length.should.equal(2);
      response.response[0].class.should.equal("1");
      response.response[1].class.should.equal("2");
    });
    it("Should return all overdue weeks grouped (adult) (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[
            {test_id:"100", Monday:"1", isAdult:"yes"},
            {test_id:"200", Monday:"2", isAdult:"yes"},
            {test_id:"307", Monday:"3", isAdult:"yes"},
          ]}}
        }
      }
      selecter.__set__("databaseController",dbController);
      const response = await spy(true);
      spy.calledOnce.should.equal(true);
      response.success.should.equal(true);
      response.response.length.should.equal(3);
      response.response[0].tests.length.should.equal(1);
      response.response[1].tests.length.should.equal(1);
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
      selecter.__set__("databaseController",dbController);
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
      selecter.__set__("databaseController",dbController);
      const response = await spy();
      spy.calledOnce.should.equal(true);
      response.success.should.equal(false);
      response.response.error.should.equal("stubbed error");
    });
  });

  describe("Get overdue reminder groups:", () => {
    it ("Should return false.", async () => {
      const dbController = {
        selectQuery: async function() {
          return {status:"ERR"}
        }
      }
      selecter.__set__("databaseController",dbController);
      const res = await selecter.getOverdueReminderGroups();
      expect(res.success).to.be.false;
    });
    it ("Should return correct groups (adults).", async () => {
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[
            {test_id: 404, reminders_sent: 0, isAdult:"yes"},
            {test_id: 200, reminders_sent: 1, isAdult:"yes"}
          ]}};
        }
      }
      selecter.__set__("databaseController",dbController);
      const res = await selecter.getOverdueReminderGroups(true);
      const shouldBe = {
        success:true,
        response: {
          notReminded: [
            {test_id: 404, reminders_sent: 0, isAdult:"yes"}
          ],
          reminded: [
            {test_id: 200, reminders_sent: 1, isAdult:"yes"}
          ]
        }
      };
      expect(res.success).to.be.true;
      expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
    });
    it ("Should return correct groups (children).", async () => {
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[
            {test_id: 40, reminders_sent: 0, isAdult:"no"},
            {test_id: 390, reminders_sent: 3, isAdult:"no"}
          ]}};
        }
      }
      selecter.__set__("databaseController",dbController);
      const res = await selecter.getOverdueReminderGroups(false);
      const shouldBe = {
        success:true,
        response: {
          notReminded: [
            {test_id: 40, reminders_sent: 0, isAdult:"no"}
          ],
          reminded: [
            {test_id: 390, reminders_sent: 3, isAdult:"no"}
          ]
        }
      };
      expect(res.success).to.be.true;
      expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
    });
  });
});
describe("Other functionality tests", function(){
  context("Execute select query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(selecter.selectQueryDatabase);
    })
    it("Correctly execute select query (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status: "OK", response:{rows:[1,2,3]}}
        }
      }
      selecter.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(true);
      response.response[0].should.equal(1);
      response.response[1].should.equal(2);
      response.response[2].should.equal(3);
    })
    it("Reject select query (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status: "ERR", err:{error:"STUBBED ERROR"}}
        }
      }
      selecter.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR")
    })
  })
})

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
  selecter.__set__("databaseController",dbController);
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
  selecter.__set__("databaseController",dbController);
  const response = await spy(data);
  if(data)
  {
    spy.calledWith(data).should.equal(true);
  }
  spy.calledOnce.should.equal(true);
  response.success.should.equal(true);
  response.response.length.should.equal(0);
}
