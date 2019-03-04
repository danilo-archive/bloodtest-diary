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
 * @author Danilo Del Busso, Jacopo Madaluni
 * @version 0.0.3
 */

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
  sendReminderEmailToPatient,
  sendReminderEmailToHospital,
  sendOverdueTestReminderToPatient,
  sendOverdueTestReminderToHospital
};


const email_generator = require("./email-generator");
const nodeMailer = require("nodemailer");
const jsonController = require("../json-controller");
const CONFIG_ABSOLUTE_PATH = __dirname + "/../../config/email_config.json"; //the absolute path of the email_config.json file
const query_controller = require("../query-controller");


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
  sendEmails(testIDs, email_generator.testReminderForPatient, "Reminder for your test");
}

/**
 * Send tests reminders to hospitals.
 * The reminder is in the form of an email, one is sent for each test corresponding 
 * to a testID in the testIDs array
 * @param {array} testIDs the IDs of the tests to be sent 
 */
function sendReminderEmailToHospital(testIDs) {
  sendEmails(testIDs, email_generator.testReminderForHospital, "Reminder for a test");
}

/**
 * Send overdue tests reminders to patients.
 * The reminder is in the form of an email, one is sent for each test corresponding 
 * to a testID in the testIDs array
 * @param {array} testIDs the IDs of the tests to be sent 
 */
function sendOverdueTestReminderToPatient(testIDs) {
  sendEmails(testIDs, email_generator.overdueTestReminderForPatient, "Reminder for your overdue test")
}
/**
 * Send overdue tests reminders to hospitals.
 * The reminder is in the form of an email, one is sent for each test corresponding 
 * to a testID in the testIDs array
 * @param {array} testIDs the IDs of the tests to be sent 
 */
function sendOverdueTestReminderToHospital(testIDs) {
  sendEmails(testIDs, email_generator.overdueTestReminderForHospital, "Reminder for an overdue test")
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
function sendEmails(testIDs, emailGeneratorFunction, subjectTitle) {
  if (Array.isArray(testIDs)) {
    const failed = []; //array will contain the test ids of emails for which the html generation failed
    testIDs.forEach(async testID => {
      let emailInfo = null;
      await getEmailInfo(testID, failed).then(result => {
        emailInfo = result;
      }); //fetch the relevant data linked to the test for the email generation
      if (emailInfo !== null) {
        sendEmail(emailInfo, failed, emailGeneratorFunction, subjectTitle);
      }
      else{
        console.error("Could not generate emailInfo JSON")
      }
    });
    //for every failed email, log an error to the console
    if (failed.length !== 0) {
      failed.forEach(failedTestID => {
        console.error("Could not generate reminder to hospital email for testID: " + failedTestID);
      });
    }
  } else {
    console.error("The testIDs object is not an array")
  }
}


/**
 * Generate and send a single email
 * @param {number} testID the id of the test for which to generate the email
 * @param {array} failed an array which contains the test ids of emails for which the html generation failed
 */
function sendEmail(emailInfo, failed, emailGeneratorFunction, subjectTitle) {
  {
    const config = jsonController.getJSON(CONFIG_ABSOLUTE_PATH);
    const transporter = nodeMailer.createTransport(config.transporter);

    //TODO: REMOVE HARD-CODED OPTIONS BEFORE DEPLOYMENT
    const receiverOptions = {
      from: transporter.options.auth.user,
      to: emailInfo.patient.patient_email,
      subject: subjectTitle,
      html: emailGeneratorFunction(emailInfo)
    };
    if (receiverOptions.html != null)
      sendEmail(transporter, receiverOptions);
    else
      failed.push(testID);
  }
}

/**
 * Aggregate the information following the format required by the email-generator module documentation and return a valid JSON object with the right formatting 
 * @param {number} testID the id of the test for which to generate the email
 * @param {array} failed 
 */
async function getEmailInfo(testID, failed) {
  //Get the test information from the database
  let test = null;
  await query_controller.getTest(testID).then(r => {
    try {
      test = r.response[0];
      if (test === undefined) {
        throw "The testID doesn't exist"
      }//it will fail if response is undefined
    }
    catch{
      failed.push(testID);
      return; //no need to continue executing the function, since the call failed
    }
  });
  //Get the patient who has to take the test
  let patient = null;
  await query_controller.getPatient(test.patient_no).then(r => {
    try {
      patient = r.response[0];
      if (patient === undefined) {
        throw "The patient_no doesn't exist"
      }//it will fail if response is undefined
    }
    catch{
      failed.push(testID);
      return; //no need to continue executing the function, since the call failed
    }
  });
  //Get the hospital connected to the patient
  let hospital = null;
  await query_controller.getHospital(patient.hospital_id).then(r => {
    try {
      hospital = r.response[0];
      if (hospital === undefined) {
        throw "The hospital_id doesn't exist"
      }//it will fail if response is undefined
    }
    catch{
      failed.push(testID);
      return; //no need to continue executing the function, since the call failed
    }
  });

  let emailInfo = {
    patient: patient,
    test: test,
    hospital: hospital
  };


  //in case the patient does not have an email, we try and fetch the carer's information
  if (patient.patient_email == null) {
    let carer = null;
    await query_controller.getCarer(patient.carer_id).then(r => {
      try {
        carer = r.response[0];
        if (carer === undefined) {
          throw "The carer_id doesn't exist"
        }//it will fail if response is undefined
      }
      catch{
        failed.push(testID);
        return; //no need to continue executing the function, since the call failed
      }
    });
    emailInfo.carer = carer;
  }
  return emailInfo;
}

/**
 * Send a single email based on the options
 * @param {transporter} transporter the transporter from which emails are being sent
 * @param {JSON} receiverOptions the options of the email address to be sent, as well as the content of the mail
 */
function sendEmail(transporter, receiverOptions) {
  //TODO: TEST THIS FOR GOD'S SAKE
  transporter.sendMail(receiverOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
      transporter.close();
    }
  });
}
