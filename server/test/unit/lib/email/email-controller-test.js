const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const emailController = rewire("./../../../../lib/email/email-controller");

describe("Test email controller:", () => {

    describe("> Password Recovery Functionality", function () {
        context("Recovery password email", function () {
            let spy;
            beforeEach(() => {
                spy = sinon.spy(emailController.recoverPassword)
            })
            it("Cannot find user due to database error - (STUBBED)", async function () {
                const query_controller = {
                    getUser: async function () {
                        return { success: false, response: { error: "STUBBED ERROR" } }
                    }
                }
                emailController.__set__("query_controller", query_controller)
                const response = await spy("admin");
                response.success.should.equal(false);
                response.response.error.should.equal("STUBBED ERROR");
            })
            it("Cannot find user due to lack of user with this username - (STUBBED)", async function () {
                const query_controller = {
                    getUser: async function () {
                        return { success: true, response: [[]] }
                    }
                }
                emailController.__set__("query_controller", query_controller)
                const response = await spy("admin");
                response.success.should.equal(false);
                response.response.should.equal("No user found!");
            })
            it("Find user, cannot update due to an error - (STUBBED)", async function () {
                const query_controller = {
                    getUser: async function () {
                        return { success: true, response: [{ username: "admin", recovery_email: "admin123@gmail.com" }] }
                    },
                    editUser: async function () {
                        return { success: false, response: { error: "STUBBED ERROR" } }
                    }
                }
                const emailSender = {
                    sendPasswordRecoveryEmail: async function () {
                        return true;
                    }
                }
                emailController.__set__("email_sender", emailSender)
                emailController.__set__("query_controller", query_controller)
                const response = await spy("admin");
                response.success.should.equal(false);
                response.response.error.should.equal("STUBBED ERROR");
            })
            it("Find user, update password and fail to send an email - (STUBBED)", async function () {
                const query_controller = {
                    getUser: async function () {
                        return { success: true, response: [{ username: "admin", recovery_email: "admin123@gmail.com" }] }
                    },
                    editUser: async function () {
                        return { success: true, response: { affectedRows: 1, changedRows: 1 } }
                    }
                }
                const emailSender = {
                    sendPasswordRecoveryEmail: async function () {
                        return false;
                    }
                }
                emailController.__set__("query_controller", query_controller)
                emailController.__set__("email_sender", emailSender)
                const response = await spy("admin");
                response.success.should.equal(false);
            })
            it("Find user, update password and send an email - (STUBBED)", async function () {
                const query_controller = {
                    getUser: async function () {
                        return { success: true, response: [{ username: "admin", recovery_email: "admin123@gmail.com" }] }
                    },
                    editUser: async function () {
                        return { success: true, response: { affectedRows: 1, changedRows: 1 } }
                    }
                }
                const emailSender = {
                    sendPasswordRecoveryEmail: async function () {
                        return true
                    }
                }
                emailController.__set__("query_controller", query_controller)
                emailController.__set__("email_sender", emailSender)
                const response = await spy("admin");
                response.success.should.equal(true);
            });
        });
    });

    describe("> Test send overdue reminders:", () => {
        it("Should fail (token fail).", async () => {
            const query_controller = {
                requestEditing: async function() {
                    return undefined;
                }
            }
            emailController.__set__("query_controller", query_controller);
            const res = await emailController.sendOverdueReminders([404]);
            const shouldBe = {
                success: false,
                response: {
                    failedBoth: [404],
                    failedPatient: [],
                    failedHospital: []
                }
            };
            expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
        });
        it("Should fail (getTest fail).", async () => {
            let called = false;
            const query_controller = {
                requestEditing: async function() {
                    return "token";
                },
                getTest: async function() {
                    return { invalid: 123 };
                },
                returnToken: async function() {
                    called = true;
                }
            }
            emailController.__set__("query_controller", query_controller);
            const res = await emailController.sendOverdueReminders([404]);
            const shouldBe = {
                success: false,
                response: {
                    failedBoth: [404],
                    failedPatient: [],
                    failedHospital: []
                }
            };
            expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
            expect(called).to.be.true;
        });
        it("Should succeed (no hospital).", async () => {
            let called = false;
            const query_controller = {
                requestEditing: async function() {
                    return "token";
                },
                getTest: async function() {
                    return { response: [{ some: "info"}] };
                },
                getPatient: async function() {
                    return { response: [{
                        carer_id: null,
                        hospital_id: null
                    }] };
                },
                returnToken: async function() {
                    called = true;
                },
                updateLastReminder: async function() {
                    return {success: true}
                }
            };
            const email_sender = {
                sendOverdueReminderToPatient: async function() {
                    return true;
                }
            }
            emailController.__set__("query_controller", query_controller);
            emailController.__set__("email_sender", email_sender);
            const res = await emailController.sendOverdueReminders([404]);
            expect(res.success).to.be.true;
            expect(called).to.be.false;
        });
        it("Should fail for hospital.", async () => {
            let called = false;
            const query_controller = {
                requestEditing: async function() {
                    return "token";
                },
                getTest: async function() {
                    return { response: [{ some: "info"}] };
                },
                getCarer: async function() {
                    return { response: [{ some: "info"}] };
                },
                getHospital: async function() {
                    return { response: [{ some: "info"}] };
                },
                getPatient: async function() {
                    return { response: [{
                        carer_id: 5,
                        hospital_id: 15
                    }] };
                },
                returnToken: async function() {
                    called = true;
                },
                updateLastReminder: async function() {
                    return {success: false, err: "stubbed error"}
                }
            };
            const email_sender = {
                sendOverdueReminderToPatient: async function() {
                    return true;
                },
                sendOverdueReminderToHospital: async function() {
                    return false;
                }
            }
            emailController.__set__("query_controller", query_controller);
            emailController.__set__("email_sender", email_sender);
            const res = await emailController.sendOverdueReminders([404]);
            const shouldBe = {
                success: false,
                response: {
                    failedBoth: [],
                    failedPatient: [],
                    failedHospital: [404]
                }
            };
            expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
            expect(called).to.be.false;
        });
    });
    it("Should fail for patient.", async () => {
        let called = false;
        const query_controller = {
            requestEditing: async function() {
                return "token";
            },
            getTest: async function() {
                return { response: [{ some: "info"}] };
            },
            getCarer: async function() {
                return { response: [{ some: "info"}] };
            },
            getHospital: async function() {
                return { response: [{ some: "info"}] };
            },
            getPatient: async function() {
                return { response: [{
                    carer_id: 5,
                    hospital_id: 15
                }] };
            },
            returnToken: async function() {
                called = true;
            },
            updateLastReminder: async function() {
                return {success: false, err: "stubbed error"}
            }
        };
        const email_sender = {
            sendOverdueReminderToPatient: async function() {
                return false;
            },
            sendOverdueReminderToHospital: async function() {
                return true;
            }
        }
        emailController.__set__("query_controller", query_controller);
        emailController.__set__("email_sender", email_sender);
        const res = await emailController.sendOverdueReminders([404]);
        const shouldBe = {
            success: false,
            response: {
                failedBoth: [],
                failedPatient: [404],
                failedHospital: []
            }
        };
        expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
        expect(called).to.be.true;
    });

    describe("> Test send overdue reminders:", () => {
        it("Should fail for both (not sent)", async () => {
            let called = false;
            const query_controller = {
                requestEditing: async function() {
                    return "token";
                },
                getTest: async function() {
                    return { response: [{ some: "info"}] };
                },
                getCarer: async function() {
                    return { response: [{ some: "info"}] };
                },
                getHospital: async function() {
                    return { response: [{ some: "info"}] };
                },
                getPatient: async function() {
                    return { response: [{
                        carer_id: 5,
                        hospital_id: 15
                    }] };
                },
                returnToken: async function() {
                    called = true;
                },
                updateLastReminder: async function() {
                    return {success: false, err: "stubbed error"}
                }
            };
            const email_sender = {
                sendReminderToPatient: async function() {
                    return false;
                },
                sendReminderToHospital: async function() {
                    return false;
                }
            }
            emailController.__set__("query_controller", query_controller);
            emailController.__set__("email_sender", email_sender);
            const res = await emailController.sendNormalReminders([404]);
            const shouldBe = {
                success: false,
                response: {
                    failedBoth: [404],
                    failedPatient: [],
                    failedHospital: []
                }
            };
            expect(JSON.stringify(res)).to.equal(JSON.stringify(shouldBe));
            expect(called).to.be.true;
        });
    });
});

