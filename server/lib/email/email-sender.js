/**
 * The email-sender sends email to patients and labs.
 * The module is centered around a specific config file to be created which specifies
 * the host email from which emails are being sent, as well as when emails have to be sent and to who.
 * @example <caption>Example of the config file.</caption>
 {
    "email": {
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
    },
    //Example of cron patterns. The email sender one every monday at 7:00 a.m.
    //The backlog_update pattern executes every day at midnight.
    //To learn more about CRON patters and how to use them go to
    //https://bit.ly/2S193os for a quick tutorial
    "cron": {
        "email_sender": {
            "second": "0",
            "minute": "0",
            "hour": "7",
            "dayOfMonth": "*",
            "month": "*",
            "dayOfWeek": "1"
        },
        "backlog_update": {
            "second": "0",
            "minute": "0",
            "hour": "0",
            "dayOfMonth": "*",
            "month": "*",
            "dayOfWeek": "*"
        }
    }
}
 * @module email-sender
 * @author Jacopo Madaluni, Danilo Del Busso
 * @version 0.0.2
 */
const nodeMailer = require('nodemailer');
const jsonController = require('../json-controller');
const CONFIG_ABSOLUTE_PATH = __dirname + '/../../config/email_config.json'; //the absolute path of the email_config.json file
let backlog = [];
const query_controller = require('../query-controller')

//todo: remove this init when module is complete
init(CONFIG_ABSOLUTE_PATH, backlog);

/**
 * Initialise and start CronJob and email sender service to be run in the background.
 * 
 @param {string} configPath the absolute path of the email-config.json file
 @param {array} backlog an array containing details of tests that have yet to be sent
 */
function init(configPath) {
    const config = jsonController.getJSON(configPath);

    //? what if the backlog updates less often than the emails are being sent? code has to support empty backlog
    startBacklogUpdateCron(config);
    startEmailSenderCron(config);
}

/*
|--------------------------------------------------------------------------
| CRON FUNCTIONS SECTION
|--------------------------------------------------------------------------
| This section contains the functions which create and handle cron functionality
|
*/

/**
 * Start the cron which updates the backlog of tests due.
* @param {JSON} config the configuration file. For info on the format, look at the module description. 
 */
function startBacklogUpdateCron(config) {
    const cron = config.cron.backlog_update; //the cron options specifying when to update the backlog
    const cronPattern = `${cron.second} ${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`;
    const CronJob = require('cron').CronJob;
    const job = new CronJob(cronPattern, addTestsToBacklog(new Date()));
    job.start();
}

/**
 * Start the cron which sends all the emails present in the backlog
 * @param {JSON} config the configuration file. For info on the format, look at the module description. 
 */
function startEmailSenderCron(config) {
    if (config != null) {
        const cron = config.cron.email_sender;  //the cron options of the email sender
        const cronPattern = `${cron.second} ${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`;

        const CronJob = require('cron').CronJob;
        const job = new CronJob(cronPattern, function () {
            sendAllBacklogEmails(config.email);
        });

        job.start();
    }
}

/**
 * Get all the tests due on the corresponding date and
 * add them to the backlog array if they are not present already
 * @param {date} date 
 */
function addTestsToBacklog(date) {
    //!!! this code assumes the result of the query is not a promise and that some query controller functions exist
    const result = query_controller.getTestsOnDay(date);
    if (result.success) {
        const tests = result.response.rows;
        tests.forEach(test => {
            if (backlog.every(t => t.test_id !== test.test_id)) {  //avoid test duplicates
                backlog.push(test);
            }
        })
    }
    //? what if success is false
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
 * @param {JSON} emailConfig 
 * @param {array} backlog 
 */
function sendAllBacklogEmails(emailConfig) {
    //TODO WRITE FUNCTION BODY
    //!!! THIS VERSION OF THE CODE ASSUMES THAT THE QUERY CONTROLLER EXISTS!!!

    //send information about patients that are overdue to labs and doctors
    //send email to every patient that has a test based on config file (every day/week/month)

    //clean backlog
    backlog = [];
}


/**
 * Send a single email based on the options
   //TODO: WRITE FUNCTION DESCRIPTION
 * @param {JSON} transporterOptions the config file for the address from which the email is sent (content of "email" object in email-config.json)
 * @param {JSON} receiverOptions the options of the email address to be sent, as well as the content of the mail
 */
function sendEmail(transporterOptions, receiverOptions) {

    //set the transporter settings
    const transporter = nodeMailer.createTransport({
        host: transporterOptions.host,
        port: transporterOptions.port,
        secure: transporterOptions.secure,  //true for 465 port, false for other ports
        auth: {
            user: transporterOptions.auth.user,
            pass: transporterOptions.auth.password
        },
        tls: {
            rejectUnauthorized: transporterOptions.tls.rejectUnauthorized
        }
    });

    // setup email data with unicode symbols
    const options = {
        from: transporterOptions.auth.user, // sender address
        to: receiverOptions.to, // list of receivers
        subject: receiverOptions.subject, // Subject line
        text: receiverOptions.text, // plain text body
        html: receiverOptions.html // html body
    };

    transporter.sendMail(options, (error) => {
        if (error) {
            console.error(error);
            //res.status(400).send({success: false})
            //TODO: ERROR HANDLING
        } else {
            //TODO: IN CASE OF SUCCESS?
        }
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
async function getOptionsForEmail(receiverEmail, subject, email_info , email_generator_function) {

    //TODO : GENERALISE THIS! CURRENT FORMAT WILL ONLY WORK FOR PATIENTS
    //TODO: CHECK IF "text" IS NEEDED OR IF IT CAN BE OMITTED
    return await email_generator_function(email_info).then(async (generated_html) => {
        return {
            "to": receiverEmail,
            "subject": subject,
            "text": "",
            "html": generated_html
        }
    })
}

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
    init
}
