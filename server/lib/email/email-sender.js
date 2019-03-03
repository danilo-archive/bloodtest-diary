/**
 * The email-sender sends email to patients and labs.
 * The module is centered around a specific config file to be created which specifies
 * the host email from which emails are being sent, as well as when emails have to be sent and to who.
 * @example <caption>Example of the config file.</caption>
 {
    "transporter": {
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true, //this value true only with port 465
        "auth": {
            "user": "",
            "pass": ""
        },
        "tls": {
            "rejectUnauthorized": false
        }
    }
}
 * @module email-sender
 * @author Jacopo Madaluni, Danilo Del Busso
 * @version 0.0.2
 */
const email_generator = require('./email-generator');
const nodeMailer = require('nodemailer');
const jsonController = require('../json-controller');
const CONFIG_ABSOLUTE_PATH = __dirname + '/../../config/email_config.json'; //the absolute path of the email_config.json file
const query_controller = require('../query-controller');
/*
|--------------------------------------------------------------------------
| EMAIL SENDING FUNCTIONS SECTION
|--------------------------------------------------------------------------
| This section contains the functions which send emails and handle
| email creation
|
*/

/**
 * Send one email for every test. The content of the email will depend on the email generator function 
 * @param {array} testIDs the IDs of the tests to be send
 * @param {function} emailGeneratorFunction the function needed to generate test emails
 */
function sendBloodtestsEmails(testIDs, emailGeneratorFunction) {
    const subjectTitle = "Reminder for your test";

    const config = jsonController.getJSON(CONFIG_ABSOLUTE_PATH);
    const transporter = nodeMailer.createTransport(config.transporter);

    testIDs.forEach(async (test) => {

        //if patient doesn't have email, send it to carer!
        const patient = await query_controller.getPatient(test.patient_no);
        const hospital = await query_controller.getHospital(patient.hospital_id);
        console.log(hospital.response);
        

        const emailInfo = {
            "patient": patient,
            "test": test,
            "hospital": hospital
        }
        if (patient.patient_email == null) {
            emailInfo.carer = await query_controller.getCarer(patient.carer_id)
        }
        const receiverOptions = {
            "from": transporter.options.auth.user,
            "to": "delbussodanilo98@gmail.com",
            "subject": subjectTitle,
            "html": emailGeneratorFunction(emailInfo)+` 
            <br><br><br>
            ${JSON.stringify(emailInfo)}`
        }

        sendEmail(transporter, receiverOptions);
    });
}

/**
 * Send a single email based on the options
 * @param {transporter} transporter the transporter from which emails are being sent
 * @param {JSON} receiverOptions the options of the email address to be sent, as well as the content of the mail
 */
function sendEmail(transporter, receiverOptions) {
    //TODO: TEST THIS FOR GOD'S SAKE
    transporter.sendMail(receiverOptions, (err, info) => {
        if (err) { console.log(err); }
        else { console.log(info) }
    });
}


/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
    sendBloodtestsEmails
}
