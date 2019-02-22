/**
 * Send Email to multiple addresses 
  //TODO: WRITE MODULE DESCRIPTION
 * @module email-sender
 * @author Jacopo Madaluni, Danilo Del Busso
 * @version 0.0.2
 */


const nodeMailer = require('nodemailer');
const jsonController = require('./json-controller');
const CONFIG_ABSOLUTE_PATH = __dirname + '/../config/email_config.json'; //the absolute path of the email_config.json file

init(CONFIG_ABSOLUTE_PATH);

/**
 * Initialise and start CronJob and email sender service to be run in the background
 //TODO: WRITE FORMAT OF CONFIG FILE IN EXAMPLE
 * @param {string} configPath the absolute path of the email-config.json file
 */
function init(configPath) {
    const config = jsonController.getJSON(configPath);

    if (config != null) {
        const cron = config.cron;  //the cron options of the email sender
        const CronJob = require('cron').CronJob;
        const cronPattern = `${cron.second} ${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`;
        //TODO: REMOVE SECONDS?
        const job = new CronJob(cronPattern, function () {
            sendAllEmails(config.email);
        });

        job.start();
    }
}


function sendAllEmails(emailConfig){
    //TODO NEXT STEP
    //send information about patients that are overdue to labs and doctors
    //send email to every patient that has a test based on config file (every day/week/month)
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

module.exports = {
    sendEmail
}
