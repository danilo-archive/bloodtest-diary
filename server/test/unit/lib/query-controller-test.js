const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const queryController = rewire("../../../lib/query-controller");

//Tests for query controller do NOT depend on action-logger
//We can safely assume the function do not disturb execution of the program
const logger = {
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
queryController.__set__("logger",logger);

const testUsername = "admin"; // username that is used throughout the tests (also for action username)

describe("Select queries tests", function(){
  context("Get All patients", function(){
    test(queryController.getAllPatients);
  })
  context("Get Next Test of patient", function(){
    test(queryController.getNextTestsOfPatient,"400")
  })
  context("Get Patient", function(){
    test(queryController.getPatient, "4000");
  })
  context("Get Carer", function(){
    test(queryController.getCarer, "4000");
  })
  context("Get Hospital", function(){
    test(queryController.getHospital, "300");
  })
  context("Get All Tests", function(){
    test(queryController.getAllTests)
  })
  context("Get All Tests of Patient", function(){
    test(queryController.getTestsOfPatient,"50005");
  })
  context("Get User", function(){
    test(queryController.getUser,testUsername);
  });
  context("Get All tests on date", function(){
    test(queryController.getAllTestsOnDate,"2018-04-03");
  });
  context("Get Full Patient Info", function(){
    test(queryController.getFullPatientInfo,"P400");
  });
  context("Get Full Test Info", function(){
    test(queryController.getTestInfo,"400");
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
  });

  describe("Get overdue reminder groups:", () => {
    it ("Should return false.", async () => {
      const dbController = {
        selectQuery: async function() {
          return {status:"ERR"}
        }
      }
      queryController.__set__("databaseController",dbController);
      const res = await queryController.getOverdueReminderGroups();
      expect(res.success).to.be.false;
    });
    it ("Should return return correct groups.", async () => {
      const dbController = {
        selectQuery: async function() {
          return {status:"OK", response:{ rows:[
            {test_id: 404, reminders_sent: 0},
            {test_id: 200, reminders_sent: 1}
          ]}};
        }
      }
      queryController.__set__("databaseController",dbController);
      const res = await queryController.getOverdueReminderGroups();
      const shouldBe = {
        success:true,
        response: {
          notReminded: [
            {test_id: 404, reminders_sent: 0}
          ],
          reminded: [
            {test_id: 200, reminders_sent: 1}
          ]
        }
      };
      expect(res.success).to.be.true;
      expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
    });
  });
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
        stubbedPositiveInsertTest(spy,{username:testUsername,hashed_password:"21828728218",email:"email@email.com"})
      })
      it("Should reject new User (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{username:testUsername,hashed_password:"21828728218",email:"email@email.com"})
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
    context("Add new patient extended", function(){
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
        const response = await spy({testId:"2000",newStatus:"late"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"ERROR"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"completed"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Accept completed update and accept new test(STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_date:"2020-10-30", completed_status:"yes", occurrences:"3", frequency:"2-W"}]}}
          },
          insertQuery: async function()
          {
            return {status: "OK", response: {insertId:"505"}}
          },
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"completed"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        response.response.new_date.should.equal("20201114");
        response.response.insertId.should.equal("505");
        spy.calledOnce.should.equal(true);
      })
      it("Accept completed update and reject new test(STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_date:"2020-10-30", completed_status:"yes", occurrences:"3", frequency:"2-W"}]}}
          },
          insertQuery: async function()
          {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          },
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"completed"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"completed"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"late"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"late"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"inReview"}, testUsername);
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
        const response = await spy({testId:"2000",newStatus:"inReview"}, testUsername);
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
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Fail due to password being edited (STUBBED)", async function() {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status:"ERR", err: { type: "Invalid request.", cause: "NO TOKEN" }}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
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
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
        response.success.should.equal(false);
        response.response.should.equal("No user found");
      })
      it("Fail due to update query error (STUBBED)", async function() {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err:"Error here"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
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
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
        response.success.should.equal(false);
      })
    })
    context("Edit Patient", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.editPatient);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"}, undefined, testUsername);
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
        setAcceptUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"}, undefined, testUsername);
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
        setAcceptUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"}, undefined, testUsername);
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
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2, completed_date:new Date("2020-01-01")}]}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testUsername);
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
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2, completed_date:new Date("2020-01-01")}]}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",patient_no:"300",completed_status:"in review", occurrences:"3", frequency:"5-W",notes:"Test", due_date:new Date("2020-01-01")},"400", testUsername);
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
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject test edit - in review (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept test edit - late (STUBBED)", async function(){
        setAcceptUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"no"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject test edit - late (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"no"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Patient Extended", function(){
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
    context("Change due date", function(){
      let spy;
      let date;
      beforeEach(()=>{
          spy = sinon.spy(queryController.changeTestDueDate);
          date = new Date();
      })
      it("Reject the change", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "ERR", err:{ type: "Invalid request.", cause: "stubbed error" }}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("300",date);
        response.success.should.equal(false);
        response.response.should.equal("Token in use/No token defined")
      })
      it("Accept the change", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{ token: "TOKEN"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("300",date);
        response.success.should.equal(true)
        response.response.affectedRows.should.equal(1)
      })
    })

    describe("Send overdue reminders:", () => {
      beforeEach(() => {
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{}]}};
          },
          requestEditing: async function() {
            return {status: "OK", response:{ token: "TOKEN"}};
          },
          updateQuery: async function() {
            return {status: "OK"};
          },
          cancelEditing: async function() {
            return {status: "OK"};
          }
        }
        queryController.__set__("databaseController",dbController);
      });

      it("Should return false.", async () => {
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{}]}};
          },
          requestEditing: async function() {
            return {status: "ERR", err: {cause: "stubbed error"}};
          },
          cancelEditing: async function() {
            return {status: "OK"};
          }
        };
        queryController.__set__("databaseController", dbController);
        const res = await queryController.sendOverdueReminders([1], testUsername);
        const shouldBe = {
          success: false,
          response : {
            failedBoth: [1],
            failedPatient: [],
            failedHospital: []
          }
        };
        expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
      });

      it("Should return both failed.", async () => {
        const email_sender = {
          sendOneOverdueTestReminderToPatient: async function() {
            return [1];
          },
          sendOneOverdueTestReminderToHospital: async function() {
            return [1];
          }
        };
        queryController.__set__("email_sender", email_sender);
        const res = await queryController.sendOverdueReminders([1], testUsername);
        const shouldBe = {
          success: false,
          response : {
            failedBoth: [1],
            failedPatient: [],
            failedHospital: []
          }
        };
        expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
      });

      it("Should return patient failed.", async () => {
        const email_sender = {
          sendOneOverdueTestReminderToPatient: async function() {
            return [1];
          },
          sendOneOverdueTestReminderToHospital: async function() {
            return [];
          }
        };
        queryController.__set__("email_sender", email_sender);
        const res = await queryController.sendOverdueReminders([1], testUsername);
        const shouldBe = {
          success: false,
          response : {
            failedBoth: [],
            failedPatient: [1],
            failedHospital: []
          }
        };
        expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
      });

      it("Should return hospital failed.", async () => {
        const email_sender = {
          sendOneOverdueTestReminderToPatient: async function() {
            return [];
          },
          sendOneOverdueTestReminderToHospital: async function() {
            return [1];
          }
        };
        const dbController = {
          selectQuery: async function() {
            return {status: "OK", response: { rows: [{}]}};
          },
          requestEditing: async function() {
            return {status: "OK", response:{ token: "TOKEN"}};
          },
          updateQuery: async function() {
            return {status: "ERR", err: {cause: "stubbed error"}};
          },
          cancelEditing: async function() {
            return {status: "OK"};
          }
        }
        queryController.__set__("databaseController",dbController);
        queryController.__set__("email_sender", email_sender);
        const res = await queryController.sendOverdueReminders([1], testUsername);
        const shouldBe = {
          success: false,
          response : {
            failedBoth: [],
            failedPatient: [],
            failedHospital: [1]
          }
        };
        expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
      });

      it("Should return success.", async () => {
        const email_sender = {
          sendOneOverdueTestReminderToPatient: async function() {
            return [];
          },
          sendOneOverdueTestReminderToHospital: async function() {
            return [];
          }
        };
        queryController.__set__("email_sender", email_sender);
        const res = await queryController.sendOverdueReminders([1], testUsername);
        expect(res.success).to.be.true;
      });
    });
})

describe("Delete queries tests", function(){
    context("Delete hospital", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.deleteHospital);
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
        queryController.__set__("databaseController",dbController);
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
        queryController.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
    context("Delete carer", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.deleteCarer);
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
        queryController.__set__("databaseController",dbController);
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
        queryController.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
    context("Delete test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.deleteTest);
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
        queryController.__set__("databaseController",dbController);
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
        queryController.__set__("databaseController",dbController);
        const response = await spy("600");
        response.success.should.equal(true);
        response.response.should.equal("Entry deleted");
      })
    })
    context("Unschedule test", function(){
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
    context("Delete patient", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(queryController.deletePatient);
      })
      it("Fail deletion due to an select error (STUBBED)", async function(){
        const dbController = {
          selectQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}
          }
        }}
        queryController.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Fail deletion due to an token in database (STUBBED)", async function(){
        const dbController = {
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          },
          selectQuery: async function() {
            return {status: "OK", response:{rows:[{test_id:"200"},{test_id:"400"}]}}
          },
          cancelEditing: async function(){
            return {status: "OK", response:"Token cancel"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.should.equal("Someone is editing the test");
      })
      it("Fail deletion due to deletion error (STUBBED)", async function(){
        const dbController = {
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          },
          selectQuery: async function() {
            return {status: "OK", response:{rows:[]}}
          },
          cancelEditing: async function(){
            return {status: "OK", response:"Token cancel"}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Fail deletion due to token error (STUBBED)", async function(){
        const dbController = {
          deleteQuery: async function() {
            return {status: "ERR", err: {error:"STUBBED ERROR"}}
          },
          selectQuery: async function() {
            return {status: "OK", response:{rows:[]}}
          },
          cancelEditing: async function(){
            return {status: "ERR", err:{error:"STUBBED ERROR"}}
          }
        }
        queryController.__set__("databaseController",dbController);
        const response = await spy("400");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
    })
})

describe("Other functionality", function(){
  context("Execute select query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.selectQueryDatabase);
    })
    it("Correctly execute select query (STUBBED)", async function(){
      const dbController = {
        selectQuery: async function() {
          return {status: "OK", response:{rows:[1,2,3]}}
        }
      }
      queryController.__set__("databaseController",dbController);
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
      queryController.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR")
    })
  })
  context("Execute insert query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.insertQueryDatabase);
    })
    it("Correctly execute insert query (STUBBED)", async function(){
      const dbController = {
        insertQuery: async function() {
          return {status: "OK", response:{insertId:"123", }}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(true);
      response.response.insertId.should.equal("123");
    })
    it("Reject insert query - random error (STUBBED)", async function(){
      const dbController = {
        insertQuery: async function() {
          return {status: "ERR", err:{type:"STUBBED", error:"STUBBED ERROR"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(false);
    })
    it("Reject insert query - SQL error (STUBBED)", async function(){
      const dbController = {
        insertQuery: async function() {
          return {status: "ERR", err:{type:"SQL Error", error:"STUBBED ERROR"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(false);
    })
  })
  context("Execute update query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.updateQueryDatabase);
    })
    it("Correctly execute update query (STUBBED)", async function(){
      const dbController = {
        updateQuery: async function() {
          return {status: "OK",response:{query: "OK", affectedRows: 1,changedRows: 1}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("Table","id","SQL","2222","user");
      response.success.should.equal(true);
      response.response.query.should.equal("OK");
    })
    it("Reject update query - random error (STUBBED)", async function(){
      const dbController = {
        updateQuery: async function() {
          return {status: "ERR", err:{type:"STUBBED", error:"STUBBED ERROR"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("Table","id","SQL","2222","user");
      response.success.should.equal(false);
    })
    it("Reject update query - SQL error (STUBBED)", async function(){
      const dbController = {
        updateQuery: async function() {
          return {status: "ERR", err:{type:"SQL Error", error:"STUBBED ERROR"}}
        }
      }
      queryController.__set__("databaseController",dbController);
      const response = await spy("Table","id","SQL","2222","user");
      response.success.should.equal(false);
    })
  })
  context("Execute delete query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.deleteQueryDatabase);
    })
    it("Correctly execute delete query (STUBBED)", async function(){
      const dbController = {
        deleteQuery: async function() {
          return {status: "OK", response: {query: "OK",  affectedRows: 1}}
        }
      }
      queryController.__set__("databaseController",dbController);
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
      queryController.__set__("databaseController",dbController);
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
      queryController.__set__("databaseController",dbController);
      const response = await spy("table","id","sql", "actionUsername");
      response.success.should.equal(false);
    })
  })
  context("Prepare insert query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.prepareInsertSQL);
    })
    it("Prepare Insert query 1", function() {
      const sql = spy("Test", {test_id:"400", due_date:"2019-03-04"})
      sql.should.equal("INSERT INTO Test(test_id,due_date) Values('400','2019-03-04');");
    })
    it("Prepare Insert query 2", function() {
      const sql = spy("Test", {test_id:"400", due_date:"NULL"})
      sql.should.equal("INSERT INTO Test(test_id,due_date) Values('400',NULL);");
    })
    it("Prepare Insert query 3", function() {
      const sql = spy("Test", {test_id:"400", due_date:"2019-03-04", completed_date:"2019-04-04", patient_no:"400"})
      sql.should.equal("INSERT INTO Test(test_id,due_date,completed_date,patient_no) Values('400','2019-03-04','2019-04-04','400');");
    })
    it("Prepare Insert query 4", function() {
      const sql = spy("Test", {test_id:"400", due_date:"NULL", completed_date:"2019-04-04", patient_no:"NULL"})
      sql.should.equal("INSERT INTO Test(test_id,due_date,completed_date,patient_no) Values('400',NULL,'2019-04-04',NULL);");
    })
    it("Prepare Insert query 5", function() {
      const sql = spy("Test", {test_id:"NULL", due_date:"NULL", completed_date:"NULL", patient_no:"NULL"})
      sql.should.equal("INSERT INTO Test(test_id,due_date,completed_date,patient_no) Values(NULL,NULL,NULL,NULL);");
    })
  })
  context("Prepare delete query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.prepareDeleteSQL);
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
  context("Prepare update query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(queryController.prepareUpdateSQL);
    })
    it("Prepare Update query 1", function() {
      const sql = spy("Test", {test_id:"400", due_date:"NULL", completed_date:"2019-04-04", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = '2019-04-04', patient_no = NULL WHERE test_id = '400';")
    })
    it("Prepare Update query 2", function() {
      const sql = spy("Test", {test_id:"300", due_date:"NULL", completed_date:"NULL", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = NULL, patient_no = NULL WHERE test_id = '300';")
    })
    it("Prepare Update query 3", function() {
      const sql = spy("Test", {test_id:"300", due_date:"2020-12-12", completed_date:"NULL", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = '2020-12-12', completed_date = NULL, patient_no = NULL WHERE test_id = '300';")
    })
    it("Prepare Update query 4", function() {
      const sql = spy("Test", {test_id:"NULL", due_date:"NULL", completed_date:"NULL", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = NULL, patient_no = NULL WHERE test_id = NULL;")
    })
    it("Prepare Update query 5", function() {
      const sql = spy("Test", {test_id:"NULL", due_date:"NULL", completed_date:"NULL", patient_no:"500"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = NULL, patient_no = '500' WHERE test_id = NULL;")
    })
  })
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


//=====================================
//  HELPER FUNCTIONS BELOW:
//=====================================


async function stubbedErrorInsertTest(spy,data){
  setFaultyInsert();
  const response = await spy(data, testUsername);
  spy.calledOnce.should.equal(true);
  response.success.should.equal(false);
}

async function stubbedPositiveInsertTest(spy,data){
  setPositiveInsert();
  const response = await spy(data, testUsername);
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

function resetThePatientQueries(){
  queryController.__set__("addPatient", queryController.addPatient)
  queryController.__set__("addCarer", queryController.addCarer)
  queryController.__set__("addHospital", queryController.addHospital)
  queryController.__set__("deleteCarer", queryController.deleteCarer)
  queryController.__set__("deleteHospital", queryController.deleteHospital)
  queryController.__set__("editPatient",queryController.editPatient)
  queryController.__set__("editHospital",queryController.editHospital)
  queryController.__set__("editCarer",queryController.editCarer)
  queryController.__set__("requestEditing",queryController.requestEditing)
}

function setAcceptUpdateQueryDatabase(){
  const dbController = {
  updateQuery: async function() {
    return {status: "OK", response:{affectedRows:1}}
  }
  }
  queryController.__set__("databaseController",dbController);
}
