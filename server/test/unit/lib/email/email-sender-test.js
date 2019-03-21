const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
let email_sender = rewire('./../../../../lib/email/email-sender');

describe("Test email sender: ", () => {

    before(() => {
        const email_generator = {
            testReminderForPatient: async function() {
                return {
                    to: null,
                    html: "Stubbed html.",
                    subjectTitle: "Title"
                }
            },
            testReminderForHospital: async function() {
                return {
                    to: undefined,
                    html: "Stubbed html.",
                    subjectTitle: "Title"
                }
            },
            overdueTestReminderForPatient: async function() {
                return {
                    to: "",
                    html: "Stubbed html.",
                    subjectTitle: "Title"
                }
            },
            overdueTestReminderForHospital: async function() {
                return null;
            },
            passwordRecoveryEmail: async function() {
                return {
                    to: "example@gmail.com",
                    html: "Stubbed html.",
                    subjectTitle: "Title"
                }
            }
        }
        email_sender.__set__("email_generator", email_generator);
    });
    describe("> Test normal reminder for patient:", () => {
        it("Should be unsuccessful.", async () => {
            const res = await email_sender.sendReminderToPatient();
            expect(res).to.be.false;
        });
    });
    describe("> Test normal reminder for hospital:", () => {
        it("Should be unsuccessful.", async () => {
            const res = await email_sender.sendReminderToHospital();
            expect(res).to.be.false;
        });
    });
    describe("> Test overdue reminder for patient:", () => {
        it("Should be unsuccessful.", async () => {
            const res = await email_sender.sendOverdueReminderToPatient();
            expect(res).to.be.false;
        });
    });
    describe("> Test overdue reminder for hospital:", () => {
        it("Should be unsuccessful.", async () => {
            const res = await email_sender.sendOverdueReminderToHospital();
            expect(res).to.be.false;
        });
    });
    describe("> Test password recovery email:", () => {
        it("Should be successful.", async () => {
            const res = await email_sender.sendPasswordRecoveryEmail();
            expect(res).to.be.true;
        });
    });
});