const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const email_generator = require('./../../../../lib/email/email-generator');
const jsonController = require("./../../../../lib/json-parser");
const CONFIG_ABSOLUTE_PATH = __dirname + "/../../../../config/email_config.json"; //the absolute path of the email_config.json file
const email_config = jsonController.getJSON(CONFIG_ABSOLUTE_PATH);

describe("Testing email generator:", () => {
    describe("> Test overdue reminder - hospital:", () => {
        it("Should not return null.", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: null,
                hospital: {
                    hospital_email: null
                },
                test: {
                    
                }
            }
            const res = await email_generator.overdueTestReminderForHospital(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null.", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: null,
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.overdueTestReminderForHospital(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
    });
    describe("> Test normal reminder - hospital:", () => {
        it("Should not return null.", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: null,
                hospital: {
                    hospital_email: null
                },
                test: {
                    
                }
            }
            const res = await email_generator.testReminderForHospital(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null.", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: null,
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.testReminderForHospital(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
    });
    describe("> Test overdue reminder - patient:", () => {
        it("Should not return null (both null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: {
                    carer_email: null
                },
                hospital: {
                    hospital_email: null
                },
                test: {
                    
                }
            }
            const res = await email_generator.overdueTestReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null (patient null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: {
                    carer_email: "example@gmail.com"
                },
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.overdueTestReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null (carer null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: "example@gmail.com"
                },
                carer: {
                    carer_email: null
                },
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.overdueTestReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null (none null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: "example@gmail.com"
                },
                carer: {
                    carer_email: "example@gmail.com"
                },
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.overdueTestReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
    });
    describe("> Test normal reminder - patient:", () => {
        it("Should not return null (both null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: {
                    carer_email: null
                },
                hospital: {
                    hospital_email: null
                },
                test: {
                    
                }
            }
            const res = await email_generator.testReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null (patient null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: null
                },
                carer: {
                    carer_email: "example@gmail.com"
                },
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.testReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null (carer null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: "example@gmail.com"
                },
                carer: {
                    carer_email: null
                },
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.testReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null (none null).", async () => {
            const emailInfo = {
                patient: {
                    patient_email: "example@gmail.com"
                },
                carer: {
                    carer_email: "example@gmail.com"
                },
                hospital: {
                    hospital_email: "example@gmail.com"
                },
                test: {
                    
                }
            }
            const res = await email_generator.testReminderForPatient(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
    });
    describe("> Test password recovery email:", () => {
        it("Should not return null.", async () => {
            const emailInfo = {
                user: {
                    recovery_email: null,
                    new_password: "new"
                }
            }
            const res = await email_generator.passwordRecoveryEmail(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
        it("Should not return null.", async () => {
            const emailInfo = {
                user: {
                    recovery_email: "example@gmail.com",
                    new_password: "new"
                }
            }
            const res = await email_generator.passwordRecoveryEmail(emailInfo, email_config);
            expect(res).to.not.equal(null);
        });
    });
});