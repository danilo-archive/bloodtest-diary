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
 * @author Danilo Del Busso, Jacopo Madaluni
 * @version 0.0.3
 */

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
  sendEmails,
  //getEmailInfo,
  sendReminderEmailToPatient,
  sendReminderEmailToHospital,
  //sendOverdueTestReminderToPatient,
  //sendOverdueTestReminderToHospital,
  sendOneOverdueTestReminderToPatient,
  sendOneOverdueTestReminderToHospital
};


const email_generator = require("./email-generator");
const nodeMailer = require("nodemailer");
const jsonController = require("../json-controller");
const CONFIG_ABSOLUTE_PATH = __dirname + "/../../config/email_config.json"; //the absolute path of the email_config.json file


/*
|--------------------------------------------------------------------------
| MAIN EMAIL SENDING FUNCTIONS
|--------------------------------------------------------------------------
| This section contains the functions which can be called externally to send emails,
| these functions do not directly handle data and generate emails. They are written to simplify
| usage of the module.
*/

/**
* Send tests reminders to patients.
 * The reminder is in the form of an email, one is sent for each test corresponding
 * to a testID in the testIDs array
 * @param {array} testIDs the IDs of the tests to be sent
 */
function sendReminderEmailToPatient(testIDs) {
  return sendEmails(testIDs, email_generator.testReminderForPatient, "Reminder for your test");
}

/**
 * Send tests reminders to hospitals.
 * The reminder is in the form of an email, one is sent for each test corresponding
 * to a testID in the testIDs array
 * @param {array} testIDs the IDs of the tests to be sent
 */
function sendReminderEmailToHospital(testIDs) {
  return sendEmails(testIDs, email_generator.testReminderForHospital, "Reminder for a test");
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
 */
async function sendOneOverdueTestReminderToPatient(emailInfo) {
  const failed = [];
  await sendOneEmail(emailInfo, failed, email_generator.overdueTestReminderForPatient, "Reminder for your overdue test");
  return failed;
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
 */
async function sendOneOverdueTestReminderToHospital(emailInfo) {
  const failed = [];
  await sendEmails(emailInfo, failed, email_generator.overdueTestReminderForHospital, "Reminder for an overdue test");
  return failed;
}

/*
|--------------------------------------------------------------------------
| EMAIL GENERATING AND SENDING FUNCTIONS SECTION
|--------------------------------------------------------------------------
| This section contains the functions which send emails and handle
| email creation, as well as fetch the necessary data
*/

/**
 * Send one email for every test. The content of the email will depend on the email generator function
 * @param {array} testIDs the IDs of the tests to be sent
 * @param {string} subjectTitle the subject title of the email
 * @param {function} emailGeneratorFunction the function needed to generate test emails
 * @returns {array} an array which contains the test ids of emails for which the html generation failed
 */
async function sendEmails(testIDs, emailGeneratorFunction, subjectTitle) {
  const failed = []; //array will contain the test ids of emails for which the html generation failed
  if (Array.isArray(testIDs)) {
    if (testIDs.length === 0) {
      console.error("The TestIDs array is empty, could not send any mail");
    } else {
      let completed = 0;
      testIDs.forEach(async testID => {
        failed.push(testID),
        completed++;
        // TODO: fix this mess
        /*let emailInfo = null;
        await getEmailInfo(testID, failed).then(result => {
          emailInfo = result;
          completed++;
        });

        //fetch the relevant data linked to the test for the email generation
        if (emailInfo !== null) {
          sendOneEmail(emailInfo, failed, emailGeneratorFunction, subjectTitle);
        }
        else {
          console.error("Could not generate emailInfo JSON")
        }*/

      });

      while (completed != testIDs.length) {
        //awaiting for all testIDs to be checked before sending error messages
        await sleep(1);
      }

      //for every failed email, log an error to the console
      if (failed.length !== 0) {
        failed.forEach(failedTestID => {
          console.error("Could not generate reminder to hospital email for testID: " + failedTestID);
        });
      }
    }
  } else {
    console.error("The testIDs object is not an array")
  }
  return failed;
}

/**
 * Generate and send a single email
 * @param {number} testID the id of the test for which to generate the email
 * @param {array} failed an array which contains the test ids of emails for which the html generation failed
 */
async function sendOneEmail(emailInfo, failed, emailGeneratorFunction, subjectTitle) {
  {
    const config = jsonController.getJSON(CONFIG_ABSOLUTE_PATH);
    const transporter = nodeMailer.createTransport(config.transporter);
    console.log(transporter);
    let to =  emailInfo.patient.patient_email;
    if(to == null){
      to = emailInfo.carer.carer_email;
    }

    const receiverOptions = {
      from: transporter.options.auth.user,
      to:  emailGeneratorFunction(emailInfo).to,
      subject: subjectTitle,
      html: emailGeneratorFunction(emailInfo).html
    };

    if (receiverOptions.html != null && emailInfo != null && subjectTitle != null) {
      const res = await sendEmail(transporter, receiverOptions);
      if (res) return;
    } 
      
    failed.push(emailInfo.test.test_id);
  }
}

/**
 * Send a single email based on the options
 * @param {transporter} transporter the transporter from which emails are being sent
 * @param {JSON} receiverOptions the options of the email address to be sent, as well as the content of the mail
 */
async function sendEmail(transporter, receiverOptions) {
  let successful = false;
  await transporter.sendMail(receiverOptions, (err, info) => {
    if (err) {
      console.log(err);
      successful = false;
    } else {
      console.log("Email sent successfully")
      console.log(info);
      transporter.close();
      successful = true;
    }
  });
  return successful;
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
