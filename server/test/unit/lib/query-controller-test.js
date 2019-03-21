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
/** describe("Insert queries tests", function(){
*    context("Add new patient extended", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.addPatientExtended);
      })

      it("Add patient correctly with new carer and new hospital - correct info (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"30230320",patient_name:"Bill",patient_surname:"Murray",hospital_email:"gmail",carer_email:"outlook"});
        response.success.should.equal(true);
        response.response.insertedId.should.equal("30230320");
      });
      it("Add patient correctly with new carer - missing hospital info (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"302303205",patient_name:"Bill",patient_surname:"Murray",carer_email:"outlook"});
        response.success.should.equal(true);
        response.response.insertedId.should.equal("302303205");
      });
      it("Add patient correctly with new hospital - missing carer info (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",hospital_email:"gmail"});
        response.success.should.equal(true);
        response.response.insertedId.should.equal("302303437720");
      });
      it("Add patient correctly without new carer nor new hospital - correct info (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"30230320",patient_name:"Bill",patient_surname:"Murray"});
        response.success.should.equal(true);
        response.response.insertedId.should.equal("30230320");
      });
      it("Reject patient without new carer nor new hospital - correct info (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"ERR", err: { error: "STUBBED ERROR"}}
          },
          deleteQuery: async function() {
            return {status:"OK", response: "Entry deleted properly"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"30230320",patient_name:"Bill",patient_surname:"Murray"});
        response.success.should.equal(false);
        response.response.carer.should.equal(true);
        response.response.hospital.should.equal(true);
      });
      it("Reject patient with new hospital incorrect data - missing carer info/accept delete (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"ERR", err: { error: "STUBBED ERROR"}}
          },
          deleteQuery: async function() {
            return {status:"OK", response: "Entry deleted properly"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",hospital_name:"Saint Cross"});
        response.success.should.equal(false);
        response.response.problem.should.equal("Incorrect data for hospital");
        response.response.delete.should.equal(true);
      });
      it("Reject patient with new hospital and new carer - reject patient insert (STUBBED)", async function(){
        queryController.__set__("addPatient",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addHospital",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("addCarer",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("deleteCarer",async function(){
          return {success:true, response:"Entry deleted"}
        })
        queryController.__set__("deleteHospital",async function(){
          return {success:true, response:"Entry deleted"}
        })
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Marry",hospital_name:"Sacred Hospital"});
        resetThePatientQueries()
        response.success.should.equal(false);
        response.response.problem.should.equal("Problem on patient insert");
        response.response.carer.should.equal(true);
        response.response.hospital.should.equal(true);
      });
      it("Reject patient with new hospital and new carer - reject hospital insert (STUBBED)", async function(){
        queryController.__set__("addPatient",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addHospital",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addCarer",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("deleteCarer",async function(){
          return {success:true, response:"Entry deleted"}
        })
        queryController.__set__("deleteHospital",async function(){
          return {success:true, response:"Entry deleted"}
        })
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Marry",hospital_name:"Sacred Hospital"});
        resetThePatientQueries()
        response.success.should.equal(false);
        response.response.delete.should.equal(true);
      });
      it("Reject patient with new hospital and new carer - reject carer insert (STUBBED)", async function(){
        queryController.__set__("addPatient",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addHospital",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("addCarer",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("deleteCarer",async function(){
          return {success:true, response:"Entry deleted"}
        })
        queryController.__set__("deleteHospital",async function(){
          return {success:true, response:"Entry deleted"}
        })
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Marry",hospital_name:"Sacred Hospital"});
        resetThePatientQueries()
        response.success.should.equal(false);
        response.response.delete.should.equal(true);
      });
      it("Reject patient with new hospital and new carer - reject hospital insert and carer delete (STUBBED)", async function(){
        queryController.__set__("addPatient",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addHospital",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addCarer",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("deleteCarer",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("deleteHospital",async function(){
          return {success:true, response:"Entry deleted"}
        })
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Marry",hospital_name:"Sacred Hospital"});
        resetThePatientQueries()
        response.success.should.equal(false);
        response.response.delete.should.equal(false);
      });
      it("Reject patient with new hospital and new carer - reject carer insert and hospital delete (STUBBED)", async function(){
        queryController.__set__("addPatient",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addHospital",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("addCarer",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("deleteCarer",async function(){
          return {success:true, response:"Entry deleted"}
        })
        queryController.__set__("deleteHospital",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Marry",hospital_name:"Sacred Hospital"});
        resetThePatientQueries()
        response.success.should.equal(false);
        response.response.delete.should.equal(false);
      });
      it("Reject patient with new hospital and new carer - reject patient insert and all deletes (STUBBED)", async function(){
        queryController.__set__("addPatient",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("addHospital",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("addCarer",async function(){
          return {success:true, response:{insertId:"3993"}}
        })
        queryController.__set__("deleteCarer",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("deleteHospital",async function(){
          return {success:false, err:{error:"STUBBED ERROR"}}
        })
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Marry",hospital_name:"Sacred Hospital"});
        resetThePatientQueries()
        response.success.should.equal(false);
        response.response.hospital.should.equal(false);
        response.response.carer.should.equal(false);
      });
      it("Reject patient with new carer incorrect data - missing hospital info/accept delete (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"ERR", err: { error: "STUBBED ERROR"}}
          },
          deleteQuery: async function() {
            return {status:"OK", response: "Entry deleted properly"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"302303437720",patient_name:"Bill",patient_surname:"Murray",carer_name:"Meggy"});
        response.success.should.equal(false);
        response.response.problem.should.equal("Incorrect data for carer");
        response.response.delete.should.equal(true);
      });
      it("Reject patient with new carer and new hospital - correct info (STUBBED)", async function(){
        const dbController = {
          insertQuery: async function() {
            return {status:"ERR", err: { error: "STUBBED ERROR"}}
          },
          deleteQuery: async function() {
            return {status:"OK", err: { error: "STUBBED ERROR"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"30230320",patient_name:"Bill",patient_surname:"Murray",hospital_email:"gmail",carer_email:"outlook"});
        response.success.should.equal(false);
        response.response.problem.should.equal("Incorrect data for carer and hospital")
      });
    })
* })
**/

/**describe("Update queries tests", function(){
*    context("Edit Patient Extended", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.editPatientExtended);
      })
      it("Accept the full patient edit - (patient,hospital,carer) (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          },
          requestEditing: async function()
          {
            return {status:"OK", response: {token:"3783278321872"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(true);
        response.response.patientQuery.success.should.equal(true);
        response.response.patientQuery.response.affectedRows.should.equal(1);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.hospitalQuery.response.affectedRows.should.equal(1);
        response.response.carerQuery.success.should.equal(true);
        response.response.carerQuery.response.affectedRows.should.equal(1);
      })
      it("Accept the partial patient edit (patient,hospital) and delete carer (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          },
          requestEditing: async function()
          {
            return {status:"OK", response: {token:"3783278321872"}}
          },
          deleteQuery: async function()
          {
            return {status:"OK", response: {query:"OK", affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(true);
        response.response.patientQuery.success.should.equal(true);
        response.response.patientQuery.response.affectedRows.should.equal(1);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.hospitalQuery.response.affectedRows.should.equal(1);
        response.response.carerQuery.success.should.equal(true);
        response.response.carerQuery.response.should.equal("Entry deleted");
      })
      it("Accept the partial patient edit (patient,carer) and delete hospital (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          },
          requestEditing: async function()
          {
            return {status:"OK", response: {token:"3783278321872"}}
          },
          deleteQuery: async function()
          {
            return {status:"OK", response: {query:"OK", affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Mary"},"545734883");
        response.success.should.equal(true);
        response.response.patientQuery.success.should.equal(true);
        response.response.patientQuery.response.affectedRows.should.equal(1);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.hospitalQuery.response.should.equal("Entry deleted");
        response.response.carerQuery.success.should.equal(true);
        response.response.carerQuery.response.affectedRows.should.equal(1);
      })
      it("Accept the partial patient edit (patient,hospital) and insert carer (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", hospital_id:"300"}]}}
          },
          requestEditing: async function()
          {
            return {status:"OK", response: {token:"3783278321872"}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: {query:"OK", insertId:"405"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_name:"Mary", hospital_id:"300", hospital_name:"Hly Cross"},"545734883");
        response.success.should.equal(true);
        response.response.patientQuery.success.should.equal(true);
        response.response.patientQuery.response.affectedRows.should.equal(1);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.hospitalQuery.response.affectedRows.should.equal(1);
        response.response.carerQuery.success.should.equal(true);
        response.response.carerQuery.response.insertId.should.equal("405");
      })
      it("Accept the partial patient edit (patient,carer) and insert hospital (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"300"}]}}
          },
          requestEditing: async function()
          {
            return {status:"OK", response: {token:"3783278321872"}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: {query:"OK", insertId:"350"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"300", carer_name:"Mary", hospital_name:"Holy Cross"},"545734883");
        response.success.should.equal(true);
        response.response.patientQuery.success.should.equal(true);
        response.response.patientQuery.response.affectedRows.should.equal(1);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.hospitalQuery.response.insertId.should.equal("350");
        response.response.carerQuery.success.should.equal(true);
        response.response.carerQuery.response.affectedRows.should.equal(1);
      })
      it("Reject all updates (patient,carer,hospital) (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "ERR", err:{error:"Stubbed Error"}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          },
          requestEditing: async function()
          {
            return {status:"OK", response: {token:"3783278321872"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(false);
        response.response.patientQuery.success.should.equal(false);
        response.response.hospitalQuery.success.should.equal(false);
        response.response.carerQuery.success.should.equal(false);
      })
      it("Reject carer update (patient,carer,hospital) (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "ERR", err:{error:"Stubbed Error"}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          }
        }
        queryController.__set__("requestEditing",async function(){
          return "3783278321872";
        })
        queryController.__set__("editCarer",async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("editHospital", async function(){
          return {success:true, response:{affectedRows:"1"}}
        })
        queryController.__set__("editPatient", async function(){
          return {success:true, response:{affectedRows:"1"}}
        })
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(false);
        response.response.patientQuery.success.should.equal(true);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.carerQuery.success.should.equal(false);
        resetThePatientQueries();
      })
      it("Reject hospital update (patient,carer,hospital) (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "ERR", err:{error:"Stubbed Error"}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          }
        }
        queryController.__set__("requestEditing",async function(){
          return "3783278321872";
        })
        queryController.__set__("editCarer",async function(){
          return {success:true, response:{affectedRows:"1"}}
        })
        queryController.__set__("editHospital", async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("editPatient", async function(){
          return {success:true, response:{affectedRows:"1"}}
        })
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(false);
        response.response.patientQuery.success.should.equal(true);
        response.response.hospitalQuery.success.should.equal(false);
        response.response.carerQuery.success.should.equal(true);
        resetThePatientQueries();
      })
      it("Reject hospital patient (patient,carer,hospital) (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "ERR", err:{error:"Stubbed Error"}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          }
        }
        queryController.__set__("requestEditing",async function(){
          return "3783278321872";
        })
        queryController.__set__("editCarer",async function(){
          return {success:true, response:{affectedRows:"1"}}
        })
        queryController.__set__("editHospital", async function(){
          return {success:true, response:{affectedRows:"1"}}
        })
        queryController.__set__("editPatient", async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        })
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(false);
        response.response.patientQuery.success.should.equal(false);
        response.response.hospitalQuery.success.should.equal(true);
        response.response.carerQuery.success.should.equal(true);
        resetThePatientQueries();
      })
      it("Reject all updates - no patient found (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function()
          {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"},"545734883");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("No token passed (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", patient_name:"Mark", carer_id:"401", hospital_id:"300"}]}}
          },
          updateQuery: async function() {
            return {status: "ERR", err:{error:"Stubbed Error"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({patient_no:"400", patient_name:"John", carer_id:"401", carer_name:"Bob", hospital_id:"300", hospital_name:"Heart Cross"});
        response.success.should.equal(false);
        response.response.patientQuery.success.should.equal(false);
        Object.keys(response.response.carerQuery).length.should.equal(0);
        Object.keys(response.response.hospitalQuery).length.should.equal(0);
      })
    })
* })
**/

/** describe("Delete queries tests", function(){
*    context("Unschedule test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.unscheduleTest);
      })
      it("Fail unscheduling due to a deletion error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          },
          cancelEditing: async function(){
            return {status:"OK", response:"Token canceled"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("500");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Fail unscheduling due to a token return error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          },
          cancelEditing: async function(){
            return {status:"ERR", err: {error:"STUBBED ERROR2"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("500");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR2");
      })
      it("Accept unscheduling request (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{data: "test data"}]}}
          },
          deleteQuery: async function() {
            return {status: "OK", err: {query:"OK", affectedRows:1}}
          },
          cancelEditing: async function(){
              return {status:"OK", response:"Token canceled"}
            }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("600");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
*   })
**/

describe("Other functionality", function(){
  context("Request token cancelation", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.returnToken);
    })
    it("Accept token cancelation request (STUBBED)", async function(){
      const dbController = {
        cancelEditing: async function() {
          return {status: "OK", response: "Editing successfully cancelled."}
        }
      }
      queryController.__set__("databaseController",dbController);
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
      queryController.__set__("databaseController",dbController);
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
      queryController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR")
    })
  })
  context("Request token", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.requestEditing);
    })
    it("Accept token request (STUBBED)", async function(){
      const dbController = {
        requestEditing: async function() {
          return {status: "OK", response:{token: "3000"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      response.should.equal("3000");
    })
    it("Reject token request (STUBBED)", async function(){
      const dbController = {
        requestEditing: async function() {
          return {status: "ERR", err:{error:"STUBBED ERROR"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("Test","400","5220233920");
      expect(typeof response).to.equal('undefined');
    })
  })
})
