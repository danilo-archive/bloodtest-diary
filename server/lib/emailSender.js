const nodeMailer = require('nodemailer');

// TODO configure module with client's email
const from = "";
const password = "";
/**
*@param {to: email-targets, subject: subject, text: text, html: html} options
* The otpions of the email to be sent
*
*/
function sendEmail(options){
    // TODO read config from config file.
    let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,  //true for 465 port, false for other ports
                auth: {
                    user: from,
                    pass: password
                },
                tls: {
                        rejectUnauthorized: false
                }
            });

    // setup email data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        html: options.html // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    //res.status(400).send({success: false})
                } else {
                    //res.status(200).send({success: true});
                }
            });
}

module.exports = {
    sendEmail
}
