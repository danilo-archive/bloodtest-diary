/**
 * This file contains tests that test the behaviour of action-logger.js
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module action-logger-test
 * @see module:action-logger
 */

const chai = require("chai")
const expect = chai.expect;
const rewire = require('rewire');
const action_logger = rewire("../../../lib/action-logger");
const sinonChai = require('sinon-chai')
const Database = require("../../../lib/db_controller/Database");
const databaseConfig = require("../../../config/database");
const sinon = require('sinon');

chai.use(sinonChai);

before(() => {
    action_logger.disableConsoleOutput();
});

after(() => {
    action_logger.enableConsoleOutput();
});
describe("Test action logger:", () => {

    before(() => {
        const database = new Database(databaseConfig);
        database.query("INSERT INTO User VALUES ('logger_test','password','no','','1','logger_test@gmail')")
            .catch((err) => {
                printSetupError(err);
            })
            .then(() => {
                database.close();
            });
    });

    afterEach(() => {
        const database = new Database(databaseConfig);
        database.query("DELETE FROM ActionLog WHERE username = 'logger_test'")
            .catch((err) => {
                printSetupError(err);
            })
            .then(() => {
                database.close();
            });
    });

    after(() => {
        const database = new Database(databaseConfig);
        database.query("DELETE FROM User WHERE username = 'logger_test'")
            .catch((err) => {
                printSetupError(err);
            })
            .then(() => {
                database.close();
            });
    });

    describe("> Test logging insert actions:", () => {
        it("Should throw an error for invalid arguments.", async () => {
            let error = undefined;
            try {
                await action_logger.logInsert("", "");
            }
            catch(err) {
                error = err;
            }
            expect(error).to.not.be.undefined;
        });

        it("Should add a new entry to the database.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logInsert("logger_test", "Patient", "P123", undefined, (res) => {
                try {
                    expect(res.status).to.equal("OK");
                    expect(res.response.insertId).to.not.equal(0);
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        });  

        it("Should reject the log.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logInsert("invalid_user", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("ERR");
                    expect(res.err.type).to.equal("SQL Error");
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 
    });

    describe("> Test logging update actions:", () => {
        it("Should throw an error for invalid arguments.", async () => {
            let error = undefined;
            try {
                await action_logger.logUpdate("", "");
            }
            catch(err) {
                error = err;
            }
            expect(error).to.not.be.undefined;
        });

        it("Should add a new entry to the database.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logUpdate("logger_test", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("OK");
                    expect(res.response.insertId).to.not.equal(0);
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 

        it("Should reject the log.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logUpdate("invalid_user", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("ERR");
                    expect(res.err.type).to.equal("SQL Error");
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 
    });

    describe("> Test logging delete actions:", () => {
        it("Should throw an error for invalid arguments.", async () => {
            let error = undefined;
            try {
                await action_logger.logDelete("", "");
            }
            catch(err) {
                error = err;
            }
            expect(error).to.not.be.undefined;
        });

        it("Should add a new entry to the database.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logDelete("logger_test", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("OK");
                    expect(res.response.insertId).to.not.equal(0);
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 

        it("Should reject the log.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logDelete("invalid_user", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("ERR");
                    expect(res.err.type).to.equal("SQL Error");
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 
    });

    describe("> Test logging other actions:", () => {
        it("Should throw an error for invalid arguments.", async () => {
            let error = undefined;
            try {
                await action_logger.logOther("logger_test", "Patient", "P123"); // message is compulsory
            }
            catch(err) {
                error = err;
            }
            expect(error).to.not.be.undefined;
        });

        it("Should add a new entry to the database.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logOther("logger_test", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("OK");
                    expect(res.response.insertId).to.not.equal(0);
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 

        it("Should reject the log.", async () => { 
            let error = undefined;                  
            let finished = false;
            action_logger.logOther("invalid_user", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("ERR");
                    expect(res.err.type).to.equal("SQL Error");
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }
            if (error) throw error;
        }); 
    });

    describe("> Test console output:", () => {
        let infoCalls = 0;
        let errorCalls = 0;
        const stub_logger = {
            info: function() {
                infoCalls++;
            },
            error: function() {
                errorCalls++;
            }
        }
        action_logger.__set__("logger", stub_logger);
        beforeEach(() => {
            infoCalls = 0;
            errorCalls = 0;
            action_logger.enableConsoleOutput();
        });

        afterEach(function() {
            action_logger.disableConsoleOutput();
        });

        it("Should reject the log (other + invalid username).", async () => { 
            let error = undefined;                  
            let finished = false;
            
            action_logger.logOther("invalid_user", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("ERR");
                    expect(res.err.type).to.equal("SQL Error");

                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }   
            expect(infoCalls).to.equal(0);
            expect(errorCalls).to.equal(1);       

            if (error) throw error;
        });
        it("Should accept the log (other + valid username).", async () => { 
            let error = undefined;                  
            let finished = false;
            
            action_logger.logOther("logger_test", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("OK");
                    expect(res.response.insertId).to.not.equal(0);
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }          
            expect(infoCalls).to.equal(1);
            expect(errorCalls).to.equal(0);

            if (error) throw error;
        });
        it("Should reject the log (insert + invalid username).", async () => { 
            let error = undefined;                  
            let finished = false;
            
            action_logger.logInsert("invalid_user", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("ERR");
                    expect(res.err.type).to.equal("SQL Error");
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }          
            expect(infoCalls).to.equal(0);
            expect(errorCalls).to.equal(1);

            if (error) throw error;
        });
        it("Should accept the log (insert + valid username).", async () => { 
            let error = undefined;                  
            let finished = false;
            
            action_logger.logInsert("logger_test", "Patient", "P123", "message", (res) => {
                try {
                    expect(res.status).to.equal("OK");
                    expect(res.response.insertId).to.not.equal(0);
                }
                catch(err) {
                    error = err;
                }
                finished = true;
            });
            while (!finished) {
                await sleep(1);
            }          
            expect(infoCalls).to.equal(1);
            expect(errorCalls).to.equal(0);

            if (error) throw error;
        });
    });

});

/**
 * Prints an error that occurred during setting up the testing 
 * environment in a nice format.
 *
 * @param {Error} err Error that occurred.
 */
function printSetupError(err) {
    console.log("=======================================");
    console.log("Error setting up testing environment:\n" + err);
    console.log("=======================================");
}

/**
 * Await for this function to pause execution for a certain time.
 *
 * @param {number} ms Time in milliseconds
 * @returns {Promise}
 */
function sleep(ms){
    return new Promise((resolve) => {
        setTimeout(resolve,ms);
    });
}