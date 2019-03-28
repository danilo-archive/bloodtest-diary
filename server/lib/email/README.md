
# How to use email sending modules

## How is it built

The module is based on functionalities offered by [nodemailer](https://nodemailer.com/about/).<br>
There are multiple wrapper functions:
* `sendReminderToPatient`
* `sendReminderToHospital`
* `sendOverdueReminderToPatient`
* `sendOverdueReminderToHospital`
* `sendPasswordRecoveryEmail`

There functions have the purpose of helping the module user to send a specific
type of email without having to pass too many parameters.<br> 
They just call the `sendEmails` method with preset parameters.

A user can call the `sendEmails` function and pass it valid testIDs and a function which returns a string.
Such function does not have to be a module export function of `email-generator.js`. 
Any function which has a single parameter and returns a JSON of this minimal format:
```
{
	"to": <RECEIVER_EMAIL_ADDRESS>,
	"html":<EMAIL_CONTENT>
}
```
The email will simply contain the content of the return value.

## How to add emails
In order to extend the module, one can create more wrapper functions and add an extra ***email generating function*** inside the `email-generator.js` module.

This will allow to easily create new types of emails.

## The config file

The configuration file for email sending is located at `BloodTestDiary/server/config/email_config.js`

This file contains the configuration information for the transporter email address (the email *from* which emails are sent).

To know how to modify the `email_condig.json` file in order to use another email as transporter, go to [Setup SMTP - Nodemailer](https://community.nodemailer.com/2-0-0-beta/setup-smtp/) or [SMTP transport :: Nodemailer](https://nodemailer.com/smtp/).


## Main Functions:
### email-sender.js
#### `sendEmails`

The email sends an email **for each** test corresponding to a *testID* in the *testIDs* parameter.
Depending on the `emailGeneratorFunction` function, a different email will be sent.

### email-generator.js`

The functions exported represent different types of email (e.g. an email which reminds an hospital of an overdue test).

The module is highly customisable. By changing the "Common Elements" functions at the bottom of the file, every email header/footer/top image will change.

The module is based around [mjml](https://mjml.io). It allows to easily generate HTML and CSS code with little code, to keep the file as *clean* as possible.

In order to generate different/extra code, use the [mjml editor](https://mjml.io/try-it-live).

