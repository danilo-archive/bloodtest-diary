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
describe("Edit test functionality", function(){
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
          return {success:false, err:{error:"STUBBED ERROR"}}
      })
      const updater = {
        editTest:async function(){
          return {success:true, response:{affectedRows:1, changedRows:1}}
        }
      }
      queryController.__set__("updater",updater)
      const response = await spy("400",{test_id:"400",due_date:"2019-09-03",completed_status:"yes"},"400",testUsername)
      response.success.should.equal(false)
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
describe("Other functionality", function(){
  context("Patient sorter", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(queryController.sortPatinetProperties);
    })
    it("Sort patinet - full data (patient,carer,hospital)",function(){
      const response = spy({patient_no:"400", patient_name:"Mark", hospital_id:"300", carer_id:"600", relationship:"son", carer_name:"John"});
      console.log(response);
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
      console.log(response);
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
      console.log(response);
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
      console.log(response);
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
  queryController.__set__("addTest",queryController.addTest)
}
