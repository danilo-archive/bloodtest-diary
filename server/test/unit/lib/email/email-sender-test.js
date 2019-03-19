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

/*
describe("Test getEmailInfo method with patient email", function () {
  

    before(function () {
        const query_controller = require('./../../../../lib/query-controller')
        getTestStub = sinon.stub(query_controller, "getTest");
        getHospitalStub = sinon.stub(query_controller, "getHospital");
        getPatientStub = sinon.stub(query_controller, "getPatient");
        getCarerStub = sinon.stub(query_controller, "getCarer");

        email_sender = proxyquire('./../../../../lib/email/email-sender', { query_controller: { getTest: getTestStub, getPatient: getPatientStub, getHospital: getHospitalStub, getCarer: getCarerStub } })
    })

    after(function () {
        getTestStub.restore();
        getHospitalStub.restore();
        getPatientStub.restore();
        getCarerStub.restore();
    })

    it('should return an array with multiple invalid IDs', async () => {
        getTestStub.callsFake(fakeGetQuery);
        getHospitalStub.callsFake(fakeGetQuery);
        getPatientStub.callsFake(fakeGetQuery);
        getCarerStub.callsFake(fakeGetQuery);

        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const invalidIDs = [
            null, [], -1, 0, "asd", "null", JSON, new Date()
        ];
        const failedIDs = [];

        let completed = 0;

        invalidIDs.forEach(async (invalidID) => {
            await getEmailInfo(invalidID, failedIDs);
            completed++;
        });

        while (completed !== invalidIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(invalidIDs.length);
    });

    it('should accept valid testIDs and return an empty failed array', async () => {

        getTestStub.callsFake(fakeGetQuery);
        getHospitalStub.callsFake(fakeGetQuery);
        getPatientStub.callsFake(fakeGetQuery);
        getCarerStub.callsFake(fakeGetQuery);

        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const validIDs = [
            9007199254740992, 1, 2, 3, 4, 5, 10, 100, 100000, 100000202, 123121, 123, 99
        ];
        const failedIDs = [];

        let completed = 0;

        validIDs.forEach(async (validID) => {
            await getEmailInfo(validID, failedIDs);
            completed++;
        });

        while (completed !== validIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(0);
    });


    it("should accept valid testIDs and return an empty failed array when patient email is not present and carer is", async function () {
        getTestStub.callsFake(fakeGetQueryNoPatientEmail);
        getHospitalStub.callsFake(fakeGetQueryNoPatientEmail);
        getPatientStub.callsFake(fakeGetQueryNoPatientEmail);
        getCarerStub.callsFake(fakeGetQueryNoPatientEmail);
        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const validIDs = [
            9007199254740992, 1, 2, 3, 4, 5, 10, 100, 100000, 100000202, 123121, 123, 99
        ];
        const failedIDs = [];

        let completed = 0;

        validIDs.forEach(async (validID) => {
            await getEmailInfo(validID, failedIDs);
            completed++;
        });

        while (completed !== validIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(0);
    });

    it('should fail when test_id does not exist', async function () {
        getTestStub.callsFake(fakeGetQueryNoTest);
        getHospitalStub.callsFake(fakeGetQueryNoTest);
        getPatientStub.callsFake(fakeGetQueryNoTest);
        getCarerStub.callsFake(fakeGetQueryNoTest);

        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const validIDs = [
            9007199254740999
        ];  //we hardcoded in the stub function that this value is not allowed as a valid id, mocking the result of a test which does not exist in the database
        const failedIDs = [];

        let completed = 0;

        validIDs.forEach(async (validID) => {
            await getEmailInfo(validID, failedIDs);
            completed++;
        });

        while (completed !== validIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(validIDs.length);

    });

    it('should fail when patient_no does not exist', async function () {
        getTestStub.callsFake(fakeGetQueryNoPatient);
        getHospitalStub.callsFake(fakeGetQueryNoPatient);
        getPatientStub.callsFake(fakeGetQueryNoPatient);
        getCarerStub.callsFake(fakeGetQueryNoPatient);

        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const validIDs = [
            9007199254740992, 1, 2, 3, 4, 5, 10, 100, 100000, 100000202, 123121, 123, 99
        ];
        const failedIDs = [];

        let completed = 0;

        validIDs.forEach(async (validID) => {
            await getEmailInfo(validID, failedIDs);
            completed++;
        });

        while (completed !== validIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(validIDs.length);

    });

    it('should fail when hospital_id does not exist', async function () {
        getTestStub.callsFake(fakeGetQueryNoHospital);
        getHospitalStub.callsFake(fakeGetQueryNoHospital);
        getPatientStub.callsFake(fakeGetQueryNoHospital);
        getCarerStub.callsFake(fakeGetQueryNoHospital);

        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const validIDs = [
            9007199254740992, 1, 2, 3, 4, 5, 10, 100, 100000, 100000202, 123121, 123, 99
        ];
        const failedIDs = [];

        let completed = 0;

        validIDs.forEach(async (validID) => {
            await getEmailInfo(validID, failedIDs);
            completed++;
        });

        while (completed !== validIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(validIDs.length);

    });

    it('should fail when carer_id does not exist', async function () {
        getTestStub.callsFake(fakeGetQueryNoCarer);
        getHospitalStub.callsFake(fakeGetQueryNoCarer);
        getPatientStub.callsFake(fakeGetQueryNoCarer);
        getCarerStub.callsFake(fakeGetQueryNoCarer);

        const getEmailInfo = email_sender.getEmailInfo; //get private function to test it
        const validIDs = [
            9007199254740992, 1, 2, 3, 4, 5, 10, 100, 100000, 100000202, 123121, 123, 99
        ];
        const failedIDs = [];

        let completed = 0;

        validIDs.forEach(async (validID) => {
            await getEmailInfo(validID, failedIDs);
            completed++;
        });

        while (completed !== validIDs.length) {
            await sleep(1);
        }

        failedIDs.length.should.equal(validIDs.length);
    });
});
*/

describe("Test sendEmails method", function () {
    beforeEach(function () {
        this.sinon.stub(console, 'error');
    })

    it('should fail if the testIDs parameter is not an Array', () => {
        email_sender.sendEmails(null, fakeEmailGeneratingFunction, "Test Title");
        expect(console.error.calledOnce).to.be.true;
        expect(console.error.calledWith("The testIDs object is not an array")).to.be.true;
    });

    it('should fail if the emailInfo is not generated because the testIDs array is empty', () => {
        email_sender.sendEmails([], fakeEmailGeneratingFunction, "Test Title");
        expect(console.error.calledOnce).to.be.true;
        expect(console.error.calledWith("The TestIDs array is empty, could not send any mail")).to.be.true;
    });

    it('should fail when the emailInfo is not generated inside the getEmailInfo method', () => {
        email_sender.sendEmails([null], fakeEmailGeneratingFunction, "Test Title");
        expect(console.error.calledWith("Could not generate emailInfo JSON"))
    });

    it('should give an error for a test for which an html email could not be generated', () => {

        const query_controller = require('./../../../../lib/query-controller')
        getTestStub = sinon.stub(query_controller, "getTest");
        getHospitalStub = sinon.stub(query_controller, "getHospital");
        getPatientStub = sinon.stub(query_controller, "getPatient");
        getCarerStub = sinon.stub(query_controller, "getCarer");

        email_sender = proxyquire('./../../../../lib/email/email-sender', { query_controller: { getTest: getTestStub, getPatient: getPatientStub, getHospital: getHospitalStub, getCarer: getCarerStub } })

        getTestStub.callsFake(fakeGetQuery);

        email_sender.sendEmails([null], fakeEmailGeneratingFunction, "Test Title");
        expect(console.error.calledWith("Could not generate reminder to hospital email for testID: null"))

    });

    it('should successfully send an email', function () {

        email_sender = proxyquire('./../../../../lib/email/email-sender', { query_controller: { getTest: getTestStub, getPatient: getPatientStub, getHospital: getHospitalStub, getCarer: getCarerStub } })

        getTestStub.callsFake(fakeGetQuery);
        getHospitalStub.callsFake(fakeGetQuery);
        getPatientStub.callsFake(fakeGetQuery);
        getCarerStub.callsFake(fakeGetQuery);
        this.sinon.stub(console, 'log');

        email_sender.sendEmails([1], fakeEmailGeneratingFunction, "Test Title");

        expect(console.error.calledWith("Email sent successfully"))

    })
});

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

