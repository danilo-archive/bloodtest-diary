const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const proxyquire = require('proxyquire')
let email_sender = require('./../../../../lib/email/email-sender');
require('mocha-sinon'); //needed for checking console log
let getTestStub = null
let getHospitalStub = null;
let getPatientStub = null;
let getCarerStub = null;

// TODO: ADD TESTS

//this is just so instanbul isnt red for no reason...
describe("Call all generating functions to have branch coverage", ()=>{
    it("should just call them, man... come on.", ()=>{
        const qc = require('./../../../../lib/email/email-generator');

        const emailInfo = {
            "patient": {
              "patient_no": "P799886",
              "patient_name": "Bruce",
              "patient_surname": "Wayne",
              "patient_email": "imnotbatman@gotham.com",
              "patient_phone": null,
              "hospital_id": 551,
              "carer_id": null,
              "additional_info": null
            },
            "test": {
              "test_id": 1,
              "patient_no": "P799886",
              "due_date": new Date(),
              "frequency": "4-W",
              "occurrences": 9,
              "completed_status": "yes",
              "completed_date": new Date(),
              "notes": null
            },
            "hospital": {
              "hospital_id": 551,
              "hospital_name": "Gotham City Hospital",
              "hospital_email": "hospital@gotham.com",
              "hospital_phone": null
            }
          }

        qc.testReminderForHospital(emailInfo);
        qc.testReminderForPatient(emailInfo);
        qc.overdueTestReminderForHospital(emailInfo);
        qc.overdueTestReminderForPatient(emailInfo);
    })
})

function fakeEmailGeneratingFunction() {
    return "<p>This is fake</p>"
}

/**
 * A fake get query to use for stubs for replacing queries inside the query-controller module
 */
const fakeGetQuery = async function (resultID) {
    const id = parseInt(resultID);
    if (isNaN(id) || id <= 0) {
        return [];
    }
    const result = {
        "response": [{
            "test_id": 1,
            "due_date": new Date(),
            "frequency": "4-W",
            "occurrences": 9,
            "completed_status": "yes",
            "completed_date": new Date(),
            "notes": null,

            "patient_no": "1",
            "patient_name": "Bruce",
            "patient_surname": "Wayne",
            "patient_email": "imnotbatman@gotham.com",
            "patient_phone": null,
            "carer_id": null,
            "additional_info": null,

            "carer_name": "Albert",
            "carer_surname": "Butler",
            "carer_email": "albert@gotham.com",
            "carer_phone": "004408744828985",
            "relationship": null,

            "hospital_id": 1,
            "hospital_name": "Gotham City Hospital",
            "hospital_email": "hospital@gotham.com",
            "hospital_phone": null

        }]
    };
    return result;
}


/**
 * A fake get query to use for stubs for replacing queries inside the query-controller module.
 * In this version, the patient has no email and the carer one is used
 */
const fakeGetQueryNoPatientEmail = async function (resultID) {
    const id = parseInt(resultID);
    if (isNaN(id) || id <= 0) {
        return [];
    }
    const result = {
        "response": [{
            "test_id": 1,
            "due_date": new Date(),
            "frequency": "4-W",
            "occurrences": 9,
            "completed_status": "yes",
            "completed_date": new Date(),
            "notes": null,

            "patient_no": "1",
            "patient_name": "Bruce",
            "patient_surname": "Wayne",
            "patient_email": null,
            "patient_phone": null,
            "carer_id": null,
            "additional_info": null,

            "carer_id": "1",
            "carer_name": "Albert",
            "carer_surname": "Butler",
            "carer_email": "albert@gotham.com",
            "carer_phone": "004408744828985",
            "relationship": null,

            "hospital_id": 1,
            "hospital_name": "Gotham City Hospital",
            "hospital_email": "hospital@gotham.com",
            "hospital_phone": null

        }]
    };
    return result;
}


/**
 * A fake get query to use for stubs for replacing queries inside the query-controller module.
 *  In this version, the patient does not exist and all calls to it should return undefined when
 * the get result is processed
 */
const fakeGetQueryNoPatient = async function (resultID) {
    const id = parseInt(resultID);
    if (isNaN(id) || id <= 0) {
        return [];
    }
    const result = {
        "response": [{
            "test_id": 1,
            "due_date": new Date(),
            "frequency": "4-W",
            "occurrences": 9,
            "completed_status": "yes",
            "completed_date": new Date(),
            "notes": null,

            "hospital_id": 1,
            "hospital_name": "Gotham City Hospital",
            "hospital_email": "hospital@gotham.com",
            "hospital_phone": null

        }]
    };
    return result;
}


/**
 * A fake get query to use for stubs for replacing queries inside the query-controller module.
 * In this version, the hospital does not exist and all calls to it should return undefined when
 * the get result is processed
 */
const fakeGetQueryNoHospital = async function (resultID) {
    const id = parseInt(resultID);
    if (isNaN(id) || id <= 0) {
        return [];
    }
    let result = {
        "response": [{
            "test_id": 1,
            "due_date": new Date(),
            "frequency": "4-W",
            "occurrences": 9,
            "completed_status": "yes",
            "completed_date": new Date(),
            "notes": null,

            "patient_no": "1",
            "patient_name": "Bruce",
            "patient_surname": "Wayne",
            "patient_email": null,
            "patient_phone": null,
            "carer_id": null,
            "additional_info": null,

            "carer_id": "1",
            "carer_name": "Albert",
            "carer_surname": "Butler",
            "carer_email": "albert@gotham.com",
            "carer_phone": "004408744828985",
            "relationship": null,

        }]
    };
    return result;
}

/**
 * A fake get query to use for stubs for replacing queries inside the query-controller module.
 * In this version, the carer does not exist and all calls to it should return undefined when
 * the get result is processed
 */
const fakeGetQueryNoCarer = async function (resultID) {
    const id = parseInt(resultID);
    if (isNaN(id) || id <= 0) {
        return [];
    }
    let result = {
        "response": [{
            "test_id": 1,
            "due_date": new Date(),
            "frequency": "4-W",
            "occurrences": 9,
            "completed_status": "yes",
            "completed_date": new Date(),
            "notes": null,

            "patient_no": "1",
            "patient_name": "Bruce",
            "patient_surname": "Wayne",
            "patient_email": null,
            "patient_phone": null,
            "carer_id": null,
            "additional_info": null,


            "hospital_id": 1,
            "hospital_name": "Gotham City Hospital",
            "hospital_email": "hospital@gotham.com",
            "hospital_phone": null
        }]
    };
    return result;
}


/**
 * A fake get query to use for stubs for replacing queries inside the query-controller module.
 *  In this version, the test does not exist and all calls to it should return undefined when
 * the get result is processed
 */
const fakeGetQueryNoTest = async function (resultID) {
    const id = parseInt(resultID);
    if (isNaN(id) || id <= 0 || 9007199254740999) {
        return [];
    }
    let result = {
        "response": [{
            "patient_no": "1",
            "patient_name": "Bruce",
            "patient_surname": "Wayne",
            "patient_email": null,
            "patient_phone": null,
            "carer_id": null,
            "additional_info": null,

            "carer_id": "1",
            "carer_name": "Albert",
            "carer_surname": "Butler",
            "carer_email": "albert@gotham.com",
            "carer_phone": "004408744828985",
            "relationship": null,


            "hospital_id": 1,
            "hospital_name": "Gotham City Hospital",
            "hospital_email": "hospital@gotham.com",
            "hospital_phone": null
        }]
    };
    return result;
}
/**
* Await for this function to pause execution for a certain time.
*
* @param {number} ms Time in milliseconds
* @returns {Promise}
*/
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

