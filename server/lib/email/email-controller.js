/** 
 * This module processes mailing requests and organises the data that 
 * is then used in email sender. It also updates the DB accordingly.
 * 
 * @author Luka Kralj
 * @version 1.0
 * @module email-controller
 */

module.exports = {
    sendOverdueReminders
}

const query_controller = require('./../query-controller');
const email_sender = require('./email-sender');

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
            console.log(err);
            failedBoth.push(testIDs[i]);
            continue;
        }

        const emailInfo = {
            patient: patient,
            hospital: hospital,
            test: test,
            carer: carer
        };

        const pat_ok = await email_sender.sendOverdueReminderToPatient(emailInfo);
        
        let hos_ok = true;
        if (hospital !== null) {
            hos_ok = await email_sender.sendOverdueReminderToHospital(emailInfo);
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
                    console.log("Error updating latest reminder. Response: " + JSON.stringify(res));
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