const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const queryController = rewire("../../../lib/query-controller");

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
queryController.__set__("actionLogger",actionLogger);

const testUsername = "admin"; // username that is used throughout the tests (also for action username)
describe("Edit query functionality", function(){
  context("Edit patient extended", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.editPatientExtended);
    })
    it("Edit carer,hospital,patient - all success",async function(){
      queryController.__set__("editCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",hospital_id:"500",carer_id:"600"}]}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(true);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - no patient found",async function(){
      queryController.__set__("editCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:false, err:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - add carer succesfully",async function(){
      queryController.__set__("editHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",hospital_id:"500"}]}
      })
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(true);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - fail adding carer ",async function(){
      queryController.__set__("editHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",hospital_id:"500",carer_id:null}]}
      })
      queryController.__set__("addCarer",async function(){
        return {success:false, err:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - delete carer success",async function(){
      queryController.__set__("deleteCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",hospital_id:"500",carer_id:"600"}]}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail"},"500",testUsername);
      response.success.should.equal(true);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - add hospital succesfully",async function(){
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",carer_id:"500"}]}
      })
      queryController.__set__("editCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(true);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - fail adding hospital ",async function(){
      queryController.__set__("addHospital",async function(){
        return {success:false, err:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",carer_id:"500"}]}
      })
      queryController.__set__("editCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - delete hospital success",async function(){
      queryController.__set__("editCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("deleteHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",hospital_id:"500",carer_id:"600"}]}
      })
      const response = await spy({patient_name:"Mark", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(true);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - fail patient edit",async function(){
      queryController.__set__("editCarer",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editHospital",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("editPatient",async function(){
        return {success:false, err:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400",hospital_id:"500",carer_id:"600"}]}
      })
      const response = await spy({patient_name:"Mark", hospital_email:"gmail", relationship:"daughter"},"500",testUsername);
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Edit carer,hospital,patient - only edit patient success",async function(){
      queryController.__set__("editPatient",async function(){
        return {success:true, response:{affectedRows:1, changedRows:1}}
      })
      queryController.__set__("getPatient",async function(){
        return {success:true, response:[{patient_no:"400"}]}
      })
      const response = await spy({patient_name:"Mark"},"500",testUsername);
      response.success.should.equal(true);
      resetQueryController()
    })
  })
  context("Edit test",function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.editTest);
      resetQueryController();
    })
    it("Accept the test edit - all success", async function(){
      queryController.__set__("getTest",async function(){
        return {success: true, response:[{test_id:"400"}]}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03"},"400",testUsername)
      response.success.should.equal(true)
    })
    it("Reject the test edit - no test found", async function(){
      queryController.__set__("getTest",async function(){
        return {success: true, response:[]}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03"},"400",testUsername)
      response.success.should.equal(false)
    })
    it("Reject the test edit - error in get test", async function(){
      queryController.__set__("getTest",async function(){
        return {success: false, response:{error:"STUBBED ERROR"}}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03"},"400",testUsername)
      response.success.should.equal(false)
    })
    it("Accept the test edit and reject new test", async function(){
      queryController.__set__("getTest",async function(){
        return {success: true, response:[{test_id:"400",completed_status:"no", frequency:"2-W", occurrences:10}]}
      })
      queryController.__set__("scheduleNextTest",async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03",completed_status:"yes"},"400",testUsername)
      response.success.should.equal(true)
    })
    it("Accept the test edit and schedule new - all success", async function(){
      queryController.__set__("getTest",async function(){
        return {success: true, response:[{test_id:"400",completed_status:"no", frequency:"2-W", occurrences:10}]}
      })
      queryController.__set__("scheduleNextTest",async function(){
          return {success:true, response:{affectedRows:1, changedRows:1, insertId:"500", new_date:"2019-03-04"}}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03",completed_status:"yes"},"400",testUsername)
      response.success.should.equal(true)
    })
    it("Accept the test edit and do not schedule new - all success", async function(){
      queryController.__set__("getTest",async function(){
        return {success: true, response:[{test_id:"400",completed_status:"no", frequency:null, occurrences:0}]}
      })
      queryController.__set__("addTest",async function(){
          return {success:true, response:{affectedRows:1, changedRows:1, insertId:"500"}}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03",completed_status:"yes"},"400",testUsername)
      response.success.should.equal(true)
    })
    it("Accept the test edit and do not schedule new 2 - all success", async function(){
      queryController.__set__("getTest",async function(){
        return {success: true, response:[{test_id:"400",completed_status:"no", frequency:"2-W", occurrences:0}]}
      })
      queryController.__set__("addTest",async function(){
          return {success:true, response:{affectedRows:1, changedRows:1, insertId:"500"}}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03",completed_status:"yes"},"400",testUsername)
      response.success.should.equal(true)
    })
  })
  context("Change Test Colour",function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.changeTestColour);
      resetQueryController();
    })
    it("Accept the test colour edit - all success", async function(){
      queryController.__set__("updater",{
        changeTestColour: async function(){
          return {success:true, respnse:{affectedRows:1,changedRows:1}}
        }
      })
      queryController.__set__("requestEditing", async function(){
        return "TOKEN"
      })
      const response = await spy("500", "#FFFFFF", testUsername);
      response.success.should.equal(true);
    })
    it("Reject the test colour edit - all success", async function(){
      queryController.__set__("updater",{
        changeTestColour: async function(){
          return {success:false, response:{problem:1}}
        }
      })
      queryController.__set__("requestEditing", async function(){
        return "TOKEN"
      })
      const response = await spy("500", "#FFFFFF", testUsername);
      response.success.should.equal(false);
      response.response.should.equal(1);
    })
  })
  context("Change Patient Colour",function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.changePatientColour);
      resetQueryController();
    })
    it("Accept the test colour edit - all success", async function(){
      queryController.__set__("updater",{
        changePatientColour: async function(){
          return {success:true, respnse:{affectedRows:1,changedRows:1}}
        }
      })
      queryController.__set__("requestEditing", async function(){
        return "TOKEN"
      })
      const response = await spy("500", "#FFFFFF", testUsername);
      response.success.should.equal(true);
    })
    it("Reject the test colour edit - all success", async function(){
      queryController.__set__("updater",{
        changePatientColour: async function(){
          return {success:false, response:{problem:1}}
        }
      })
      queryController.__set__("requestEditing", async function(){
        return "TOKEN"
      })
      const response = await spy("500", "#FFFFFF", testUsername);
      response.success.should.equal(false);
      response.response.should.equal(1);
    })
  })
  context("Change Test Due Date",function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.changeTestDueDate);
      resetQueryController();
    })
    it("Accept the test colour edit - all success", async function(){
      queryController.__set__("updater",{
        changeTestDueDate: async function(){
          return {success:true, respnse:{affectedRows:1,changedRows:1}}
        }
      })
      queryController.__set__("requestEditing", async function(){
        return "TOKEN"
      })
      const response = await spy("500", "2016-03-04", testUsername);
      response.success.should.equal(true);
    })
    it("Reject the test colour edit - all success", async function(){
      queryController.__set__("updater",{
        changeTestDueDate: async function(){
          return {success:false, response:{problem:1}}
        }
      })
      queryController.__set__("requestEditing", async function(){
        return "TOKEN"
      })
      const response = await spy("500", "2016-03-04", testUsername);
      response.success.should.equal(false);
      response.response.should.equal(1);
    })
  })
  context("Edit user", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.editUser);
      resetQueryController();
    })
    it("Edit all fields (password,email,isAdmin) in user - accept query", async function(){
      queryController.__set__("getUser", async function(){
        return {success: true, response:[{username:"admin", iterations:1923, salt:"hjywehewhewh", hashed_password:"1651256as256f2261727d"}]}
      })
      const updater = {
        editUser: async function(){ return {success:true , response:{affectedRows:1, changedRows:1}}}
      }
      queryController.__set__("updater",updater)
      const response = await spy({username:"admin",hashed_password:"a154145b67227612f",recovery_email:"gmail",isAdmin:"yes"},"300",testUsername)
      response.success.should.equal(true);
    })
    it("Edit all fields (password,email,isAdmin) in user - reject query", async function(){
      queryController.__set__("getUser", async function(){
        return {success: true, response:[{username:"admin", iterations:1923, salt:"hjywehewhewh", hashed_password:"1651256as256f2261727d"}]}
      })
      const updater = {
        editUser: async function(){ return {success:false , err:{error:"STUBBED ERROR"}}}
      }
      queryController.__set__("updater",updater)
      const response = await spy({username:"admin",hashed_password:"a154145b67227612f",recovery_email:"gmail",isAdmin:"yes"},"300",testUsername)
      response.success.should.equal(false);
    })
    it("Edit all fields (password,email,isAdmin) in user - no user found", async function(){
      queryController.__set__("getUser", async function(){
        return {success: true, response:[]}
      })
      const response = await spy({username:"admin",hashed_password:"a154145b67227612f",recovery_email:"gmail",isAdmin:"yes"},"300",testUsername)
      response.success.should.equal(false);
    })
    it("Edit all fields (password,email,isAdmin) in user - select error query", async function(){
      queryController.__set__("getUser", async function(){
        return {success: false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({username:"admin",hashed_password:"a154145b67227612f",recovery_email:"gmail",isAdmin:"yes"},"300",testUsername)
      response.success.should.equal(false);
    })
    it("Edit password only in user - accept query", async function(){
      queryController.__set__("getUser", async function(){
        return {success: true, response:[{username:"admin", iterations:1923, salt:"hjywehewhewh", hashed_password:"1651256as256f2261727d"}]}
      })
      const updater = {
        editUser: async function(){ return {success:true , response:{affectedRows:1, changedRows:1}}}
      }
      queryController.__set__("updater",updater)
      const response = await spy({username:"admin",hashed_password:"a154145b67227612f"},"300",testUsername)
      response.success.should.equal(true);
    })
    it("Edit email only in user - accept query", async function(){
      queryController.__set__("getUser", async function(){
        return {success: true, response:[{username:"admin", iterations:1923, salt:"hjywehewhewh", hashed_password:"1651256as256f2261727d"}]}
      })
      const updater = {
        editUser: async function(){ return {success:true , response:{affectedRows:1, changedRows:1}}}
      }
      queryController.__set__("updater",updater)
      const response = await spy({username:"admin",recovery_email:"gmail"},"300",testUsername)
      response.success.should.equal(true);
    })
  })
  context("Change test status", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.changeTestStatus);
      resetQueryController();
    })
    it("Accept completed change status", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300"}]}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"completed"},testUsername);
      response.success.should.equal(true)
    })
    it("Accept completed change status and schedule new test", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300", completed_status:"no"}]}
      })
      queryController.__set__("scheduleNextTest", async function(){
        return {success:true, response:{insertId:500,new_date:"2019-09-08"}}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"completed"},testUsername);
      response.success.should.equal(true)
    })
    it("Accept completed change status and reject new test", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300", completed_status:"no"}]}
      })
      queryController.__set__("scheduleNextTest", async function(){
        return {success:false, err:{error:"STUBBED ERROR"}}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"completed"},testUsername);
      response.success.should.equal(true)
    })
    it("Accept inReview change status", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300"}]}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"inReview"},testUsername);
      response.success.should.equal(true)
    })
    it("Accept inReview change status and schedule new test", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300", completed_status:"no"}]}
      })
      queryController.__set__("scheduleNextTest", async function(){
        return {success:true, response:{insertId:500,new_date:"2019-09-08"}}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"inReview"},testUsername);
      response.success.should.equal(true)
    })
    it("Accept inReview change status and reject new test", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300", completed_status:"no"}]}
      })
      queryController.__set__("scheduleNextTest", async function(){
        return {success:false, err:{error:"STUBBED ERROR"}}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"inReview"},testUsername);
      response.success.should.equal(true)
    })
    it("Accept late change status", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:"300"}]}
      })
      const updater = {
        changeTestStatus: async function(){
          return {success:true, response:{affectedRows:1,changedRows:1}}
        }
      }
      queryController.__set__("updater",updater);
      const response = await spy({test_id:500, newStatus:"late"},testUsername);
      response.success.should.equal(true)
    })
    it("Reject test change status - select query error", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({test_id:500, newStatus:"inReview"},testUsername);
      response.success.should.equal(false)
    })
    it("Reject test change status - no test found", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[]}
      })
      const response = await spy({test_id:500, newStatus:"inReview"},testUsername);
      response.success.should.equal(false)
    })
    it("Reject test change status - random update found", async function(){
      queryController.__set__("requestEditing", async function(){
        return "3003030"
      })
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:500}]}
      })
      const response = await spy({test_id:500, newStatus:"ERROR"},testUsername);
      response.success.should.equal(false)
    })
  })
})
describe("Add query functionality", function(){
  context("Add Patient extended", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.addPatientExtended);
    })
    it("Add carer,hospital and patient - all success",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"500"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(true);
      response.response.insertedId.should.equal("600");
      resetQueryController()
    })
    it("Add carer,hospital and patient - all fail",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer,hospital and patient - patient query fails and deletes succeed ",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("deleteHospital",async function(){
        return {success:true, response:"Entry deleted"}
      })
      queryController.__set__("deleteCarer",async function(){
        return {success:true, response:"Entry deleted"}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer,hospital and patient - patient query fails and deletes fail",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("deleteHospital",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("deleteCarer",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer,hospital and patient - carer query fails and delete hospital succeed ",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("deleteHospital",async function(){
        return {success:true, response:"Entry deleted"}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer,hospital and patient - carer query fails and delete hospital fails ",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("deleteHospital",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer,hospital and patient - hospital query fails and delete carer fails ",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("deleteCarer",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer,hospital and patient - hospital query fails and delete carer succeed ",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addHospital",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("deleteCarer",async function(){
        return {success:true, response:"Entry deleted"}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer and patient - all success ",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John"});
      response.success.should.equal(true);
      resetQueryController()
    })
    it("Add hospital and patient - all success",async function(){
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(true);
      response.response.insertedId.should.equal("600");
      resetQueryController()
    })
    it("Add hospital and patient - add hospital fails",async function(){
      queryController.__set__("addHospital",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer and patient - add carer fails",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add hospital and patient - add patient fails and delete hospital succeed",async function(){
      queryController.__set__("addHospital",async function(){
        return {success:true, response:{insertId:"400"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("deleteHospital",async function(){
        return {success:true, response:"Entry deleted"}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark",hospital_name:"600", hospital_email:"here"});
      response.success.should.equal(false);
      resetQueryController()
    })
    it("Add carer and patient - add patient fails and delete carer succeed",async function(){
      queryController.__set__("addCarer",async function(){
        return {success:true, response:{insertId:"600"}}
      })
      queryController.__set__("addPatient",async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      queryController.__set__("deleteCarer",async function(){
        return {success:true, response:"Entry deleted"}
      })
      const response = await spy({patient_no:"600",patient_name:"Mark", relationship:"son", carer_name:"John"});
      response.success.should.equal(false);
      resetQueryController()
    })
  })
})
describe("Delete query functionality", function(){
  context("Unschedule Test", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.unscheduleTest);
      resetQueryController()
    })
    it("Unshedule Test correctly",async function(){
      queryController.__set__("returnToken",async function(){
        return {success:true}
      })
      queryController.__set__("deleteTest",async function(){
        return {success:true}
      })
      const response = await spy("500","5dkjdkjd",testUsername);
      response.success.should.equal(true);
    })
    it("Problem with token realease",async function(){
      queryController.__set__("returnToken",async function(){
        return {success:false}
      })
      const response = await spy("500","5dkjdkjd",testUsername);
      response.success.should.equal(false);
    })
  })
  context("Delete Patient", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.deletePatient);
      resetQueryController()
    })
    it("Delete Patient correctly",async function(){
      queryController.__set__("checkIfPatientsTestsAreEdited",async function(){
        return false;
      })
      queryController.__set__("returnToken",async function(){
        return {success:true}
      })
      queryController.__set__("deleter",{deletePatient:async function(){
        return {success:true}
      }})
      const response = await spy("500","5dkjdkjd",testUsername);
      response.success.should.equal(true);
    })
    it("Problem with token return",async function(){
      queryController.__set__("checkIfPatientsTestsAreEdited",async function(){
        return false;
      })
      queryController.__set__("returnToken",async function(){
        return {success:false}
      })
      queryController.__set__("deleter",{deletePatient:async function(){
        return {success:true}
      }})
      const response = await spy("500","5dkjdkjd",testUsername);
      response.success.should.equal(false);
    })
    it("Problem with checkIfPatientsTestsAreEdited",async function(){
      queryController.__set__("checkIfPatientsTestsAreEdited",async function(){
        return {success:false, error:"STUBBED ERROR"};
      })
      queryController.__set__("returnToken",async function(){
        return {success:false}
      })
      queryController.__set__("deleter",{deletePatient:async function(){
        return {success:true}
      }})
      const response = await spy("500","5dkjdkjd",testUsername);
      response.success.should.equal(false);
    })
    it("Patinet's tests being edited",async function(){
      queryController.__set__("checkIfPatientsTestsAreEdited",async function(){
        return true;
      })
      queryController.__set__("returnToken",async function(){
        return {success:false}
      })
      queryController.__set__("deleter",{deletePatient:async function(){
        return {success:true}
      }})
      const response = await spy("500","5dkjdkjd",testUsername);
      response.success.should.equal(false);
    })
  })
})
describe("Other functionality", function(){
  context("Patient sorter", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.sortPatinetProperties);
    })
    it("Sort patinet - full data (patient,carer,hospital)",function(){
      const response = spy({patient_no:"400", patient_name:"Mark", hospital_id:"300", carer_id:"600", relationship:"son", carer_name:"John"});
      Object.keys(response).length.should.equal(3);
      response.patient.patient_no.should.equal("400");
      response.patient.patient_name.should.equal("Mark");
      response.hospital.hospital_id.should.equal("300");
      response.carer.carer_id.should.equal("600");
      response.carer.relationship.should.equal("son");
      response.carer.carer_name.should.equal("John");
    })
    it("Sort patinet - partial data (patient,hospital)",function(){
      const response = spy({patient_no:"400", patient_name:"Mark", hospital_id:"300", hospital_name:"600", hospital_email:"here"});
      Object.keys(response).length.should.equal(3);
      response.patient.patient_no.should.equal("400");
      response.patient.patient_name.should.equal("Mark");
      response.hospital.hospital_id.should.equal("300");
      response.hospital.hospital_name.should.equal("600");
      response.hospital.hospital_email.should.equal("here");
      Object.keys(response.carer).length.should.equal(0);
    })
    it("Sort patinet - partial data (patient,carer)",function(){
      const response = spy({patient_no:"457", patient_name:"Steff", carer_id:"600", relationship:"father", carer_surname:"Smith"});
      Object.keys(response).length.should.equal(3);
      response.patient.patient_no.should.equal("457");
      response.patient.patient_name.should.equal("Steff");
      Object.keys(response.hospital).length.should.equal(0)
      response.carer.carer_id.should.equal("600");
      response.carer.relationship.should.equal("father");
      response.carer.carer_surname.should.equal("Smith");
    })
    it("Sort patient - partial data (carer,hospital)",function(){
      const response = spy({carer_id:"600", relationship:"father", carer_surname:"Smith",hospital_id:"300", hospital_name:"600", hospital_email:"here"});
      Object.keys(response).length.should.equal(3);
      Object.keys(response.patient).length.should.equal(0)
      response.carer.carer_id.should.equal("600");
      response.carer.relationship.should.equal("father");
      response.carer.carer_surname.should.equal("Smith");
      response.hospital.hospital_id.should.equal("300");
      response.hospital.hospital_name.should.equal("600");
      response.hospital.hospital_email.should.equal("here");
    })
  })
  context("schedule Next Test", function() {
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.scheduleNextTest);
    })
    it("Schedule correctly next test base on data", async function(){
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:500, frequency:"2-W", completed_date:"2019-03-23", occurrences:5}]
      }})
      queryController.__set__("addTest", async function(){
        return {success:true, response:{insertId:"501"}}
      })
      const response = await spy("500",testUsername);
      response.success.should.equal(true);
      response.response.insertId.should.equal("501");
      response.response.new_date.should.equal("20190406");
    })
    it("Reject next test base on data", async function(){
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:500, frequency:"2-W", completed_date:"2019-03-23", occurrences:5}]
      }})
      queryController.__set__("addTest", async function(){
        return {success:false, response:{error:"STUBBED ERROR"}}
      })
      const response = await spy("500",testUsername);
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR");
    })
    it("No new test - frequency null", async function(){
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:500, frequency:null, completed_date:"2019-03-23", occurrences:5}]
      }})
      const response = await spy("500",testUsername);
      response.success.should.equal(true);
      response.response.should.equal("No new tests");
    })
    it("No new test - occurences 0", async function(){
      queryController.__set__("getTest", async function(){
        return {success:true, response:[{test_id:500, frequency:"2-W", completed_date:"2019-03-23", occurrences:0}]
      }})
      const response = await spy("500",testUsername);
      response.success.should.equal(true);
      response.response.should.equal("No new tests");
    })
  })
  context("Get next due date", function(){
    let spy;
    beforeEach(()=>{spy = sinon.spy(queryController.getNextDueDate);})
      it("Next test on next Saturday", function(){
        const response = spy("1-W","2019-03-23");
        response.should.equal("20190330")
      })
      it("Next test on next Saturday (Friday passed)", function(){
        const response = spy("1-W","2019-03-22");
        response.should.equal("20190330")
      })
      it("Next test on next Saturday (Sunday passed)", function(){
        const response = spy("1-W","2019-03-24");
        response.should.equal("20190406")
      })
      it("Next test on next Saturday (Monday passed)", function(){
        const response = spy("1-W","2019-03-18");
        response.should.equal("20190330")
      })
  })
  context("Check if Patients' Tests are Being Edited", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.checkIfPatientsTestsAreEdited);
    })
    it("NO tests edited", async function(){
      const selector = {
        getPatientEditedTests:async function(){
            return {success:true, response:[]}
        }
      }
      queryController.__set__("selector",selector);
      const response = await spy("500");
      response.should.equal(false)
    })
    it("Tests being edited", async function(){
      const selector = {
        getPatientEditedTests:async function(){
            return {success:true, response:[{test_id:1}]}
        }
      }
      queryController.__set__("selector",selector);
      const response = await spy("500");
      response.should.equal(true)
    })
    it("Query Fail", async function(){
      const selector = {
        getPatientEditedTests:async function(){
            return {success:false, response:{error:"STUBBED ERROR"}}
        }
      }
      queryController.__set__("selector",selector);
      const response = await spy("500");
      response.success.should.equal(false)
      response.response.error.should.equal("STUBBED ERROR")
    })
  })
  context("Check if Patients' Tests are Being Edited", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.getReport);
    })
    it("Error in getting report - all queries fail(Date specified/Monthly)", async function(){

      const selector={
        selectQueryDatabase: async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getDueTests:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getCompletedOnTime:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getCompletedLate:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getNumberOfRemindersSent:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getPatientsNumber:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
      }
      queryController.__set__("selector",selector)
      const response = await spy(true,"2019-03-04");
      response.success.should.equal(false);
    })
    it("Error in getting report - all queries fail(Date specified/Yearly)", async function(){

      const selector={
        selectQueryDatabase: async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getDueTests:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getCompletedOnTime:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getCompletedLate:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getNumberOfRemindersSent:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
        getPatientsNumber:async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        },
      }
      queryController.__set__("selector",selector)
      const response = await spy(false,"2019-03-04");
      response.success.should.equal(false);
    })
  })
})

function resetQueryController(){
  queryController.__set__("addCarer",queryController.addCarer);
  queryController.__set__("editCarer",queryController.editCarer)
  queryController.__set__("deleteHospital",queryController.deleteCarer);
  queryController.__set__("addHospital",queryController.addHospital);
  queryController.__set__("editHospital",queryController.editHospital)
  queryController.__set__("deleteHospital",queryController.deleteHospital);
  queryController.__set__("editPatient",queryController.editPatient)
  queryController.__set__("addPatient",queryController.addPatient);
  queryController.__set__("getPatient",queryController.getPatient)
  queryController.__set__("getTest",queryController.getTest);
  queryController.__set__("addTest",queryController.addTest);
  queryController.__set__("deleteTest",queryController.deleteTest);
  queryController.__set__("getUser",queryController.getUser);
  queryController.__set__("requestEditing",queryController.requestEditing);
  queryController.__set__("returnToken",queryController.returnToken);
  queryController.__set__("checkIfPatientsTestsAreEdited",queryController.checkIfPatientsTestsAreEdited)
}
