/**
 * This file contains tests that test the behaviour of 
 * main DB controller.
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module db_controller_test
 * @see module:db_controller
 */ 

const expect = require("chai").expect;
const db_controller = require("../../lib/db_controller/db-controller");

// These are needed for setting up a testing environment.
const mysql = require("mysql");
const databaseConfig = require("../../config/database");
const Database = require("../../lib/db_controller/Database");

describe("Test main DB controller behaviour:", () => {
    describe("Test selectQuery() function:", () => {

        // Setup environment.
        let test_lab_id = 0;
        before(async () => {
            const database = new Database(databaseConfig);
            
            await database.query("INSERT INTO Laboratory (lab_name) VALUES ('Test Lab 123_S')")
                        .then((result) => {
                            test_lab_id = result.insertId;
                        })
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname, lab_id) " +
                                "VALUES ('test_no_S', 'testName', 'testSurname', '" + test_lab_id + "')")
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.close();            
        });
        
        describe("> Select single entry, valid SQL", () => {
            it("Should return one correct entry.", (done) => {
                const sql = "SELECT * FROM Patient WHERE patient_no = 'test_no_S'";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.rows.length).to.equal(1);
                    expect(result.response.rows[0].patient_no).to.equal("test_no_S");
                    expect(result.response.rows[0].patient_name).to.equal("testName");
                    expect(result.response.rows[0].patient_surname).to.equal("testSurname");
                    expect(result.response.rows[0].lab_id).to.equal(test_lab_id);
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Select single entry, invalid SQL", () => {
            it("Should return an error message.", (done) => {
                const sql = "SELECT * FROM invalidTable";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("SQL Error");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Attempt to execute multiple queries at once", () => {
            it("Should return an error message.", (done) => {
                const sql = "SELECT * FROM Patient WHERE patient_no = 'test_no_S'; " +
                            "SELECT * FROM Patient WHERE patient_no = 'test_no_S'";
  
                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("SQL Error");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Select with a join Patient-Laboratory", () => {
            it("Should return one entry", (done) => {
                const sql = "SELECT * FROM Patient NATURAL JOIN Laboratory " +
                            "WHERE patient_no = 'test_no_S'";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.rows.length).to.equal(1);
                    expect(result.response.rows[0].patient_no).to.equal("test_no_S");
                    expect(result.response.rows[0].patient_name).to.equal("testName");
                    expect(result.response.rows[0].patient_surname).to.equal("testSurname");
                    expect(result.response.rows[0].lab_id).to.equal(test_lab_id);
                    expect(result.response.rows[0].lab_name).to.equal("Test Lab 123_S");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Select with a join Patient-Laboratory, but invalid SQL", () => {
            it("Should return an error message.", (done) => {
                const sql = "SELECT * FROM Patient NATURAL JOIN Laboratory " +
                            "WHERE patient_no = 'test_no_S' invalid";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("SQL Error");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        /*
        describe("> description", () => {
            it("Should return ...", (done) => {
                const sql = "[query]";

                await db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    //...
                })
                .then(() => {
                done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });
        */

        after(async () => {
            const database = new Database(databaseConfig);

            await database.query("DELETE FROM Patient WHERE patient_no = 'test_no_S'")
                        .catch((err) => {
                            printSetupError(err);
                        });

            await database.query("DELETE FROM Laboratory WHERE lab_id = " + test_lab_id)
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.close();
        });
    });

    describe("Test insertQuery() function:", () => {

    });

    describe("Test deleteQuery() function:", () => {

    });

    describe("Test updateQuery() function:", () => {

    });

    describe("Test requestEditing() function:", () => {

    });
});

function printSetupError(err) {
    console.log("=======================================")
    console.log("Error setting up testing environment:\n" + err)
    console.log("=======================================")
}

