const chai = require('chai');
const should = chai.should();
const rewire = require('rewire');
const email_sender = rewire('./../../../../lib/email/email-sender');  //use rewire module to access private funcitons

/**
* TODO: WRITE TEST DESCRIPTION?
*/
describe("Email Sending", function () {

    //TODO: MORE TESTS NEEDED
    it('should return valid options for email sending', async function () {
        const getOptionsForEmail = email_sender.__get__('getOptionsForEmail'); //fetch private function for testing
        const receiverEmail = 'test@test.com';
        const subject = 'Subject Test';
        const email_info = {
            "patient": {
                patient_no: '127699',
                patient_name: 'name127699',
                patient_surname: 'surname127699',
                patient_email: 'patient127699@gmail.com',
                patient_phone: '7428137322',
                lab_id: null
            },
            "test": {
                test_id: 2,
                patient_no: '612505',
                added: '2018 - 11 - 15T00: 00: 00.000Z',
                first_due_date: '2018 - 11 - 22T00: 00: 00.000Z',
                frequency: 'weekly',
                lab_id: 4,
                completed_status: 'yes',
                completed_date: '2018 - 12 - 04T00: 00: 00.000Z',
                notes: null
            },
            "lab": {
                lab_id: 1,
                lab_name: 'lab1',
                lab_email: 'lab1@gmail.com',
                lab_phone: null
            }
        };
        const email_generator_function = async function (email_info) {
            return await `<p> Email Sent to ${email_info.patient.patient_email}</p>`
        }
        let result = null;
        await getOptionsForEmail(receiverEmail, subject, email_info, email_generator_function).then((r) => {
            result = r;
        });
        const expected = JSON.stringify({
            "to": receiverEmail,
            "subject": subject,
            "text": "",
            "html": `<p> Email Sent to ${email_info.patient.patient_email}</p>`
        });
        JSON.stringify(result).should.deep.equal(expected);
    });
});
