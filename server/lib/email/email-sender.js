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
const query_controller = require('../query-controller')
let transporter = null; //? is this a good idea? maybe not have it as a global variable

//todo: remove this init when module is complete
//init(CONFIG_ABSOLUTE_PATH, backlog);

/**
 * Initialise and start CronJob and email sender service to be run in the background.
 *      
 @param {string} configPath the absolute path of the email-config.json file
 @param {array} backlog an array containing details of tests that have yet to be sent
 */
function init(configPath) {
    const config = jsonController.getJSON(configPath);
    transporter = nodeMailer.createTransport(config.transporter);

}

/*
|--------------------------------------------------------------------------
| EMAIL SENDING FUNCTIONS SECTION
|--------------------------------------------------------------------------
| This section contains the functions which send emails and handle
| email creation
|
*/

/**
 //TODO: WRITE JSDOC
 * @param {array} test_ids
 */
function sendEmails(testIDs) {

    //send information about patients that are overdue to labs and doctors
    //TODO WRITE EMAIL SENDING TO LABS

    //send email to every patient that has a test based on config file (every day/week/month)
    //? WILL THE BACKLOG CLEANING HAPPEN BEFORE THE FOREACH IS FINISHED?
    testIDs.forEach(async (test) => {

        //if patient doesn't have email, send it to carer!
        const patient = await query_controller.getPatient(test.patient_no);

        if (patient.patient_email == null) {
            //TODO: GET CARERS CONNECTED TO PATIENT, HAVE TO WAIT FOR QUERY TO BE WRITTEN
        }
        const lab = await query_controller.getLab(test.lab_id);

        const email_info = {
            "patient": patient,
            "test": test,
            "lab": lab
        }

        const receiverOptions = await getOptionsForEmail(patient.patient_email, "SUBJECT EMAIL", email_info, email_generator.testDueReminderForPatient)

        sendEmail(transporter, receiverOptions)
    })
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


/**
 * Get the receiver options needed to send an email
 * @async
 * @param {string} receiverEmail the receiver's email address
 * @param {string} subject the subject of the email
 * @param {JSON} email_info information needed to fill custom details of the email, depends on which email generator function is passed
 * @param {function} email_generator_function the function which generates the html, it should return a Promise.
 * @return {Promise<JSON>} the JSON containing the option needed to send an email to the specified patient
 */
async function getOptionsForEmail(receiverEmail, subject, email_info, email_generator_function) {

    //TODO : GENERALISE THIS! CURRENT FORMAT WILL ONLY WORK FOR PATIENTS
    return {
        "from": transporter.options.auth.user,
        "to": receiverEmail,
        "subject": subject,
        "html": email_generator_function(email_info)
    }

}

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
    init
}
