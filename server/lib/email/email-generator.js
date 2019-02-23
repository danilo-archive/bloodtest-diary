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
 * 
 * @example <caption>The email_info JSON needs to reflect this format in order to be properly parsed:</caption>
 {
    "patient": {
        "name" : <PATIENT_NAME>
    },
    "test": {
        "date" : <DATE_OF_DUE_TEST>,
        "lab" :{
            "name" : <LAB_NAME>,
        }
    }
}
 * @param {JSON} email_info the json containing info needed to generate the email. For format info look at function example.
 * @returns {string} html for an email containing info about a test which is due for a patient
 */
function testDueReminderForPatient(email_info) {
    const header_image_url = "https://images.unsplash.com/photo-1528872042734-8f50f9d3c59b";

    const date = email_info.test.date;
    const computed_html = mjml2html(`
    <mjml>
       ${getHead()}
       <mj-body>
          ${getTopImage(header_image_url)}
          <mj-section>
             <mj-column width="45%">
                <mj-text align="center" font-weight="500" padding="0px" font-size="18px">BLOOD TEST REMINDER - ${date}</mj-text>
                <mj-divider border-width="2px" border-color="#616161" />
                <mj-divider border-width="2px" border-color="#616161" width="45%" />
             </mj-column>
          </mj-section>
          <mj-section padding-top="30px">
             <mj-column width="100%">
                <mj-text>
                   <p>Hello ${email_info.patient.name}.</p>
                   <p>This is a reminder for your blood test</p>
                   <p>The test is due on ${email_info.test.date}</p>
                   <p>The test will be taken at ${email_info.test.lab.name}</p>
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