const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const emailController = rewire("./../../../../lib/email/email-controller");


/*describe("Send overdue reminders:", () => {
    beforeEach(() => {
      const dbController = {
        selectQuery: async function() {
          return {status: "OK", response: { rows: [{}]}};
        },
        requestEditing: async function() {
          return {status: "OK", response:{ token: "TOKEN"}};
        },
        updateQuery: async function() {
          return {status: "OK"};
        },
        cancelEditing: async function() {
          return {status: "OK"};
        }
      }
      query_controller.__set__("databaseController",dbController);
    });

    it("Should return false.", async () => {
      const dbController = {
        selectQuery: async function() {
          return {status: "OK", response: { rows: [{}]}};
        },
        requestEditing: async function() {
          return {status: "ERR", err: {cause: "stubbed error"}};
        },
        cancelEditing: async function() {
          return {status: "OK"};
        }
      };
      query_controller.__set__("databaseController", dbController);
      const res = await query_controller.sendOverdueReminders([1], testUsername);
      const shouldBe = {
        success: false,
        response : {
          failedBoth: [1],
          failedPatient: [],
          failedHospital: []
        }
      };
      expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
    });

    it("Should return both failed.", async () => {
      const email_sender = {
        sendOneOverdueTestReminderToPatient: async function() {
          return [1];
        },
        sendOneOverdueTestReminderToHospital: async function() {
          return [1];
        }
      };
      query_controller.__set__("email_sender", email_sender);
      const res = await query_controller.sendOverdueReminders([1], testUsername);
      const shouldBe = {
        success: false,
        response : {
          failedBoth: [1],
          failedPatient: [],
          failedHospital: []
        }
      };
      expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
    });

    it("Should return patient failed.", async () => {
      const email_sender = {
        sendOneOverdueTestReminderToPatient: async function() {
          return [1];
        },
        sendOneOverdueTestReminderToHospital: async function() {
          return [];
        }
      };
      query_controller.__set__("email_sender", email_sender);
      const res = await query_controller.sendOverdueReminders([1], testUsername);
      const shouldBe = {
        success: false,
        response : {
          failedBoth: [],
          failedPatient: [1],
          failedHospital: []
        }
      };
      expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
    });

    it("Should return hospital failed.", async () => {
      const email_sender = {
        sendOneOverdueTestReminderToPatient: async function() {
          return [];
        },
        sendOneOverdueTestReminderToHospital: async function() {
          return [1];
        }
      };
      const dbController = {
        selectQuery: async function() {
          return {status: "OK", response: { rows: [{}]}};
        },
        requestEditing: async function() {
          return {status: "OK", response:{ token: "TOKEN"}};
        },
        updateQuery: async function() {
          return {status: "ERR", err: {cause: "stubbed error"}};
        },
        cancelEditing: async function() {
          return {status: "OK"};
        }
      }
      query_controller.__set__("databaseController",dbController);
      query_controller.__set__("email_sender", email_sender);
      const res = await query_controller.sendOverdueReminders([1], testUsername);
      const shouldBe = {
        success: false,
        response : {
          failedBoth: [],
          failedPatient: [],
          failedHospital: [1]
        }
      };
      expect(JSON.stringify(res)).to.be.equal(JSON.stringify(shouldBe));
    });

    it("Should return success.", async () => {
      const email_sender = {
        sendOneOverdueTestReminderToPatient: async function() {
          return [];
        },
        sendOneOverdueTestReminderToHospital: async function() {
          return [];
        }
      };
      query_controller.__set__("email_sender", email_sender);
      const res = await query_controller.sendOverdueReminders([1], testUsername);
      expect(res.success).to.be.true;
    });
  });*/

  describe("Password Recovery Functionality", function(){
    context("Recovery password email", function(){
      let spy;
      beforeEach(()=>{
        spy = sinon.spy(emailController.recoverPassword)
      })
      it("Cannot find user due to database error - (STUBBED)", async function(){
        const query_controller ={
          getUser: async function(){
            return {success: false, response:{error:"STUBBED ERROR"}}
          }
        }
        emailController.__set__("query_controller",query_controller)
        const response = await spy("admin");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Cannot find user due to lack of user with this username - (STUBBED)", async function(){
        const query_controller ={
          getUser: async function(){
            return {success: true, response:[[]]}
          }
        }
        emailController.__set__("query_controller",query_controller)
        const response = await spy("admin");
        response.success.should.equal(false);
        response.response.should.equal("No user found!");
      })
      it("Find user, cannot update due to an error - (STUBBED)", async function(){
        const query_controller ={
          getUser: async function(){
            return {success: true, response:[{username:"admin", recovery_email:"admin123@gmail.com"}]}
          },
          editUser: async function(){
            return {success:false, response:{error:"STUBBED ERROR"}}
          }
        }
        const emailSender = {
          sendPasswordRecoveryEmail: async function(){
            return true;
          }
        }
        emailController.__set__("email_sender",emailSender)
        emailController.__set__("query_controller",query_controller)
        const response = await spy("admin");
        response.success.should.equal(false);
        response.response.error.should.equal("STUBBED ERROR");
      })
      it("Find user, update password and fail to send an email - (STUBBED)", async function(){
        const query_controller ={
          getUser: async function(){
            return {success: true, response:[{username:"admin", recovery_email:"admin123@gmail.com"}]}
          },
          editUser: async function(){
            return {success: true, response:{affectedRows:1, changedRows:1}}
          }
        }
        const emailSender = {
          sendPasswordRecoveryEmail: async function(){
            return false;
          }
        }
        emailController.__set__("query_controller",query_controller)
        emailController.__set__("email_sender",emailSender)
        const response = await spy("admin");
        response.success.should.equal(false);
      })
      it("Find user, update password and send an email - (STUBBED)", async function(){
        const query_controller ={
          getUser: async function(){
            return {success: true, response:[{username:"admin", recovery_email:"admin123@gmail.com"}]}
          },
          editUser: async function(){
            return {success: true, response:{affectedRows:1, changedRows:1}}
          }
        }
        const emailSender = {
          sendPasswordRecoveryEmail: async function(){
            return true
          }
        }
        emailController.__set__("query_controller",query_controller)
        emailController.__set__("email_sender",emailSender)
        const response = await spy("admin");
        response.success.should.equal(true);
      })
    })
  })
