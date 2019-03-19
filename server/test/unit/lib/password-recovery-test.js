const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const passwordRecovery = rewire("../../../lib/password-recovery");

describe("Password Recovery Functionality", function(){
  context("Recovery password email", function(){
    let spy;
    beforeEach(()=>{
      spy = sinon.spy(passwordRecovery.recoverPassword)
    })
    it("Cannot find user due to database error - (STUBBED)", async function(){
      const queryController ={
        getUser: async function(){
          return {success: false, response:{error:"STUBBED ERROR"}}
        }
      }
      passwordRecovery.__set__("queryController",queryController)
      const response = await spy("admin");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR");
    })
    it("Cannot find user due to lack of user with this username - (STUBBED)", async function(){
      const queryController ={
        getUser: async function(){
          return {success: true, response:[[]]}
        }
      }
      passwordRecovery.__set__("queryController",queryController)
      const response = await spy("admin");
      response.success.should.equal(false);
      response.response.should.equal("No user found!");
    })
    it("Find user, cannot update due to an error - (STUBBED)", async function(){
      const queryController ={
        getUser: async function(){
          return {success: true, response:[{username:"admin", recovery_email:"admin123@gmail.com"}]}
        },
        updatePassword: async function(){
          return {success:false, response:{error:"STUBBED ERROR"}}
        }
      }
      passwordRecovery.__set__("queryController",queryController)
      const response = await spy("admin");
      response.success.should.equal(false);
      response.response.error.should.equal("STUBBED ERROR");
    })
    it("Find user, update password and fail to send an email - (STUBBED)", async function(){
      const queryController ={
        getUser: async function(){
          return {success: true, response:[{username:"admin", recovery_email:"admin123@gmail.com"}]}
        },
        updatePassword: async function(){
          return {success: true, response:{affectedRows:1, changedRows:1}}
        }
      }
      const emailSender = {
        sendPasswordRecoveryEmail: async function(){
          return {success:false, error:"Could not send email with new password"}
        }
      }
      passwordRecovery.__set__("queryController",queryController)
      passwordRecovery.__set__("email_sender",emailSender)
      const response = await spy("admin");
      response.success.should.equal(false);
      response.error.should.equal("Could not send email with new password");
    })
    it("Find user, update password and send an email - (STUBBED)", async function(){
      const queryController ={
        getUser: async function(){
          return {success: true, response:[{username:"admin", recovery_email:"admin123@gmail.com"}]}
        },
        updatePassword: async function(){
          return {success: true, response:{affectedRows:1, changedRows:1}}
        }
      }
      const emailSender = {
        sendPasswordRecoveryEmail: async function(){
          return {success:true}
        }
      }
      passwordRecovery.__set__("queryController",queryController)
      passwordRecovery.__set__("email_sender",emailSender)
      const response = await spy("admin");
      response.success.should.equal(true);
    })
  })
})
