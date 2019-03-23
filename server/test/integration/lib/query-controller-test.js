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
  //Insert:
  //4 patients: 3 adults, 1 kid
  //1 hospital
  //1 carer
  //1 user
  //5 tests
  before(async () => {
      const database = new Database(databaseConfig);
      await database.query("DELETE FROM User WHERE username LIKE '%USERNAME%TEST'")
      await database.query("DELETE FROM Patient WHERE patient_no LIKE '%Patient%TEST'")
      await database.query("INSERT INTO Hospital (hospital_name, hospital_email) VALUES ('Hospital1', 'test@email')").then((result) => {
                      hospital_id = result.insertId;
      })
      await database.query("INSERT INTO Carer (carer_name, carer_email) VALUES ('Carer1', 'test2@email')").then((result) => {
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
      await database.close();
  });
  after(async() => {
    after(async () => {
        const database = new Database(databaseConfig);
        await database.query("DELETE FROM User WHERE username LIKE '%USERNAME%TEST'")
        await database.query("DELETE FROM Patient WHERE patient_no LIKE '%Patient%TEST'")
        await database.close();
    });
  })
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
})
