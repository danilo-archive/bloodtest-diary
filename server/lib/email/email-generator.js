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
    overdueTestReminderForHospital
};

const dateformat = require('dateformat');
const mjml2html = require("mjml");
const jsonParser = require('./../json-parser');
const email_config = jsonParser(__dirname + '/../../config/email_config.json');

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
function overdueTestReminderForHospital(email_info) {
    const greeting = "Dear colleagues,";
    const computed_html = mjml2html(generateBody(email_info, email_config.content.overdueHospital, greeting, true));

    let subject = email_config.overdueHospital.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if (email_config.overdueHospital.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.hospital.hospital_email,
            html: computed_html.html,
            subjectTitle: subject
        };
    return null;
}

/**
 * Return html for an email containing info about a test which is overdue for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function overdueTestReminderForPatient(email_info) {
    if (email_info.patient.patient_email == null) {
        return overdueTestReminderForCarer(email_info);
    }
    const greeting = "Dear " + email_info.patient.patient_name + " " + email_info.patient.patient_surname + ",";
    const computed_html = mjml2html(generateBody(email_info, email_config.content.overduePatient, greeting, true));

    let subject = email_config.overduePatient.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if (email_config.overduePatient.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.patient.patient_email,
            html: computed_html.html,
            subjectTitle: subject
        };
    return null;
}

/**
 * Return html for an email containing info about a test which is overdue for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function overdueTestReminderForCarer(email_info) {
    let greeting = "Dear";
    if (email_info.carer.carer_name != null) {
        greeting += " " + email_info.carer.carer_name;
    }
    if (email_info.carer.carer_surname != null) {
        greeting += " " + email_info.carer.carer_surname;
    }
    greeting += ",";
    const computed_html = mjml2html(generateBody(email_info, email_config.content.overdueCarer, greeting, true));

    let subject = email_config.overdueCarer.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if (email_config.overdueCarer.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.carer.carer_email,
            html: computed_html.html,
            subjectTitle: subject
        };
    return null;
}

/**
 * Return html for an email containing info about a test which is due for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function testReminderForPatient(email_info) {
    if (email_info.patient.patient_email == null) {
        return testReminderForCarer(email_info);
    }
    const greeting = "Dear " + email_info.patient.patient_name + " " + email_info.patient.patient_surname + ",";
    const computed_html = mjml2html(generateBody(email_info, email_config.content.generalPatient, greeting, false));

    let subject = email_config.generalPatient.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if (email_config.generalPatient.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.patient.patient_email,
            html: computed_html.html,
            subjectTitle: subject
        };
    return null;
}

/**
 * Generate an email aimed at hospitals which reminds of a blood test due for a patient of theirs
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
*/
function testReminderForHospital(email_info) {
    const greeting = "Dear colleagues,";
    const computed_html = mjml2html(generateBody(email_info, email_config.content.generalHospital, greeting, false));
    
    let subject = email_config.generalHospital.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if (email_config.generalHospital.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.hospital.hospital_email,
            html: computed_html.html,
            subjectTitle: subject
        };
    return null;
}

/**
 * Generate an email aimed at carers which reminds of a blood test due for a patient
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
*/
function testReminderForCarer(email_info) {
    let greeting = "Dear";
    if (email_info.carer.carer_name != null) {
        greeting += " " + email_info.carer.carer_name;
    }
    if (email_info.carer.carer_surname != null) {
        greeting += " " + email_info.carer.carer_surname;
    }
    greeting += ",";
    const computed_html = mjml2html(generateBody(email_info, email_config.content.generalCarer, greeting, false));
    
    let subject = email_config.generalCarer.subject.title;
    const due_date = beautifyDate(email_info.test.due_date);
    if (email_config.generalCarer.subject.appendDate) {
        subject += (subject.endsWith(" ")) ? due_date : " " + due_date; 
    }
    if (computed_html.errors.length === 0)
        return {
            to: email_info.carer.carer_email,
            html: computed_html.html,
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
function generateBody(emailInfo, contentConfiguration, greeting, isOverdue) {
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
            <p>${greeting}</p><br>
            <p>${main}</p><br><br>
    `;

    let rows = "";
    if (contentConfiguration.details.includePatientNo) {
        rows += `<tr>
                    <td style="padding: 0 15px 0 0;">Patient number:</td>
                    <td style="padding: 0 15px;">${patient.patient_no}</td>
                </tr>`;
    }
    if (contentConfiguration.details.includePatientName) {
        rows += `<tr>
                    <td style="padding: 0 15px 0 0;">Full name:</td>
                    <td style="padding: 0 15px;">${patient.patient_name} ${patient.patient_surname}</td>
                </tr>`;
    }
    if (contentConfiguration.details.includePatientContact) {
        rows += `<tr>
                    <td style="padding: 0 15px 0 0;">Email:</td>
                    <td style="padding: 0 15px;">${patient.patient_email}</td>
                </tr>`;
        if (patient.patient_phone !== null) {
            rows += `<tr>
                        <td style="padding: 0 15px 0 0;">Phone number:</td>
                        <td style="padding: 0 15px;">${patient.patient_phone}</td>
                    </tr>`;
        }
    }

    if (rows.length > 0) {
        const tableHeader = `
        <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 0 0;">Patient Information</th>
            </tr>
            </tr>`;

        html += tableHeader + rows + "</mj-table><br>";
    }

    if (contentConfiguration.details.includeDueDate) {
        const test_date = beautifyDate(emailInfo.test.due_date);
        if (isOverdue) {
            html += `
            <p><b>This test was due on ${test_date}.<b></p>
            `;
        }
        else {
            html += `
            <p><b>This test is due on ${test_date}.<b></p>
            `;
        }
    }
    html += `<br></mj-text>
            </mj-column>
        </mj-section>
        ${getFooter()}
    </mj-body>
    </mjml> `;
    return html;
}

/**
 * Get mjml code for image at the top of emails
 * @return {string} mjml code for image at the top of emails
 */
function getLogo() {
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
function getFooter() {
    return `<br><br>
        ${getLogo()}<br>
        <p>
        ${email_config.content.common.footer}
        <p>
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
