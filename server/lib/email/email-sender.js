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
  return sendEmails(
    testIDs,
    email_generator.testReminderForPatient,
    "Reminder for your test"
  );
}

/**
 * Send tests reminders to hospitals.
 * The reminder is in the form of an email, one is sent for each test corresponding
 * to a testID in the testIDs array
 * @param {array} testIDs the IDs of the tests to be sent
 */
function sendReminderEmailToHospital(testIDs) {
  return sendEmails(
    testIDs,
    email_generator.testReminderForHospital,
    "Reminder for a test"
  );
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
  await sendOneEmail(
    emailInfo,
    failed,
    email_generator.overdueTestReminderForPatient,
    "Reminder for your overdue test"
  );
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
  await sendEmails(
    emailInfo,
    failed,
    email_generator.overdueTestReminderForHospital,
    "Reminder for an overdue test"
  );
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
        failed.push(testID), completed++;
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
          console.error(
            "Could not generate reminder to hospital email for testID: " +
              failedTestID
          );
        });
      }
    }
  } else {
    console.error("The testIDs object is not an array");
  }
  return failed;
}

/**
 * Send a single email.
 * @param {JSON} emailInfo the information following the format required by the email-generator module documentation and return a valid JSON object with the right formatting
 * @param {array} failed an array which contains the test ids of emails for which the html generation failed
 * @param {function} emailGeneratorFunction the function needed to generate test emails
 * @param {string} subjectTitle  the subject title of the email
 */
async function sendOneEmail(
  emailInfo,
  failed,
  emailGeneratorFunction,
  subjectTitle
) {
  {
    const config = jsonController.getJSON(CONFIG_ABSOLUTE_PATH);
    const transporter = nodeMailer.createTransport(config.transporter);
    console.log(transporter);
    let to = emailInfo.patient.patient_email;
    if (to == null) {
      to = emailInfo.carer.carer_email;
    }

    const receiverOptions = {
      from: transporter.options.auth.user,
      to: emailGeneratorFunction(emailInfo).to,
      subject: subjectTitle,
      html: emailGeneratorFunction(emailInfo).html
    };

    if (
      receiverOptions.html != null &&
      emailInfo != null &&
      subjectTitle != null
    )
      sendEmail(transporter, receiverOptions);
    else failed.push(emailInfo.test.test_id);
  }
}

/**
 * Aggregate the information following the format required by the email-generator module documentation and return a valid JSON object with the right formatting
 * @param {number} testID the id of the test for which to generate the email
 * @param {array} failed an array which contains the test ids of emails for which the html generation failed
 * @returns {JSON} the information following the format required by the email-generator module documentation and return a valid JSON object with the right formatting
 */
async function getEmailInfo(testID, failed) {
  //Get the test information from the database
  let test = null;
  await query_controller.getTest(testID).then(r => {
    test = processResult(r, failed, testID);
  });
  if (test === undefined || !test) return null; //no need to continue executing the function, since the call failed

  //Get the patient who has to take the test
  let patient = null;
  await query_controller.getPatient(test.patient_no).then(r => {
    patient = processResult(r, failed, testID);
  });
  if (patient === undefined || !patient) return null; //no need to continue executing the function, since the call failed

  //Get the hospital connected to the patient
  let hospital = null;
  await query_controller.getHospital(patient.hospital_id).then(r => {
    hospital = processResult(r, failed, testID);
  });
  if (hospital === undefined || !hospital) return null; //no need to continue executing the function, since the call failed

  const emailInfo = {
    patient: patient,
    test: test,
    hospital: hospital
  };

  //in case the patient does not have an email, we try and fetch the carer's information
  if (patient.patient_email == null) {
    let carer = null;
    await query_controller.getCarer(patient.carer_id).then(r => {
      carer = processResult(r, failed, testID);
    });

    if (carer === undefined || !carer) return null;
    emailInfo.carer = carer;
  }

  return emailInfo;
}

/**
 * Process the result of a query and check if it is a valid one.
 * @param {JSON} r the result of a query
 * @param {array} failed an array which contains the test ids of emails for which the html generation failed
 * @param {number} testID the id of the test for which to generate the email
 * @returns {JSON} result the final result to be modified if it is valid, if not, it is set as undefined
 */
function processResult(r, failed, testID) {
  let result = undefined;
  try {
    result = r.response[0];
    if (result === undefined || r.response.length === 0) {
      throw "The testID doesn't exist";
    } //it will fail if response is undefined
  } catch (err) {
    failed.push(testID);
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
      console.log("Email sent successfully");
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
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
