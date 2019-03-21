/**
 * This file contains tests that test the behaviour of authenticator.js
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module authenticator-test
 * @see module:authenticator
 */

const chai = require("chai");
const expect = chai.expect;
const rewire = require('rewire');
const should = chai.should();
const crypto = require("crypto");
const authenticator = rewire("../../lib/authenticator");


describe("Test authentication", function() {

    context("User in database", function(){
        let testEntry;
        beforeEach(()=>{
          testEntry = [{id:"1", username:"admin", hashed_password:"f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5", iterations:1268, salt:"d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841"}];
        })
        it("Should return false when wrong credentials", function(){
            const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("wrong").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when wrong credentials", function(){
            const testCredentials = {username: "wrong2", password: crypto.createHash('sha256').update("wrong2").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when empty credentials", function(){
            const testCredentials = {username: "", password: crypto.createHash('sha256').update("").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when empty password", function(){
            const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when empty username", function(){
            const testCredentials = {username: "", password: crypto.createHash('sha256').update("still wrong").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });
        it("Should return false for correct user, wrong password", function(){
            const testCredentials = {username: "admin", password: crypto.createHash('sha256').update("wrong").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });
        it("Should return false for correct password, wrong user", function(){
            const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("admin").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });
        it("Should return false for null password", function(){
            const testCredentials = {username: "wrong", password: null};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });
        it("Should return false for null username", function(){
            const testCredentials = {username: null, password: crypto.createHash('sha256').update("admin").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });
        it("Should return true for correct credentials", function(){
            const testCredentials = {username: "admin", password: crypto.createHash('sha256').update("admin").digest('hex')};
            authenticator.canLogin(testCredentials, testEntry).should.equal(true);
        });
    });
    context("No user in database", function(){
      let testEntry;
      it("Should return false when no user in database", function(){
          const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("admin").digest('hex')};
          authenticator.canLogin(testCredentials, testEntry).should.equal(false);
      });
    });
    context("Two many users with same username in database", function(){
      const testEntry = [
        {id:"1", username:"admin", hashed_password:"f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5", iterations:1268, salt:"d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841"},
        {id:"2", username:"admin", hashed_password:"fsddsdsjdsjdsjjjjjjjduweewbefwyewfbiewfkcenwowefewuefiefvevoeweovmevoevevoenvwoewvnevoewvnmoevmevowewvolevwmveemwvoveweovwmevea5", iterations:1783, salt:"wu3ueebe33c2d3c5dshjdsjhcbfwejyewfuwebviewuiewvbuieuie7b0de32841"}
        ];
      it("Should return false when no user in database", function(){
          const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("admin").digest('hex')};
          authenticator.canLogin(testCredentials, testEntry).should.equal(false);
      });
    });
    

    describe("Test registerNewUsername():", () => {
        let accessTokens;
        beforeEach(() => {
            const tokenGenerator = {
                generateLoginToken: function() {
                    return "test_login_token";
                }
            };

            accessTokens = {};

            const db_controller = {
                insertQuery: async function() {
                    return { status: "OK" };
                }
            };

            authenticator.__set__("tokenGenerator", tokenGenerator);
            authenticator.__set__("accessTokens", accessTokens);
            authenticator.__set__("db_controller", db_controller);
        });

        describe("> Test if correct token is stored with the correct username:", () => {
            it("Should store and return the correct token.", async () => {
                const token = await authenticator.registerNewUsername("test_user");
                expect(token).to.equal("test_login_token");
                expect(accessTokens["test_login_token"].username).to.equal("test_user");
                expect(accessTokens["test_login_token"].expires).to.not.be.undefined;
            });
        });
    });

    describe("Test verifyToken():", () => {
        let accessTokens;
        let date;
        beforeEach(() => {
            date = new Date();

            const validDate = new Date();
            validDate.setDate(validDate.getDate() + 2);

            const invalidDate = new Date();
            invalidDate.setDate(invalidDate.getDate() - 2);

            accessTokens = {
                test_valid_login_token: {
                    username: "test_user_valid",
                    expires: validDate
                },
                test_invalid_login_token: {
                    username: "test_user_invalid",
                    expires: invalidDate
                }
            };

            const db_controller = {
                deleteAccessToken: async function() {
                    return { status: "OK" };
                },
                updateAccessToken: async function() {
                    return { status: "OK" };
                }
            };
                

            authenticator.__set__("accessTokens", accessTokens);
            authenticator.__set__("db_controller", db_controller);
        });

        describe("> Test with invalid token:", () => {
            it("Should return undefined.", async () => {
                const username = await authenticator.verifyToken("invalid_token");
                expect(username).to.be.undefined;
                expect(accessTokens.test_valid_login_token.username).to.equal("test_user_valid");
                expect(accessTokens.test_invalid_login_token.username).to.equal("test_user_invalid");
            });
        });

        describe("> Test with expired token:", () => {
            it("Should delete that token and return undefined.", async () => {
                const username = await authenticator.verifyToken("test_invalid_login_token");
                expect(username).to.be.undefined;
                expect(accessTokens.test_valid_login_token.username).to.equal("test_user_valid");
                expect(accessTokens.test_invalid_login_token).to.be.undefined;
            });
        });

        describe("> Test with valid token:", () => {
            it("Should return correct username and update expiry.", async () => {
                const username = await authenticator.verifyToken("test_valid_login_token");
                expect(username).to.equal("test_user_valid");
                expect(accessTokens.test_valid_login_token.username).to.equal("test_user_valid");
                expect(accessTokens.test_invalid_login_token.username).to.equal("test_user_invalid");
                expect(accessTokens.test_valid_login_token.expires.getDate() - date.getDate()).to.be.greaterThan(2);
            });
        });
    });

    describe("Test logoutUser():", () => {
        let accessTokens;
        beforeEach(() => {
            const validDate = new Date();
            validDate.setDate(validDate.getDate() + 2);

            const invalidDate = new Date();
            invalidDate.setDate(invalidDate.getDate() - 2);

            accessTokens = {
                test_valid_login_token: {
                    username: "test_user_valid",
                    expires: validDate
                },
                test_invalid_login_token: {
                    username: "test_user_invalid",
                    expires: invalidDate
                }
            };

            const db_controller = {
                deleteAccessToken: async function() {
                    return { status: "OK" };
                },
                updateAccessToken: async function() {
                    return { status: "OK" };
                }
            };

            authenticator.__set__("accessTokens", accessTokens);
            authenticator.__set__("db_controller", db_controller);
        });

        describe("> Test with invalid token:", () => {
            it("Should return false.", async () => {
                const res = await authenticator.logoutUser("invalid_token");
                expect(res).to.be.false;
                expect(accessTokens.test_valid_login_token.username).to.equal("test_user_valid");
                expect(accessTokens.test_invalid_login_token.username).to.equal("test_user_invalid");
            });
        });

        describe("> Test with expired token:", () => {
            it("Should delete token and return false.", async () => {
                const res = await authenticator.logoutUser("test_invalid_login_token");
                expect(res).to.be.false;
                expect(accessTokens.test_valid_login_token.username).to.equal("test_user_valid");
                expect(accessTokens.test_invalid_login_token).to.be.undefined;
            });
        });

        describe("> Test with valid token:", () => {
            it("Should delete token and return true.", async () => {
                const res = await authenticator.logoutUser("test_valid_login_token");
                expect(res).to.be.true;
                expect(accessTokens.test_valid_login_token).to.be.undefined;
                expect(accessTokens.test_invalid_login_token.username).to.equal("test_user_invalid");
            });
        });
    });
});
