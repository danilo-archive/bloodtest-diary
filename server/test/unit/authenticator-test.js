const chai = require("chai");
const should = chai.should();
const crypto = require("crypto");
const authenticator = require("../../lib/authenticator");


describe("Basic test authentication", function() {
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
    context("No user in database", function(){
      let testEntry;
      it("Should return false when no user in database", function(){
          const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("admin").digest('hex')};
          authenticator.canLogin(testCredentials, testEntry).should.equal(false);
      });
    })
    context("Two many users with same username in database", function(){
      const testEntry = [
        {id:"1", username:"admin", hashed_password:"f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5", iterations:1268, salt:"d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841"},
        {id:"2", username:"admin", hashed_password:"fsddsdsjdsjdsjjjjjjjduweewbefwyewfbiewfkcenwowefewuefiefvevoeweovmevoevevoenvwoewvnevoewvnmoevmevowewvolevwmveemwvoveweovwmevea5", iterations:1783, salt:"wu3ueebe33c2d3c5dshjdsjhcbfwejyewfuwebviewuiewvbuieuie7b0de32841"}
        ];
      it("Should return false when no user in database", function(){
          const testCredentials = {username: "wrong", password: crypto.createHash('sha256').update("admin").digest('hex')};
          authenticator.canLogin(testCredentials, testEntry).should.equal(false);
      });
    })
    });
});
