/**
//TODO: WRITE MODULE DESCRIPTION
 * @module email-generator
 * @author Danilo Del Busso
 * @version 0.0.1
 */
const mjml2html = require("mjml");

/*
|--------------------------------------------------------------------------
| EMAIL GENERATION FUNCTIONS
|--------------------------------------------------------------------------
| This section contains the functions which generate html code for different kinds of email
|
*/

//TODO: UPDATE JSDOC BELOW WITH ACTUAL FORMAT NEEDED

/**
 * Return html for an email containing info about a test which is due for a patient.
 * @example <caption>The email_info JSON needs to reflect this format in order to be properly parsed:</caption>
{
    let email_info = {
        "patient": {
            patient_no: '127699',
            patient_name: 'name127699',
            patient_surname: 'surname127699',
            patient_email: 'patient127699@gmail.com',
            patient_phone: '7428137322',
            lab_id: null
        },
        "test": {
            test_id: 2,
            patient_no: '612505',
            added: 2018 - 11 - 15T00: 00: 00.000Z,
            first_due_date: 2018 - 11 - 22T00: 00: 00.000Z,
            frequency: 'weekly',
            lab_id: 4,
            completed_status: 'yes',
            completed_date: 2018 - 12 - 04T00: 00: 00.000Z,
            notes: null
        },
        "lab": {
            lab_id: 1,
            lab_name: 'lab1',
            lab_email: 'lab1@gmail.com',
            lab_phone: null
        }
    }
}
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at function example.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function testDueReminderForPatient(email_info) {
    const header_image_url = "https://images.unsplash.com/photo-1528872042734-8f50f9d3c59b";

    const test_date = email_info.test.first_due_date;
    const patient_name = `${email_info.patient.patient_name} ${email_info.patient.patient_surname}`
    const computed_html = mjml2html(`
    <mjml>
       ${getHead()}
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
                   <p>Hello ${patient_name}.</p>
                   <p>This is a reminder for your blood test</p>
                   <p>The test is due on ${test_date}</p>
                   <p>The test will be taken at ${test_date}</p>
                </mj-text>
             </mj-column>
          </mj-section>
       </mj-body>
       ${getFooter()}

    </mjml>    
   `)

    if (computed_html.errors.length === 0)
        return computed_html.html
    return null

}


/*
|--------------------------------------------------------------------------
| EMAIL COMMON ELEMENTS
|--------------------------------------------------------------------------
| This section contains the functions which generate mjml code for common elements in
| the emails
|
*/

/**
 * Get mjml code for image at the top of emails
 * @param {string} header_image_url url of iamge to be placed on top of emails
 * @return {string} mjml code for image at the top of emails
 */
function getTopImage(header_image_url) {
    return `
        <mj-section>
        <mj-column width="100%">
            <mj-image src="${header_image_url}" />
        </mj-column>
        </mj-section>
        `
}

/**
 * Get mjml code describing common head of emails
 * @return {string} mjml code describing common head of emails
 */
function getHead() {
    return `
    <mj-head>
       <mj-title>Hello world</mj-title>
       <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,500" />
       <mj-attributes>
          <mj-all font-family="Roboto, Helvetica, sans-serif" />
          <mj-text font-weight="300" font-size="16px" color="#616161" line-height="24px" />
          <mj-section padding="0px" />
       </mj-attributes>
    </mj-head>    
    `
}


/**
 * Get mjml code describing common footer of emails
 * @return {string} mjml code describing common footer of emails
 */
function getFooter() {
    //TODO: CREATE FOOTER
    return ``
}

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
    testDueReminderForPatient
}