/**
 * This module processes mailing requests and organises the data that
 * is then used in email sender. It also updates the DB accordingly.
 *
 * @author Luka Kralj
 * @version 1.0
 * @module email-controller
 */

module.exports = {
    sendOverdueReminders,
    sendNormalReminders,
    recoverPassword
}

const query_controller = require('./../query-controller');
const email_sender = require('./email-sender');
const authenticator = require('./../authenticator.js');
const crypto = require("crypto");
const logger = require('./../logger');

/**
 * Send reminders for overdue tests.
 *
 * @param {Array} testIDs - List of all the overdue tests' IDs
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query. success is true only if all the emails were successfully sent.
 *            Some emails might fail to be sent for various reasons. It can be that the patient was sent
 *            an email but the hospital was not or vice versa, or maybe both emails failed to send.
 *            Response format:
 *            {success: true, response: "All emails sent successfully."}
 *
 *            The three "failed" lists are disjoint.
 *            {success: false,
 *             response: {
 *              failedBoth: [] // might be empty
 *              failedPatient: [] // might be empty
 *              failedHospital: [] // might be empty
 *             }
 *            }
 **/
async function sendOverdueReminders(testIDs, actionUsername) {
    return await send(testIDs, actionUsername, email_sender.sendOverdueReminderToPatient, email_sender.sendOverdueReminderToHospital);
}

/**
 * Send reminders for tests (not overdue).
 *
 * @param {Array} testIDs - List of all the overdue tests' IDs
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query. success is true only if all the emails were successfully sent.
 *            Some emails might fail to be sent for various reasons. It can be that the patient was sent
 *            an email but the hospital was not or vice versa, or maybe both emails failed to send.
 *            Response format:
 *            {success: true, response: "All emails sent successfully."}
 *
 *            The three "failed" lists are disjoint.
 *            {success: false,
 *             response: {
 *              failedBoth: [] // might be empty
 *              failedPatient: [] // might be empty
 *              failedHospital: [] // might be empty
 *             }
 *            }
 **/
async function sendNormalReminders(testIDs, actionUsername) {
    return await send(testIDs, actionUsername, email_sender.sendReminderToPatient, email_sender.sendReminderToHospital);
}

/**
 * Send reminders for overdue tests.
 *
 * @param {Array} testIDs - List of all the overdue tests' IDs
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query. success is true only if all the emails were successfully sent.
 *            Some emails might fail to be sent for various reasons. It can be that the patient was sent
 *            an email but the hospital was not or vice versa, or maybe both emails failed to send.
 *            Response format:
 *            {success: true, response: "All emails sent successfully."}
 *
 *            The three "failed" lists are disjoint.
 *            {success: false,
 *             response: {
 *              failedBoth: [] // might be empty
 *              failedPatient: [] // might be empty
 *              failedHospital: [] // might be empty
 *             }
 *            }
 **/
async function send(testIDs, actionUsername, patientFunction, hospitalFunction) {
    const failedBoth = [];
    const failedPatient = [];
    const failedHospital = [];

    for (let i = 0; i < testIDs.length; i++) {
        const token = await query_controller.requestEditing("Test", testIDs[i], actionUsername);
        if (!token) {
            failedBoth.push(testIDs[i]);
            continue;
        }

        let test = null;
        let patient = null;
        let hospital = null;
        let carer = null;

        try {
            test = (await query_controller.getTest(testIDs[i])).response[0];
            patient = (await query_controller.getPatient(test.patient_no)).response[0];
            hospital = null;
            carer = null;
            if (patient.carer_id !== null) {
                carer = (await query_controller.getCarer(patient.carer_id)).response[0];
            }
            if (patient.hospital_id !== null) {
                hospital = (await query_controller.getHospital(patient.hospital_id)).response[0];
            }
        }
        catch (err) {
            failedBoth.push(testIDs[i]);
            // release token
            query_controller.returnToken("Test", testIDs[i], token, actionUsername);
            continue;
        }

        const emailInfo = {
            patient: patient,
            hospital: hospital,
            test: test,
            carer: carer
        };

        const pat_ok = await patientFunction(emailInfo);

        let hos_ok = true;
        if (hospital !== null) {
            hos_ok = await hospitalFunction(emailInfo);
        }

        if (!pat_ok && !hos_ok) {
            failedBoth.push(testIDs[i]);
        }
        else if (!pat_ok) {
            failedPatient.push(testIDs[i]);
        }
        else if (!hos_ok) {
            failedHospital.push(testIDs[i]);
        }

        if (pat_ok) {
            // email for patient sent successfully
            query_controller.updateLastReminder(testIDs[i], token, actionUsername).then((res) => {
                if (!res.success) {
                    logger.error("Error updating latest reminder. Response: " + JSON.stringify(res));
                }
            });
        }
        else {
            // release token
            query_controller.returnToken("Test", testIDs[i], token, actionUsername);
        }
    }

    if (failedBoth.length === 0 && failedPatient.length === 0 && failedHospital.length === 0) {
        return { success: true, response: "All emails sent successfully." };
    }
    else {
        return {
            success: false,
            response: {
                failedBoth: failedBoth,
                failedPatient: failedPatient,
                failedHospital: failedHospital
            }
        };
    }
}

/**
* Recover password of user
* @param {String} username - user to recover password
* @result {JSON} result - {success:Boolean response:(optional) Error/Problem}
**/
async function recoverPassword(username) {
    const user = await query_controller.getUser(username);
    if (!user.success) {
        return user;
    }
    if (user.response[0].length == 0) {
        return { success: false, response: "No user found!" }
    }
    const token = await query_controller.requestEditing("User", username, username);
    if (!token) {
        return { success: false, response: "Could not send an email." };
    }
    const newPassword = authenticator.produceSalt();

    const userToEmail = {
        user: {
            username: username,
            new_password: newPassword,
            recovery_email: user.response[0].recovery_email
        }
    }
    const emailResponse = await email_sender.sendPasswordRecoveryEmail(userToEmail);
    if (!emailResponse) {
        query_controller.returnToken("User", username, token, username);
        return { success: false, response: "Could not send an email." };
    }
    const hash = crypto.createHash('sha256').update(newPassword).digest('hex');
    return await query_controller.editUser({ username: username, hashed_password: hash }, token, username);
}
