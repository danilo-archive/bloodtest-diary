const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const inserter = rewire("../../../../lib/query-modules/inserter.js");
const testUsername = "admin";

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
inserter.__set__("actionLogger",actionLogger);

describe("Insert queries tests", function(){
    context("Insert new test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(inserter.addTest);
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
          spy = sinon.spy(inserter.addUser);
      })
      it("Should accept new User (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{username:testUsername,hashed_password:"21828728218",email:"email@email.com"})
      })
      it("Should reject new User (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{username:testUsername,isAdmin:"yes",hashed_password:"21828728218",email:"email@email.com"})
      })
    })
    context("Add new Patient", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(inserter.addPatient);
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
          spy = sinon.spy(inserter.addHospital);
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
          spy = sinon.spy(inserter.addCarer);
      })
      it("Should accept new carer (STUBBED)", async function() {
        stubbedPositiveInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
      it("Should reject new carer (STUBBED)", async function() {
        stubbedErrorInsertTest(spy,{patient_no: "50005",due_date:"2018-03-04"})
      })
    })
})
describe("Other functionality", function(){

  context("Execute insert query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(inserter.insertQueryDatabase);
    })
    it("Correctly execute insert query (STUBBED)", async function(){
      const dbController = {
        insertQuery: async function() {
          return {status: "OK", response:{insertId:"123", }}
        }
      }
      inserter.__set__("databaseController",dbController);
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
      inserter.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(false);
    })
    it("Reject insert query - SQL error (STUBBED)", async function(){
      const dbController = {
        insertQuery: async function() {
          return {status: "ERR", err:{type:"SQL Error", error:"STUBBED ERROR"}}
        }
      }
      inserter.__set__("databaseController",dbController);
      const response = await spy("SQL");
      response.success.should.equal(false);
    })
  })
  context("Prepare insert query", function(){
  let spy;
  beforeEach(()=>{
      spy = sinon.spy(inserter.prepareInsertSQL);
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
})

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

function setFaultyInsert(){
  const dbController = {
    insertQuery: async function() {
      return {status:"ERR", err: { type: "SQL error", sqlMessage: "stubbed SQL Message"}}
    }
  }
  inserter.__set__("databaseController",dbController);
}

function setPositiveInsert(){
  const dbController = {
    insertQuery: async function() {
      return {status:"OK", response: { insertId: "test_insert_id"}}
    }
  }
  inserter.__set__("databaseController",dbController);
}
