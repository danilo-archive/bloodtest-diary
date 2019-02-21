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
const dateFormat = require("dateformat");

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
            await database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_S2', 'testName2', 'testSurname2')")
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.query("INSERT INTO TokenControl " + 
                                "VALUES ('test_token_S', 'Patient', 'test_no_S2', 20190805151515)")
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
            it("Should return one entry.", (done) => {
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

        describe("> Select multiple entries, valid SQL", () => {
            it("Should return a list of correct entries.", (done) => {
                const sql = "SELECT * FROM Patient WHERE patient_no = 'test_no_S' OR patient_no = 'test_no_S2'";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.rows.length).to.equal(2);
                    expect(result.response.rows[0].patient_no).to.equal("test_no_S");
                    expect(result.response.rows[0].patient_name).to.equal("testName");
                    expect(result.response.rows[0].patient_surname).to.equal("testSurname");
                    expect(result.response.rows[0].lab_id).to.equal(test_lab_id);
                    expect(result.response.rows[1].patient_no).to.equal("test_no_S2");
                    expect(result.response.rows[1].patient_name).to.equal("testName2");
                    expect(result.response.rows[1].patient_surname).to.equal("testSurname2");
                    expect(result.response.rows[1].lab_id).to.equal(null);
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Select multiple entries, invalid SQL", () => {
            it("Should return an error message.", (done) => {
                const sql = "SELECT * FROM Patient WHERE patient_no = 'test_no_S' OR patient_no == 'test_no_S2'";

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

        describe("> Select entry that is being edited", () => {
            it("Should return a correct entry.", (done) => {
                const sql = "SELECT * FROM Patient WHERE patient_no = 'test_no_S2'";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.rows.length).to.equal(1);
                    expect(result.response.rows[0].patient_no).to.equal("test_no_S2");
                    expect(result.response.rows[0].patient_name).to.equal("testName2");
                    expect(result.response.rows[0].patient_surname).to.equal("testSurname2");
                    expect(result.response.rows[0].lab_id).to.equal(null);
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        after(async () => {
            const database = new Database(databaseConfig);

            await database.query("DELETE FROM Patient WHERE patient_no = 'test_no_S' OR patient_no = 'test_no_S2'")
                        .catch((err) => {
                            printSetupError(err);
                        });

            await database.query("DELETE FROM Laboratory WHERE lab_id = " + test_lab_id)
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.query("DELETE FROM TokenControl WHERE token = 'test_token_S'")
                        .catch((err) => {
                            printSetupError(err);
                        });        
            await database.close();
        });
    });

    describe("Test insertQuery() function:", () => {

        describe("> Insert one entry, valid SQL", () => {
            it("Should return no errors.", (done) => {
                const sql = "INSERT INTO Patient " + 
                            "(patient_no, patient_name, patient_surname) " +
                            "VALUES ('test_no_I', 'testName_I', 'testSurname_I')";

                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.affectedRows).to.equal(1);
                    expect(result.response.insertId).to.equal(0); // because not auto_increment primary key
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                })
                .then(() => {
                    // clean entry
                    const database = new Database(databaseConfig);
                    database.query("DELETE FROM Patient WHERE patient_no = 'test_no_I'")
                                            .catch((err) => {
                                                printSetupError(err);
                                            })
                                            .then(() => {
                                                database.close();
                                            });
                });
            });
        });

        describe("> Insert one entry, invalid SQL", () => {
            it("Should return an error message.", (done) => {
                const sql = "INSERT INTO Patient " + 
                            "(patient_no, patient_nam, patient_surname) " +
                            "VALUES ('test_no_I2', 'testName_I', 'testSurname_I')";

                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("SQL Error");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                })
                .then(() => {
                    // clean entry
                    const database = new Database(databaseConfig);
                    database.query("DELETE FROM Patient WHERE patient_no = 'test_no_I2'")
                                            .catch((err) => {
                                                printSetupError(err);
                                            })
                                            .then(() => {
                                                database.close();
                                            });
                });
            });
        });

        describe("> Insert same entry twice", () => {
            it("Should return an error message.", (done) => {
                const sql = "INSERT INTO Patient " + 
                            "(patient_no, patient_name, patient_surname) " +
                            "VALUES ('test_no_I', 'testName_I', 'testSurname_I')";

                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.affectedRows).to.equal(1);
                    expect(result.response.insertId).to.equal(0); // because not auto_increment primary key
                })
                .then(() => {
                    db_controller.insertQuery(sql)
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
                })
                .catch((err) => {
                    done(err);
                })
                .then(() => {
                    // clean entry
                    const database = new Database(databaseConfig);
                    database.query("DELETE FROM Patient WHERE patient_no = 'test_no_I'")
                                            .catch((err) => {
                                                printSetupError(err);
                                            })
                                            .then(() => {
                                                database.close();
                                            });
                });
            });
        });

        describe("> Insert multiple entries, valid SQL", () => {
            it("Should return no errors.", (done) => {
                const sql = "INSERT INTO Patient " + 
                            "(patient_no, patient_name, patient_surname) " +
                            "VALUES ('test_no_I3', 'testName_I3', 'testSurname_I3'), " +
                            "('test_no_I4', 'testName_I4', 'testSurname_I4')";

                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.affectedRows).to.equal(2);
                    expect(result.response.insertId).to.equal(0); // because not auto_increment primary key
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                })
                .then(() => {
                    // clean entry
                    const database = new Database(databaseConfig);
                    database.query("DELETE FROM Patient WHERE patient_no = 'test_no_I3' OR patient_no = 'test_no_I4'")
                                            .catch((err) => {
                                                printSetupError(err);
                                            })
                                            .then(() => {
                                                database.close();
                                            });
                });
            });
        });

        describe("> Insert multiple entries, invalid SQL", () => {
            it("Should return an error message.", (done) => {
                const sql = "INSERT INTO Patient " + 
                            "(patient_no, patient_name, patient_surname) " +
                            "VALUES ('test_no_I3', 'testName_I3', 'testSurname_I3') " +
                            "('test_no_I4', 'testName_I4', 'testSurname_I4')";

                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("SQL Error");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                })
                .then(() => {
                    // clean entry
                    const database = new Database(databaseConfig);
                    database.query("DELETE FROM Patient WHERE patient_no = 'test_no_I3' OR patient_no = 'test_no_I4'")
                                            .catch((err) => {
                                                printSetupError(err);
                                            })
                                            .then(() => {
                                                database.close();
                                            });
                });
            });
        });

        describe("> Insert query with auto-incremented primary key", () => {
            it("Should return a valid primary key", (done) => {
                const sql = "INSERT INTO Laboratory (lab_name) " +
                            "VALUES ('Test_lab_INS')";

                let insId = 0;
                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    //expect(result.response.affectedRows).to.equal(1);
                    expect(result.response.insertId).to.not.equal(0);
                    insId = result.response.insertId;
                })
                .then(() => {
                    const database = new Database(databaseConfig);
                    database.query("SELECT * FROM Laboratory WHERE lab_id = " + insId)
                    .then((result) => {
                        expect(result.length).to.equal(1);
                        expect(result[0].lab_name).to.equal("Test_lab_INS");
                    })
                    .then(() => {
                        database.close();
                        done();
                    })
                    .catch((err) => {
                        database.close();
                        done(err);
                    })
                })
                .catch((err) => {
                    done(err);
                })
                .then(() => {
                    // clean entry
                    const database = new Database(databaseConfig);
                    database.query("DELETE FROM Laboratory WHERE lab_id = " + insId)
                                            .catch((err) => {
                                                printSetupError(err);
                                            })
                                            .then(() => {
                                                database.close();
                                            });
                });
            });
        });

    });

    describe("Test deleteQuery() function:", () => {

        describe("> Delete single entry, valid arguments, valid SQL", () => {
            it("Should return no error.", (done) => {
                const sql = "DELETE FROM Patient WHERE patient_no = 'test_no_D'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_D', 'testNameD', 'testSurnameD')")
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.deleteQuery(sql, "Patient", "test_no_D")
                            .then((result) => {
                                expect(result.status).to.equal("OK");
                                expect(result.response.query).to.equal("OK");
                                expect(result.response.affectedRows).to.equal(1);
                            })
                            .then(() => {
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query(sql).catch((err) => {
                                    printSetupError(err);
                                })
                                .then(() => {
                                    database1.close();
                                });
                            });
                        });
            });
        });

        describe("> Delete single entry, invalid arguments, valid SQL", () => {
            it("Should reject the request.", (done) => {
                const sql = "DELETE FROM Patient WHERE patient_no = 'test_no_D2'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_D2', 'testNameD', 'testSurnameD')")
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.deleteQuery(sql, "invalid", "invalid")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("Invalid request.");
                            })
                            .then(() => {
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query(sql).catch((err) => {
                                    printSetupError(err);
                                })
                                .then(() => {
                                    database1.close();
                                });
                            });
                        });
            });
        });

        describe("> Delete single entry, valid arguments, invalid SQL", () => {
            it("Should return an SQL error message.", (done) => {
                const sql = "DELETE FROM Patient WHERE invalid = 'test_no_D3'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_D3', 'testNameD', 'testSurnameD')")
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.deleteQuery(sql, "Patient", "test_no_D3")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("SQL Error");
                            })
                            .then(() => {
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query("DELETE FROM Patient WHERE patient_no = 'test_no_D3'").catch((err) => {
                                    printSetupError(err);
                                })
                                .then(() => {
                                    database1.close();
                                });
                            });
                        });
            });
        });

        describe("> Delete single entry, invalid arguments, invalid SQL", () => {
            it("Should reject the request.", (done) => {
                const sql = "DELETE FROM Patient WHERE invalid = 'test_no_D4'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_D4', 'testNameD', 'testSurnameD')")
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.deleteQuery(sql, "Patient", "invalid")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("Invalid request.");
                            })
                            .then(() => {
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query("DELETE FROM Patient WHERE patient_no = 'test_no_D4'").catch((err) => {
                                    printSetupError(err);
                                })
                                .then(() => {
                                    database1.close();
                                });
                            });
                        });
            });
        });

        describe("> Attempt to delete entry that is being edited", () => {
            it("Should reject the request.", (done) => {
                const sql = "DELETE FROM Patient WHERE patient_no = 'test_no_D5'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_D5', 'testNameD', 'testSurnameD')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setMinutes(nowDate.getMinutes() + 30);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                        "('test_token_D', 'Patient', 'test_no_D5', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.deleteQuery(sql, "Patient", "test_no_D5")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("Invalid request.");
                            })
                            .then(() => {
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query(sql)
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE token = 'test_token_D'")
                                    .catch((err) => {
                                        printSetupError(err);
                                    });
                                })
                                .catch((err) => {
                                    printSetupError(err);
                                })
                                .then(() => {
                                    database1.close();
                                });
                            });
                        });
            });
        });

        describe("> Attempt to delete entry that is being edited, but the token has expired", () => {
            it("Should return no error.", (done) => {
                const sql = "DELETE FROM Patient WHERE patient_no = 'test_no_D6'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_D6', 'testNameD', 'testSurnameD')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setSeconds(nowDate.getSeconds() - 1);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                        "('test_tokenD', 'Patient', 'test_no_D6', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.deleteQuery(sql, "Patient", "test_no_D6")
                            .then((result) => {
                                expect(result.status).to.equal("OK");
                                expect(result.response.query).to.equal("OK");
                                expect(result.response.affectedRows).to.equal(1);
                            })
                            .then(() => {
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query(sql)
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE token = 'test_tokenD'")
                                    .catch((err) => {
                                        printSetupError(err);
                                    });
                                })
                                .catch((err) => {
                                    printSetupError(err);
                                })
                                .then(() => {
                                    database1.close();
                                });
                            });
                        });
            });
        });

        /*describe("> description", () => {
            it("Should return ...", (done) => {
                const sql = "[query]";

                db_controller.selectQuery(sql)
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
        });*/
    });

    describe("Test updateQuery() function:", () => {

    });

    describe("Test requestEditing() function:", () => {

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

