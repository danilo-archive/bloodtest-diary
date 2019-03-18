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
 * @author Danilo Del Busso
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
    const header_image_url =
        "https://images.unsplash.com/photo-1528872042734-8f50f9d3c59b";

    const test_date = beautifyDate(email_info.test.due_date);
    const patient = email_info.patient;
    const computed_html = mjml2html(`
    <mjml>
        ${getHead("Reminder For Overdue Patient Test")}
        <mj-body>
            ${getTopImage(header_image_url)}
            <mj-section>
            <mj-column width="45%">
                <mj-text align="center" font-weight="500" padding="0px" font-size="18px">A BLOOD TEST IS OVERDUE</mj-text>
                <mj-divider border-width="2px" border-color="#616161" />
                <mj-divider border-width="2px" border-color="#616161" width="45%" />
            </mj-column>
            </mj-section>
            <mj-section padding-top="30px">
            <mj-column width="100%">
            <mj-text>
            <p>${patient.patient_name} had a test due on ${test_date}.</p>
            <p>You will find the relevant information regarding this test underneath:</p>
            <mj-table>
                <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;">Patient Information</th>
                </tr>
                </tr>
                <tr>
                <td style="padding: 0 15px 0 0;">Full Name</td>
                <td style="padding: 0 15px;white-space:nowrap;">${patient.patient_name} ${patient.patient_surname}</td>
                </tr>
                <tr>
                <td style="padding: 0 15px 0 0;">Patient Number</td>
                <td style="padding: 0 15px;">${patient.patient_no}</td>
                </tr>
                <tr>
                <td style="padding: 0 15px 0 0;">Email Address</td>
                <td style="padding: 0 15px;">${patient.patient_email}</td>
                </tr>
                <tr>
                <td style="padding: 0 15px 0 0;">Phone Number</td>
                <td style="padding: 0 15px;">${patient.patient_phone}</td>
                </tr>
            </mj-table>
            </mj-text>
        </mj-column>
            </mj-section>
        </mj-body>
        ${getFooter()}

    </mjml>    
    `);

    if (computed_html.errors.length === 0) {
        return {
            to: email_info.hospital.hospital_email,
            html: computed_html.html,
            subjectTitle: "Reminder for an overdue test"
        };
    }

    return null;
}

/**
 * Return html for an email containing info about a test which is overdue for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function overdueTestReminderForPatient(email_info) {
    const header_image_url =
        "https://images.unsplash.com/photo-1528872042734-8f50f9d3c59b";

    const test_date = beautifyDate(new Date(email_info.test.due_date));
    const hospital_name = email_info.hospital.hospital_name;
    const patient_full_name = `${email_info.patient.patient_name} ${
        email_info.patient.patient_surname
        }`;
    const computed_html = mjml2html(`
    <mjml>
        ${getHead("Reminder For Overdue Test")}
        <mj-body>
            ${getTopImage(header_image_url)}
            <mj-section>
                <mj-column width="45%">
                    <mj-text align="center" font-weight="500" padding="0px" font-size="18px">YOUR BLOOD TEST IS OVERDUE</mj-text>
                    <mj-divider border-width="2px" border-color="#616161" />
                    <mj-divider border-width="2px" border-color="#616161" width="45%" />
                </mj-column>
            </mj-section>
            <mj-section padding-top="30px">
                <mj-column width="100%">
                    <mj-text>
                    <p>Hello ${patient_full_name}.</p>
                    <p>This is a reminder for your blood test</p>
                    <p>The test was due on ${test_date}</p>
                    <p>The test had to be taken at ${hospital_name}</p>
                    <p>Please contact the hospital if a new test has not been arranged yet.</p>
                    </mj-text>
                </mj-column>
            </mj-section>
        </mj-body>
        ${getFooter()}
        </mjml>   
    `);

    if (computed_html.errors.length === 0) {
        let email = email_info.patient.patient_email;
        if (email == null) {
            email = email_info.carer.carer_email;
        }
        return {
            to: email,
            html: computed_html.html,
            subjectTitle: "Reminder for your overdue test"
        };
    }
    return null;
}

/**
 * Return html for an email containing info about a test which is due for a patient.
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function testReminderForPatient(email_info) {
    const header_image_url =
        "https://images.unsplash.com/photo-1528872042734-8f50f9d3c59b";

    const test_date = beautifyDate(new Date(email_info.test.due_date));
    const hospital_name = email_info.hospital.hospital_name;
    const patient_full_name = `${email_info.patient.patient_name} ${
        email_info.patient.patient_surname
        }`;
    const computed_html = mjml2html(`
    <mjml>
       ${getHead("Reminder For Test")}
       <mj-body>
          ${getTopImage(header_image_url)}
          <mj-section>
             <mj-column width="45%">
                <mj-text align="center" font-weight="500" padding="0px" font-size="18px">BLOOD TEST REMINDER - ${test_date}</mj-text>
                <mj-divider border-width="2px" border-color="#616161" />
                <mj-divider border-width="2px" border-color="#616161" width="45%" />
             </mj-column>
          </mj-section>
          <mj-section padding-top="30px">
             <mj-column width="100%">
                <mj-text>
                   <p>Hello ${patient_full_name}.</p>
                   <p>This is a reminder for your blood test</p>
                   <p>The test is due on ${test_date}</p>
                   <p>The test will be taken at ${hospital_name}</p>
                </mj-text>
             </mj-column>
          </mj-section>
       </mj-body>
       ${getFooter()}

    </mjml>    
   `);

    if (computed_html.errors.length === 0) {
        let email = email_info.patient.patient_email;
        if (email == null) {
            email = email_info.carer.carer_email;
        }
        return {
            to: email,
            html: computed_html.html,
            subjectTitle: "Reminder for your test"
        };
    }
    return null;
}

/**
 * Generate an email aimed at hospitals which reminds of a blood test due for a patient of theirs
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at the module's documentation.
*/
function testReminderForHospital(email_info) {
    const header_image_url =
        "https://images.unsplash.com/photo-1528872042734-8f50f9d3c59b";

    const test_date = beautifyDate(email_info.test.due_date);
    const patient = email_info.patient;
    const computed_html = mjml2html(`
    <mjml>
       ${getHead("Reminder For Patient Test")}
       <mj-body>
          ${getTopImage(header_image_url)}
          <mj-section>
             <mj-column width="45%">
                <mj-text align="center" font-weight="500" padding="0px" font-size="18px">BLOOD TEST REMINDER - ${test_date}</mj-text>
                <mj-divider border-width="2px" border-color="#616161" />
                <mj-divider border-width="2px" border-color="#616161" width="45%" />
             </mj-column>
          </mj-section>
          <mj-section padding-top="30px">
          <mj-column width="100%">
          <mj-text>
            <p>${patient.patient_name} has a test due on ${test_date}.</p>
            <p>You will find the relevant information regarding this test underneath:</p>
            <mj-table>
              <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                  <th style="padding: 0 15px 0 0;">Patient Information</th>
                </tr>
              </tr>
              <tr>
                <td style="padding: 0 15px 0 0;">Full Name</td>
                <td style="padding: 0 15px;white-space:nowrap;">${patient.patient_name} ${patient.patient_surname}</td>
              </tr>
              <tr>
                <td style="padding: 0 15px 0 0;">Patient Number</td>
                <td style="padding: 0 15px;">${patient.patient_no}</td>
              </tr>
              <tr>
                <td style="padding: 0 15px 0 0;">Email Address</td>
                <td style="padding: 0 15px;">${patient.patient_email}</td>
              </tr>
              <tr>
                <td style="padding: 0 15px 0 0;">Phone Number</td>
                <td style="padding: 0 15px;">${patient.patient_phone}</td>
              </tr>
            </mj-table>
          </mj-text>
        </mj-column>
          </mj-section>
       </mj-body>
       ${getFooter()}

    </mjml>    
   `);

    if (computed_html.errors.length === 0)
        return {
            to: email_info.hospital.hospital_email,
            html: computed_html.html,
            subjectTitle: "Reminder for a test"
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
 * Get mjml code for image at the top of emails
 * @param {string} header_image_url url of image to be placed on top of emails
 * @return {string} mjml code for image at the top of emails
 */
function getTopImage(header_image_url) {
    return `
        <mj-section>
        <mj-column width="100%">
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
    return ``;
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
