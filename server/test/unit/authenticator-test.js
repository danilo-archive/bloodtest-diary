const chai = require("chai");
const should = chai.should();
const crypto = require("crypto");
var authenticator = require("../../lib/authenticator");


describe("Basic test authentication", function() {
    context("Name, Password", function(){
        it("Should return false when wrong credentials", function(){
            testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("wrong").digest('hex')};
            testEntry = [{id:"1", username:"admin", password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}];
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when wrong credentials", function(){
            testCredentials = {username: "wrong2", password: crypto.createHash('sha256').update("wrong2").digest('hex')};
            testEntry = [{id:"1", username:"admin", password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}];
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when empty credentials", function(){
            testCredentials = {username: "", password: crypto.createHash('sha256').update("").digest('hex')};
            testEntry = [{id:"1", username:"admin", password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}];
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when empty password", function(){
            testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("").digest('hex')};
            testEntry = [{id:"1", username:"admin", password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}];
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

        it("Should return false when empty username", function(){
            testCredentials = {username: "", password: crypto.createHash('sha256').update("still wrong").digest('hex')};
            testEntry = [{id:"1", username:"admin", password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}];
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });

    });
});
