/**
* The functions exported from this module generate different types of emails depending on their purpose.
They all need information contained in the "email_info" JSON objects.
* @example <caption>The email_info JSON needs to reflect this format in order to be properly parsed:</caption>
{
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
    "due_date": date_obj,  //a date object
    "frequency": "4-W",
    "occurrences": 9,
    "completed_status": "yes",
    "completed_date": date_obj, //a date object
    "notes": null
  },
  "hospital": {
    "hospital_id": 551,
    "hospital_name": "Gotham City Hospital",
    "hospital_email": "hospital@gotham.com",
    "hospital_phone": null
  }
  "user":{
    "username": "admin"
    "new_password": "newpassword123"
    "recovery_email": "admin@admin.com"
  }
}
* @module email-generator
 * @author Danilo Del Busso, Luka Kralj
 * @version 0.0.2
 */


/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
  testReminderForPatient,
  testReminderForHospital,
  overdueTestReminderForPatient,
  overdueTestReminderForHospital,
  passwordRecoveryEmail
};

const dateformat = require('dateformat');
const mjml2html = require("mjml");

/*
|--------------------------------------------------------------------------
| EMAIL GENERATION FUNCTIONS
|--------------------------------------------------------------------------
| This section contains the functions which generate html code for different kinds of email
|
*/

/**
 * Return html for an email containing info about a test which is overdue for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
async function overdueTestReminderForHospital(email_info,email_config) {
    const greeting = "Dear colleagues,";
    const computed_html = mjml2html(await generateReminderBody(email_info, email_config.content.overdueHospital, greeting, true, email_config));

    let subject =  email_config.content.overdueHospital.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if ( email_config.content.overdueHospital.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.hospital.hospital_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    return null;
}

/**
 * Return html for an email containing info about a test which is overdue for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
async function overdueTestReminderForPatient(email_info, email_config) {
    if (email_info.patient.patient_email == null || email_info.patient.patient_email.length === 0) {
        return await overdueTestReminderForCarer(email_info, email_config);
    }
    const greeting = "Dear " + email_info.patient.patient_name + " " + email_info.patient.patient_surname + ",";
    const computed_html = mjml2html(await generateReminderBody(email_info, email_config.content.overduePatient, greeting, true, email_config));

    let subject =  email_config.content.overduePatient.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if ( email_config.content.overduePatient.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0) {
        return {
            to: email_info.patient.patient_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    }

        
    return null;
}

/**
 * Return html for an email containing info about a test which is overdue for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
async function overdueTestReminderForCarer(email_info, email_config) {
    if (email_config.carer == null) {
        return null;
    }
    let greeting = "Dear";
    if (email_info.carer.carer_name != null && email_info.carer.carer_name.length !== 0) {
        greeting += " " + email_info.carer.carer_name;
    }
    if (email_info.carer.carer_surname != null && email_info.carer.carer_surname.length !== 0) {
        greeting += " " + email_info.carer.carer_surname;
    }
    greeting += ",";
    const computed_html = mjml2html(await generateReminderBody(email_info, email_config.content.overdueCarer, greeting, true, email_config));

    let subject =  email_config.content.overdueCarer.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if ( email_config.content.overdueCarer.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.carer.carer_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    return null;
}

/**
 * Return html for an email containing info about a new password which is generated for a User.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
async function passwordRecoveryEmail(email_info, email_config) {
  const subject =  email_config.content.recoveryEmail.subject;
  const newPassword = email_info.user.new_password;
  const computed_html = mjml2html(await generateRecoveryEmailBody(newPassword, email_config.content.recoveryEmail));
  

  if (computed_html.errors.length === 0)
        return {
            to: email_info.user.recovery_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    return null;
}

/**
 * Return html for an email containing info about a test which is due for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
async function testReminderForPatient(email_info, email_config) {
    if (email_info.patient.patient_email == null || email_info.patient.patient_email.length === 0) {
        return await testReminderForCarer(email_info);
    }
    const greeting = "Dear " + email_info.patient.patient_name + " " + email_info.patient.patient_surname + ",";
    const computed_html = mjml2html(await generateReminderBody(email_info, email_config.content.generalPatient, greeting, false, email_config));

    let subject =  email_config.content.generalPatient.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if ( email_config.content.generalPatient.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.patient.patient_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    return null;
}

/**
 * Generate an email aimed at hospitals which reminds of a blood test due for a patient of theirs
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
*/
async function testReminderForHospital(email_info, email_config) {
    const greeting = "Dear colleagues,";
    const computed_html = mjml2html(await generateReminderBody(email_info, email_config.content.generalHospital, greeting, false, email_config));
    
    let subject =  email_config.content.generalHospital.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if ( email_config.content.generalHospital.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.hospital.hospital_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    return null;
}

/**
 * Generate an email aimed at carers which reminds of a blood test due for a patient
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
*/
async function testReminderForCarer(email_info, email_config) {
    if (email_config.carer == null) {
        return null;
    }
    let greeting = "Dear";
    if (email_info.carer.carer_name != null && email_info.carer.carer_name.length !== 0) {
        greeting += " " + email_info.carer.carer_name;
    }
    if (email_info.carer.carer_surname != null && email_info.carer.carer_surname.length !== 0) {
        greeting += " " + email_info.carer.carer_surname;
    }
    greeting += ",";
    const computed_html = mjml2html(await generateReminderBody(email_info, email_config.content.generalCarer, greeting, false, email_config));
    
    let subject =  email_config.content.generalCarer.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if ( email_config.content.generalCarer.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.carer.carer_email,
            html:  (computed_html.html + "<br>" + getFooter(email_config)).replace(/--br--/g, "<br>"),
            subjectTitle: subject
        };
    return null;
}

/*
|--------------------------------------------------------------------------
| COMMON EMAIL ELEMENTS
|--------------------------------------------------------------------------
| This section contains the functions which generate mjml code for common elements in
| the emails
|
*/

/**
 * Generates the body of the email according to the content configuration.
 *
 * @param {JSON} contentConfiguration - format: {
            "subject": {
                "title": "",
                "appendDate": true|false
            },
            "mainBody": "",
            "details": {
                "includePatientNo": true|false,
                "includePatientName": true|false,
                "includePatientContact": true|false,
                "includeDueDate": true|false
            }
        },
 */
async function generateReminderBody(emailInfo, contentConfiguration, greeting, isOverdue) {
    const patient = emailInfo.patient;
    const main = contentConfiguration.mainBody;
    let html = `
    <mjml>
       ${getHead("Blood Test Reminder")}
       <mj-body>
          <mj-section>
             <mj-column width="45%">
                <mj-text align="center" font-weight="500" padding="0px" font-size="18px">BLOOD TEST REMINDER</mj-text>
                <mj-divider border-width="2px" border-color="#616161" />
                <mj-divider border-width="2px" border-color="#616161" width="45%" />
             </mj-column>
          </mj-section>
          <mj-section padding-top="30px">
          <mj-column width="100%">
          <mj-text>
              ${greeting} --br----br--
              ${main} --br----br--
    `;

    let rows = "";
    if (contentConfiguration.details.includePatientNo) {
        rows += `<i>Patient number:    </i>
                ${patient.patient_no}--br--`;
    }
    if (contentConfiguration.details.includePatientName) {
        rows += `<i>Full name:    </i>
                ${patient.patient_name} ${patient.patient_surname}--br--`;
    }
    if (contentConfiguration.details.includePatientContact) {
        if (patient.patient_email !== null && patient.patient_email.length !== 0) {
            rows += `<i>Email:    </i>
                ${patient.patient_email}--br--`;
        }
        if (patient.patient_phone !== null && patient.patient_phone.length !== 0) {
            rows += `<i>Phone number:    </i>
                ${patient.patient_phone}--br--`;
        }
    }

    if (rows.length > 0) {
        const tableHeader = `
        <b>Patient details:</b>--br----br--`;

        html += tableHeader + rows + "--br--";
    }

    if (contentConfiguration.details.includeDueDate) {
        const test_date = beautifyDate(emailInfo.test.due_date);
        if (isOverdue) {
            html += `
              <b>This test was due on ${test_date}.<b> 
            `;
        }
        else {
            html += `
              <b>This test is due on ${test_date}.<b> 
            `;
        }
    }
    html += `--br--</mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
    </mjml>`;
    return html;
}

/**
 * Generates the body of the email according to the content configuration.
 *
 * @param {JSON} contentConfiguration - format: {
            "subject": "",
            "mainBody": "",
        },
 */
async function generateRecoveryEmailBody(newPassword, contentConfiguration) {
  const main = contentConfiguration.mainBody;
  let html = `
  <mjml>
     ${getHead("Password recovery")}
     <mj-body>
        <mj-section>
           <mj-column width="45%">
              <mj-text align="center" font-weight="500" padding="0px" font-size="18px">Password recovery email</mj-text>
              <mj-divider border-width="2px" border-color="#616161" />
              <mj-divider border-width="2px" border-color="#616161" width="45%" />
           </mj-column>
        </mj-section>
        <mj-section padding-top="30px">
        <mj-column width="100%">
        <mj-text>
            Dear user, --br----br--
            ${main} --br----br--
            <b>New password:    </b>${newPassword}--br--
  `;

  html += `--br--</mj-text>
          </mj-column>
      </mj-section>
  </mj-body>
  </mjml>`;
  return html;
}

/**
 * Get mjml code for image at the top of emails
 * @return {string} mjml code for image at the top of emails
 */
function getLogo(email_config) {
    const header_image_url = email_config.content.common.logo;
    if (header_image_url == null) {
        return "";
    }
    return `
        <mj-section>
        <mj-column width="30%">
            <mj-image src="${header_image_url}" />
        </mj-column>
        </mj-section>
        `;
}

/**
 * Get mjml code describing common head of emails
 * @param {title} the title of the html document
 * @return {string} mjml code describing common head of emails
 */
function getHead(title) {
    return `
    <mj-head>
       <mj-title>${title}</mj-title>
       <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,500" />
       <mj-attributes>
          <mj-all font-family="Roboto, Helvetica, sans-serif" />
          <mj-text font-weight="300" font-size="16px" color="#616161" line-height="24px" />
          <mj-section padding="0px" />
       </mj-attributes>
    </mj-head>
    `;
}

/**
 * Get mjml code describing common footer of emails
 * @return {string} mjml code describing common footer of emails
 */
function getFooter(email_config) {
    return `--br--
        ${getLogo(email_config)}--br--
          
        ${email_config.content.common.footer}
          
    `;
}

/*
|--------------------------------------------------------------------------
| HELPER FUNCTIONS
|--------------------------------------------------------------------------
*/
/**
 * Beautify a date object as a readable string of "1st October 2020" format
 * @param {date} date the date object to be beautified
 * @returns {string} the beautified date
 */
function beautifyDate(date) {
    return dateformat(date, "dS mmmm yyyy")
}
