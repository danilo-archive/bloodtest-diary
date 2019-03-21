/**
 * The email-sender sends email to patients and labs.
 * The module is centered around a specific config file to be created which specifies
 * the host email from which emails are being sent, as well as when emails have to be sent and to who.
 * @example <caption>Example of the config file.</caption>
 {
    "transporter": {
        "host": "smtp.gotham.mail.com",  //example of SMTP host
        "port": 465,
        "secure": true, //this value true only with port 465
        "auth": {
            "user": "imnotbatman@gotham.com", //example of email
            "pass": "jokerisajoke42" //password
        }
    }
}
 * @module email-sender
 * @author Danilo Del Busso, Jacopo Madaluni, Luka Kralj
 * @version 0.0.3
 */

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
  sendReminderToPatient,
  sendReminderToHospital,
  sendOverdueReminderToPatient,
  sendOverdueReminderToHospital,
  sendPasswordRecoveryEmail
};

const email_generator = require("./email-generator");
const nodeMailer = require("nodemailer");
const jsonController = require("../json-parser");
const CONFIG_ABSOLUTE_PATH = __dirname + "/../../config/email_config.json"; //the absolute path of the email_config.json file
const email_config = jsonController.getJSON(CONFIG_ABSOLUTE_PATH);
/*
|--------------------------------------------------------------------------
| MAIN EMAIL SENDING FUNCTIONS
|--------------------------------------------------------------------------
| This section contains the functions which can be called externally to send emails,
| these functions do not directly handle data and generate emails. They are written to simplify
| usage of the module.
*/
async function sendPasswordRecoveryEmail(emailInfo){
  return await sendOneEmail(emailInfo, email_generator.passwordRecoveryEmail);
}

/**
 * Send a single reminder to patient.
 *
 * @param {JSON} emailInfo -  {
 *                              patient:
 *                              test:
 *                              hospital:
 *                              carer:
 *                            }
 * @returns {boolean} True if email was successfully sent, false if something went wrong.
 */
async function sendReminderToPatient(emailInfo) {
  return await sendOneEmail(emailInfo, email_generator.testReminderForPatient);
}

/**
 * Send a single reminder to hospital.
 *
 * @param {JSON} emailInfo -  {
 *                              patient:
 *                              test:
 *                              hospital:
 *                              carer:
 *                            }
 * @returns {boolean} True if email was successfully sent, false if something went wrong.
 */
async function sendReminderToHospital(emailInfo) {
  return await sendOneEmail(emailInfo, email_generator.testReminderForHospital);
}

/**
 * Send a single reminder to patient.
 *
 * @param {JSON} emailInfo -  {
 *                              patient:
 *                              test:
 *                              hospital:
 *                              carer:
 *                            }
 * @returns {boolean} True if email was successfully sent, false if something went wrong.
 */
async function sendOverdueReminderToPatient(emailInfo) {
  return await sendOneEmail(
    emailInfo,
    email_generator.overdueTestReminderForPatient
  );
}

/**
 * Send a single reminder to hospital.
 *
 * @param {JSON} emailInfo -  {
 *                              patient:
 *                              test:
 *                              hospital:
 *                              carer:
 *                            }
 * @returns {boolean} True if email was successfully sent, false if something went wrong.
 */
async function sendOverdueReminderToHospital(emailInfo) {
  return await sendOneEmail(
    emailInfo,
    email_generator.overdueTestReminderForHospital
  );
}

/*
|--------------------------------------------------------------------------
| EMAIL GENERATING AND SENDING FUNCTIONS SECTION
|--------------------------------------------------------------------------
| This section contains the functions which send emails and handle
| email creation.
*/

/**
 * Generate and send a single email.
 *
 * @param {JSON} emailInfo -  {
 *                              patient:
 *                              test:
 *                              hospital:
 *                              carer:
 *                            }
 * @param {function} emailGeneratorFunction Function that generates the email from emailInfo.
 * @returns {boolean} True if email was successfully sent, false if something went wrong.
 */
async function sendOneEmail(emailInfo, emailGeneratorFunction) {
  const transporter = nodeMailer.createTransport(email_config.transporter);

  const generated = await emailGeneratorFunction(emailInfo, email_config);
  if (generated == null) {
    return false;
  }

  const receiverOptions = {
    from: transporter.options.auth.user,
    to: generated.to,
    subject: generated.subjectTitle,
    html: generated.html
  };

  if (receiverOptions.to != undefined && receiverOptions.to != null) {
    const res = await sendEmail(transporter, receiverOptions);
    if (res) return true;
  }
  return false;
}

/**
 * Send a single email based on the options
 * @param {transporter} transporter the transporter from which emails are being sent
 * @param {JSON} receiverOptions the options of the email address to be sent, as well as the content of the mail
 */
async function sendEmail(transporter, receiverOptions) {
  let successful = false;
  let finished = false;
  await transporter.sendMail(receiverOptions, (err, info) => {
    if (err) {
      console.log(err);
      successful = false;
    } else {
      console.log("Email sent successfully");
      transporter.close();
      successful = true;
    }
    finished = true;
  });
  while (!finished) {
    await sleep(1);
  }
  return successful;
}

/**
 * Await for this function to pause execution for a certain time.
 *
 * @param {number} ms Time in milliseconds
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
