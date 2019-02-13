const chai = require("chai");
const should = chai.should();
var authenticator = require("../../lib/authenticator");


describe("Basic test authentication", function() {
    context("Name, Password", function(){
        it("Should return false", function(){
            //random non-hashed credentials
            // TODO create real testing lmao
            testCredentials = {username:"admin", password:"admin"};
            testEntry = [{id:"1", username:"admin", password:"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}];
            authenticator.canLogin(testCredentials, testEntry).should.equal(false);
        });
    });
});
