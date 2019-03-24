const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
chai.use(sinonChai);
const queryController = require("../../../lib/query-controller");
const databaseConfig = require("../../../config/database");
const Database = require("../../../lib/db_controller/Database");
const dateFormat = require("dateformat");

describe("Test queries", function(){
  let hospital_id;
  let carer_id;
  let test1_id;
  let test2_id;
  let test3_id;
  let test4_id;
  let test5_id;
  let test6_id;
  const nowDate = new Date();
  nowDate.setMinutes(nowDate.getMinutes() + 30);
  const expires = dateFormat(nowDate, "yyyymmddHHMMss");
  //Insert:
  //4 patients: 3 adults, 1 kid
  //1 hospital
  //1 carer
  //1 user
  //5 tests
  before(async () => {
      const database = new Database(databaseConfig);
      await database.query("DELETE FROM ActionLog WHERE username LIKE 'USERNAME%TEST'")
      await database.query("DELETE FROM EditTokens WHERE token LIKE 'TOKEN%TEST'")
      await database.query("DELETE FROM User WHERE username LIKE 'USERNAME%TEST'")
      await database.query("DELETE FROM Carer WHERE carer_name LIKE 'Carer%TEST'")
      await database.query("DELETE FROM Hospital WHERE hospital_name LIKE 'Hospital%TEST'")
      await database.query("DELETE FROM Patient WHERE patient_no LIKE 'Patient%TEST'")
      await database.query("INSERT INTO Hospital (hospital_name, hospital_email) VALUES ('Hospital1TEST', 'test@email')").then((result) => {
                      hospital_id = result.insertId;
      })
      await database.query("INSERT INTO Carer (carer_name, carer_email) VALUES ('Carer1TEST', 'test2@email')").then((result) => {
                      carer_id = result.insertId;
      })
      await database.query("INSERT INTO User (username,hashed_password,salt,iterations,recovery_email) VALUES ('USERNAME1TEST','hashed_password','salty salt','1001','recovery_email@gmail.com')")
      await database.query(`INSERT INTO Patient (patient_no, patient_name, patient_surname,hospital_id) VALUES ('Patient1TEST', 'testName1', 'testSurname1',${hospital_id})`)
      await database.query(`INSERT INTO Patient (patient_no, patient_name, patient_surname,carer_id) VALUES ('Patient2TEST', 'testName2', 'testSurname2',${carer_id})`)
      await database.query("INSERT INTO Patient (patient_no, patient_name, patient_surname) VALUES ('Patient3TEST', 'testName3', 'testSurname3')")
      await database.query(`INSERT INTO Patient (patient_no, patient_name, patient_surname,carer_id,hospital_id) VALUES ('Patient4TEST', 'testName4', 'testSurname4',${carer_id},${hospital_id})`)
      await database.query(`INSERT INTO Patient (patient_no, patient_name, patient_surname,isAdult) VALUES ('Patient5TEST', 'testName4', 'testSurname4',"no")`)
      await database.query(`INSERT INTO Test (patient_no,due_date,frequency) VALUES ('Patient1TEST','20190322','1-W')`).then((result) => {
                      test1_id = result.insertId;
      })
      await database.query(`INSERT INTO Test (patient_no,due_date,frequency,completed_status) VALUES ('Patient1TEST','20190319','1-W','yes')`).then((result) => {
                      test2_id = result.insertId;
      })
      await database.query(`INSERT INTO Test (patient_no,due_date,frequency) VALUES ('Patient2TEST','20190321','1-W')`).then((result) => {
                      test3_id = result.insertId;
      })
      await database.query(`INSERT INTO Test (patient_no,due_date,frequency,completed_status) VALUES ('Patient1TEST','20190319','1-W','in review')`).then((result) => {
                      test4_id = result.insertId;
      })
      await database.query(`INSERT INTO Test (patient_no,due_date,frequency) VALUES ('Patient2TEST','20180319','1-W')`).then((result) => {
                      test5_id = result.insertId;
      })
      await database.query(`INSERT INTO EditTokens VALUES ('TOKEN2TEST', 'Test', ${test1_id}, ` + expires + `)`)
      await database.close();
  });
  after(async () => {
        const database = new Database(databaseConfig);
        await database.query("DELETE FROM ActionLog WHERE username LIKE 'USERNAME%TEST'")
        await database.query("DELETE FROM EditTokens WHERE token LIKE 'TOKEN%TEST'")
        await database.query("DELETE FROM User WHERE username LIKE 'USERNAME%TEST'")
        await database.query("DELETE FROM Carer WHERE carer_name LIKE 'Carer%TEST'")
        await database.query("DELETE FROM Hospital WHERE hospital_name LIKE 'Hospital%TEST'")
        await database.query("DELETE FROM Patient WHERE patient_no LIKE 'Patient%TEST'")
        await database.close();
  });
  context("Selects", function(){
    it("Get all patients (ADULTS)", async function(){
      const response = await queryController.getAllPatients(true);
      response.success.should.equal(true);
      (response.response.length>3).should.equal(true);
    })
    it("Get all patients (KIDS)", async function(){
      const response = await queryController.getAllPatients(false);
      response.success.should.equal(true);
      (response.response.length>0).should.equal(true);
    })
    it("Get patient 1", async function(){
      const response = await queryController.getPatient("Patient1TEST");
      response.success.should.equal(true);
      response.response[0].patient_name.should.equal('testName1');
    })
    it("Get patient 2", async function(){
      const response = await queryController.getPatient("Patient2TEST");
      response.success.should.equal(true);
      response.response[0].patient_name.should.equal('testName2');
    })
    it("Get patient 50", async function(){
      const response = await queryController.getPatient("Patient50TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get full patient info 1", async function(){
      const response = await queryController.getFullPatientInfo("Patient1TEST");
      response.response[0].patient_name.should.equal('testName1')
      response.success.should.equal(true);
    })
    it("Get full patient info 4", async function(){
      const response = await queryController.getFullPatientInfo("Patient4TEST");
      response.success.should.equal(true);
      response.response[0].patient_name.should.equal('testName4')
      response.response[0].hospital_email.should.equal('test@email');
      response.response[0].carer_email.should.equal('test2@email');
    })
    it("Get full patient info 50", async function(){
      const response = await queryController.getFullPatientInfo("Patient50TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get carer 1", async function(){
      const response = await queryController.getCarer(carer_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      response.response[0].carer_email.should.equal("test2@email");
    })
    it("Get carer TEST1CARER", async function(){
      const response = await queryController.getCarer("TEST1CARER");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get hospital 1", async function(){
      const response = await queryController.getHospital(hospital_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      response.response[0].hospital_email.should.equal("test@email");
    })
    it("Get hospital TEST1", async function(){
      const response = await queryController.getHospital("TEST1");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get user USERNAME1TEST", async function(){
      const response = await queryController.getUser("USERNAME1TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(1);
    })
    it("Get user USERNAME10TEST", async function(){
      const response = await queryController.getUser("USERNAME10TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get all user", async function(){
      const response = await queryController.getAllUsers();
      response.success.should.equal(true);
      (response.response.length>1).should.equal(true);
    })
    it("Get test1", async function(){
      const response = await queryController.getTest(test1_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      dateFormat(response.response[0].due_date,"yyyymmdd").should.equal("20190322")
    })
    it("Get test2", async function(){
      const response = await queryController.getTest(test2_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      dateFormat(response.response[0].due_date,"yyyymmdd").should.equal("20190319")
    })
    it("Get test3", async function(){
      const response = await queryController.getTest(test3_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      dateFormat(response.response[0].due_date,"yyyymmdd").should.equal("20190321")
    })
    it("Get test1 TEST50", async function(){
      const response = await queryController.getTest("TEST50");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get Next test of patient 1", async function(){
      const response = await queryController.getNextTestsOfPatient("Patient1TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      response.response[0].test_id.should.equal(test1_id);
    })
    it("Get next tests of patient 2", async function(){
      const response = await queryController.getNextTestsOfPatient("Patient2TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(2);
      response.response[0].test_id.should.equal(test3_id);
    })
    it("Get Next test of patient 3", async function(){
      const response = await queryController.getNextTestsOfPatient("Patient3TEST");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get info test1", async function(){
      const response = await queryController.getTestInfo(test1_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      dateFormat(response.response[0].due_date,"yyyymmdd").should.equal("20190322")
    })
    it("Get info test2", async function(){
      const response = await queryController.getTestInfo(test2_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      dateFormat(response.response[0].due_date,"yyyymmdd").should.equal("20190319")
    })
    it("Get info test3", async function(){
      const response = await queryController.getTestInfo(test3_id);
      response.success.should.equal(true);
      response.response.length.should.equal(1);
      dateFormat(response.response[0].due_date,"yyyymmdd").should.equal("20190321")
    })
    it("Get info TEST50", async function(){
      const response = await queryController.getTest("TEST50");
      response.success.should.equal(true);
      response.response.length.should.equal(0);
    })
    it("Get sorted overdue weeks (ADULTS)", async function(){
      const response = await queryController.getSortedOverdueWeeks(true);
      response.success.should.equal(true);
      (response.response.length>1).should.equal(true);
    })
    it("Get sorted overdue weeks (KIDS)", async function(){
      const response = await queryController.getSortedOverdueWeeks(false);
      response.success.should.equal(true);
      (response.response.length>=0).should.equal(true);
    })
    it("Get tests within week (ADULTS)", async function(){
      const response = await queryController.getTestWithinWeek("2019-03-18",true);
      response.success.should.equal(true);
      (response.response.length).should.equal(6);
      (response.response[0].length>=0).should.equal(true);
    })
    it("Get tests within week (KIDS)", async function(){
      const response = await queryController.getTestWithinWeek("2019-03-18",false);
      response.success.should.equal(true);
      (response.response.length).should.equal(6);
      (response.response[0].length>=0).should.equal(true);
    })
    it("Get overdue groups (ADULTs)", async function(){
      const response = await queryController.getOverdueReminderGroups(true);
      response.success.should.equal(true);
    })
    it("Get overdue groups (KIDS)", async function(){
      const response = await queryController.getOverdueReminderGroups(false);
      response.success.should.equal(true);
    })

  })
  context("Inserts",function(){
    it("Add User2", async function(){
      const response = await queryController.addUser({username:"USERNAME2TEST",hashed_password:"aaa",recovery_email:"gmail"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add User1", async function(){
      const response = await queryController.addUser({username:"USERNAME1TEST",hashed_password:"aaa",recovery_email:"gmail"},"USERNAME1TEST")
      response.success.should.equal(false);
    })
    it("Add Test6", async function(){
      const response = await queryController.addTest({patient_no:"Patient2TEST",due_date:"19700101"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Test7", async function(){
      const response = await queryController.addTest({due_date:"19700101"},"USERNAME1TEST")
      response.success.should.equal(false);
    })
    it("Add Patient6", async function(){
      const response = await queryController.addPatient({patient_no:"Patient6TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Patient3", async function(){
      const response = await queryController.addPatient({patient_no:"Patient3TEST"},"USERNAME1TEST")
      response.success.should.equal(false);
    })
    it("Add Carer3", async function(){
      const response = await queryController.addCarer({carer_name:"Carer3TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Carer1", async function(){
      const response = await queryController.addCarer({carer_name:"Carer2TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Hospital2", async function(){
      const response = await queryController.addHospital({hospital_name:"Hospital2TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Hospital3", async function(){
      const response = await queryController.addHospital({hospital_name:"Hospital3TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Patient7 Extended", async function(){
      const response = await queryController.addPatientExtended({patient_no:"Patient7TEST",carer_name:"Carer6TEST",hospital_name:"Hospital7TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Patient8 Extended", async function(){
      const response = await queryController.addPatientExtended({patient_no:"Patient8TEST",hospital_name:"Hospital9TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Add Patient9 Extended", async function(){
      const response = await queryController.addPatientExtended({patient_no:"Patient9TEST",carer_name:"Carer9TEST"},"USERNAME1TEST")
      response.success.should.equal(true);
    })
  })

  context("Updates",function(){
    afterEach(async () => {
          const database = new Database(databaseConfig);
          await database.query("DELETE FROM EditTokens WHERE token LIKE 'TOKEN%TEST'")
          await database.close();
    });
    it("Edit Patient2", async function(){
      const token = await queryController.requestEditing("Patient",'Patient2TEST',"USERNAME1TEST")
      const response = await queryController.editPatient({patient_no:"Patient2TEST", patient_name:"GARY"},token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Edit Patient6", async function(){
      const token = await queryController.requestEditing("Patient",'Patient6TEST',"USERNAME1TEST")
      const response = await queryController.editPatient({patient_no:"Patient6TEST", patient_name:"GARY"},token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Edit Patient7 Extended",async function(){
      const token = await queryController.requestEditing("Patient",'Patient7TEST',"USERNAME1TEST")
      const response = await queryController.editPatientExtended({patient_no:"Patient7TEST", patient_name:"MARK", carer_email:"EmailTEST123", hospital_email:"TEST123Email"},token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Edit Patient2 Extended (Adds carer)",async function(){
      const token = await queryController.requestEditing("Patient",'Patient2TEST',"USERNAME1TEST")
      const response = await queryController.editPatientExtended({patient_no:"Patient2TEST", patient_name:"BETHANY", carer_name:"Carer1TEST", hospital_name:"Hospital2TEST"},token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Edit Patient2 Extended (Adds hospital)",async function(){
      const token = await queryController.requestEditing("Patient",'Patient2TEST',"USERNAME1TEST")
      const response = await queryController.editPatientExtended({patient_no:"Patient2TEST", patient_name:"SALLY", carer_name:"Carer5TEST", hospital_name:"Hospital9TEST"},token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Edit Test5 add schedule new (Test 6)",async function(){
      const token = await queryController.requestEditing("Test",test5_id,"USERNAME1TEST")
      const response = await queryController.editTest(test5_id,{test_id:test5_id, completed_status:"yes",frequency:"W-2",occurrences:3},token,"USERNAME1TEST")
      response.success.should.equal(true);
      (typeof response.response.insertId).should.not.equal('undefined');
    })
    it("Edit Test5 add do not schedule new",async function(){
      const token = await queryController.requestEditing("Test",test5_id,"USERNAME1TEST")
      const response = await queryController.editTest(test5_id,{test_id:test5_id, completed_status:"no",frequency:"W-2",occurrences:3},token,"USERNAME1TEST")
      response.success.should.equal(true);
      (typeof response.response.insertId).should.equal('undefined');
    })

    it("Update last reminded Test5",async function(){
      const token = await queryController.requestEditing("Test",test5_id,"USERNAME1TEST")
      const response = await queryController.updateLastReminder(test5_id,token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
    it("Update last reminded Test3",async function(){
      const token = await queryController.requestEditing("Test",test3_id,"USERNAME1TEST")
      const response = await queryController.updateLastReminder(test3_id,token,"USERNAME1TEST")
      response.success.should.equal(true);
    })
  })
  context("Deletes", function(){
    it("Delete Carer1", async function(){
      const response = await queryController.deleteCarer(carer_id,'USERNAME1TEST');
      response.success.should.equal(true);
    })
    it("Delete Hospital1", async function(){
      const response = await queryController.deleteHospital(hospital_id,'USERNAME1TEST');
      response.success.should.equal(true);
    })
    it("Delete Patient1TEST",async function(){
      const response = await queryController.deletePatient("Patient1TEST","heejrjew",'USERNAME1TEST');
      response.success.should.equal(false);
    })
    it("Delete Patient3TEST",async function(){
      const token = await queryController.requestEditing("Patient","Patient3TEST","USERNAME1TEST")
      const response = await queryController.deletePatient("Patient3TEST",token,'USERNAME1TEST');
      response.success.should.equal(true);
    })
    it("Unschedule TEST4",async function(){
      const token = await queryController.requestEditing("Test",test4_id,"USERNAME1TEST")
      const response = await queryController.unscheduleTest(test4_id,token,'USERNAME1TEST');
      response.success.should.equal(true);
    })
  })
})
