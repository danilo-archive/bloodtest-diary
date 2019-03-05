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
const db_controller = require("../../../../lib/db_controller/db-controller");

// These are needed for setting up a testing environment.
const databaseConfig = require("../../../../config/database");
const Database = require("../../../../lib/db_controller/Database");
const dateFormat = require("dateformat");

describe("Test main DB controller behaviour:", () => {

    describe("Test selectQuery() function:", () => {

        // Setup environment.
        let test_hos_id = 0;
        before(async () => {
            const database = new Database(databaseConfig);
            
            await database.query("INSERT INTO Hospital (hospital_name, hospital_email) VALUES ('Test Lab 123_S', 'test@email')")
                        .then((result) => {
                            test_hos_id = result.insertId;
                        })
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname, hospital_id) " +
                                "VALUES ('test_no_S', 'testName', 'testSurname', '" + test_hos_id + "')")
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('test_no_S2', 'testName2', 'testSurname2')")
                        .catch((err) => {
                            printSetupError(err);
                        });
            let nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 30);
            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
            await database.query("INSERT INTO TokenControl " + 
                                "VALUES ('test_token_S', 'Patient', 'test_no_S2', " + expires + ")")
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
                    expect(result.response.rows[0].hospital_id).to.equal(test_hos_id);
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

        describe("> Select with a join Patient-Hospital", () => {
            it("Should return one entry.", (done) => {
                const sql = "SELECT * FROM Patient NATURAL JOIN Hospital " +
                            "WHERE patient_no = 'test_no_S'";

                db_controller.selectQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.rows.length).to.equal(1);
                    expect(result.response.rows[0].patient_no).to.equal("test_no_S");
                    expect(result.response.rows[0].patient_name).to.equal("testName");
                    expect(result.response.rows[0].patient_surname).to.equal("testSurname");
                    expect(result.response.rows[0].hospital_id).to.equal(test_hos_id);
                    expect(result.response.rows[0].hospital_name).to.equal("Test Lab 123_S");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Select with a join Patient-Hospital, but invalid SQL", () => {
            it("Should return an error message.", (done) => {
                const sql = "SELECT * FROM Patient NATURAL JOIN Hospital " +
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
                    expect(result.response.rows[0].hospital_id).to.equal(test_hos_id);
                    expect(result.response.rows[1].patient_no).to.equal("test_no_S2");
                    expect(result.response.rows[1].patient_name).to.equal("testName2");
                    expect(result.response.rows[1].patient_surname).to.equal("testSurname2");
                    expect(result.response.rows[1].hospital_id).to.equal(null);
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
                    expect(result.response.rows[0].hospital_id).to.equal(null);
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

            await database.query("DELETE FROM Hospital WHERE hospital_id = " + test_hos_id)
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
                            "(patient_no, patient_nam, patient_surname) " + // wrong spelling on purpose
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
                let error = undefined;
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
                    .catch((err) => {
                        error = err;
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
                                                })
                                                .then(() => {
                                                    if (error) done(error);
                                                    else done();
                                                });
                    });
                })
                .catch((err) => {
                    done(err);
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
                            "VALUES ('test_no_I3', 'testName_I3', 'testSurname_I3') " + // missing comma on purpose
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
                const sql = "INSERT INTO Hospital (hospital_name, hospital_email) " +
                            "VALUES ('Test_lab_INS', 'test@email')";

                let insId = 0;
                db_controller.insertQuery(sql)
                .then((result) => {
                    expect(result.status).to.equal("OK");
                    expect(result.response.query).to.equal("OK");
                    expect(result.response.affectedRows).to.equal(1);
                    expect(result.response.insertId).to.not.equal(0);
                    insId = result.response.insertId;
                })
                .then(() => {
                    const database = new Database(databaseConfig);
                    database.query("SELECT * FROM Hospital WHERE hospital_id = " + insId)
                    .then((result) => {
                        expect(result.length).to.equal(1);
                        expect(result[0].hospital_name).to.equal("Test_lab_INS");
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
                    database.query("DELETE FROM Hospital WHERE hospital_id = " + insId)
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

    });

    describe("Test updateQuery() function:", () => {

        describe("> Update single entry, valid arguments, valid SQL", () => {
            it("Should return no error message.", (done) => {
                const sql = "UPDATE Patient SET patient_name = 'U1 - updated' WHERE patient_no = 'testNo_U1'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('testNo_U1', 'testName', 'testSurname')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setMinutes(nowDate.getMinutes() + 30);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                        "('test_token_U1', 'Patient', 'testNo_U1', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.updateQuery(sql, "Patient", "testNo_U1", "test_token_U1")
                            .then((result) => {
                                expect(result.status).to.equal("OK");
                                expect(result.response.query).to.equal("OK");
                                expect(result.response.affectedRows).to.equal(1);
                                expect(result.response.changedRows).to.equal(1);
                            })
                            .then(() => {
                                const database2 = new Database(databaseConfig);
                                database2.query("SELECT * FROM Patient WHERE patient_no = 'testNo_U1'")
                                .then((result) => {
                                    expect(result.length).to.equal(1);
                                    expect(result[0].patient_name).to.equal("U1 - updated");
                                })
                                .then(() => {
                                    database2.query("SELECT * FROM TokenControl WHERE token = 'test_token_U1'")
                                    .then((result) => {
                                        expect(result.length).to.equal(0);
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
                                    database2.close();
                                });
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query("DELETE FROM Patient WHERE patient_no = 'testNo_U1'")
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE token = 'test_token_U1'")
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

        describe("> Update single entry, valid arguments, invalid SQL", () => {
            it("Should return SQL error message.", (done) => {
                const sql = "UPDATE Patient SET patient_name = invalid WHERE patient_no = 'testNo_U2'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('testNo_U2', 'testName', 'testSurname')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setMinutes(nowDate.getMinutes() + 30);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                        "('test_token_U2', 'Patient', 'testNo_U2', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.updateQuery(sql, "Patient", "testNo_U2", "test_token_U2")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("SQL Error");
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query("DELETE FROM Patient WHERE patient_no = 'testNo_U2'")
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE token = 'test_token_U2'")
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

        describe("> Update single entry, invalid arguments, valid SQL", () => {
            it("Should reject the request.", (done) => {
                const sql = "UPDATE Patient SET patient_name = 'U3 - updated' WHERE patient_no = 'testNo_U3'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('testNo_U3', 'testName', 'testSurname')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setSeconds(nowDate.getSeconds() - 1);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                        "('test_token_U3', 'Patient', 'testNo_U3', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.updateQuery(sql, "Patient", "testNo_U3", "test_token_U3")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("Invalid request.");
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query("DELETE FROM Patient WHERE patient_no = 'testNo_U3'")
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE token = 'test_token_U3'")
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

        describe("> Update single entry, invalid arguments, invalid SQL", () => {
            it("Should reject the request.", (done) => {
                const sql = "UPDATE Patient invalid patient_name = 'U3 - updated' WHERE patient_no = 'testNo_U4'";

                // prepare environment
                const database = new Database(databaseConfig);
                database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname) " +
                                "VALUES ('testNo_U4', 'testName', 'testSurname')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setSeconds(nowDate.getSeconds() + 30);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                        "('test_token_U4', 'Patient', 'testNo_U4', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.updateQuery(sql, "invalid", "testNo_U4", "test_token_U4")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("Invalid request.");
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
                                database1.query("DELETE FROM Patient WHERE patient_no = 'testNo_U4'")
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE token = 'test_token_U4'")
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

    });

    describe("Test requestEditing() function:", () => {

        describe("> Request on entry that does not exist", () => {
            // Similar tests to ensure code coverage
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("Test", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("Hospital", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("Carer", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("User", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("Patient", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("ActionLog", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
            it("Should reject the request.", (done) => {

                db_controller.requestEditing("invalid", "invalid")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Request on a valid entry", () => {
            it("Should return a token with correct validity", (done) => {
                const database = new Database(databaseConfig);
                let error = undefined;
                database.query("INSERT INTO Patient " + 
                        "(patient_no, patient_name, patient_surname) " +
                        "VALUES ('test_no_R', 'testName', 'testSurname')")
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.requestEditing("Patient", "test_no_R")
                            .then((result) => {
                                expect(result.status).to.equal("OK");

                                let nowDate = new Date();
                                nowDate.setMinutes(nowDate.getMinutes() + 30);
                                const shouldExpire = dateFormat(nowDate, "yyyymmddHHMM");

                                let tokenExpire = new Date(result.response.expires);
                                const actualExpire = dateFormat(tokenExpire, "yyyymmddHHMM");
                                expect(actualExpire).to.equal(shouldExpire);

                                const shouldStartWith = dateFormat(new Date(), "yyyymmddHHMM");
                                expect(result.response.token.startsWith(shouldStartWith)).to.be.true;
                            })
                            .catch((err) => {
                                error = err;
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
    
                                database1.query("DELETE FROM Patient WHERE patient_no = 'test_no_R'")
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE table_key = 'test_no_R'")
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
                            })
                            .then(() => {
                                if (error) done(error);
                                else done();
                            });
                        });
            });
        });

        describe("> Request on a valid entry that is being edited", () => {
            it("Should reject the request", (done) => {
                const database = new Database(databaseConfig);
                let error = undefined;
                database.query("INSERT INTO Patient " + 
                        "(patient_no, patient_name, patient_surname) " +
                        "VALUES ('test_no_R1', 'testName', 'testSurname')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setMinutes(nowDate.getMinutes() + 30);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                    "('token_R', 'Patient', 'test_no_R1', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.requestEditing("Patient", "test_no_R1")
                            .then((result) => {
                                expect(result.status).to.equal("ERR");
                                expect(result.err.type).to.equal("Invalid request.");
                            })
                            .catch((err) => {
                                error = err;
                            });
                        })
                        .then(() => {
                            const database1 = new Database(databaseConfig);

                            database1.query("DELETE FROM Patient WHERE patient_no = 'test_no_R1'")
                            .then(() => {
                                database1.query("DELETE FROM TokenControl WHERE token = 'token_R'")
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
                        })
                        .then(() => {
                            if (error) done(error);
                            else done();
                        });
            });
        });

        describe("> Request on a valid entry with expired token", () => {
            it("Should return a token with correct validity, previous token should be deleted.", (done) => {
                const database = new Database(databaseConfig);
                let error = undefined;
                database.query("INSERT INTO Patient " + 
                        "(patient_no, patient_name, patient_surname) " +
                        "VALUES ('test_no_R2', 'testName', 'testSurname')")
                        .then(() => {
                            let nowDate = new Date();
                            nowDate.setMinutes(nowDate.getMinutes() - 30);
                            const expires = dateFormat(nowDate, "yyyymmddHHMMss");
                            database.query("INSERT INTO TokenControl VALUES " +
                                    "('token_R2', 'Patient', 'test_no_R2', " + expires + ")")
                        })
                        .catch((err) => {
                            printSetupError(err);
                        })
                        .then(() => {
                            database.close();
                        })
                        .then(() => {
                            db_controller.requestEditing("Patient", "test_no_R2")
                            .then((result) => {
                                expect(result.status).to.equal("OK");

                                let nowDate = new Date();
                                nowDate.setMinutes(nowDate.getMinutes() + 30);
                                const shouldExpire = dateFormat(nowDate, "yyyymmddHHMM");

                                let tokenExpire = new Date(result.response.expires);
                                const actualExpire = dateFormat(tokenExpire, "yyyymmddHHMM");
                                expect(actualExpire).to.equal(shouldExpire);

                                const shouldStartWith = dateFormat(new Date(), "yyyymmddHHMM");
                                expect(result.response.token.startsWith(shouldStartWith)).to.be.true;
                            })
                            .then(() => {
                                // previous token should be deleted
                                const database2 = new Database(databaseConfig);
                                database2.query("SELECT * FROM TokenControl WHERE token = 'token_R2'")
                                .then((result) => {
                                    expect(result.length).to.equal(0);
                                })
                                .catch((err) => {
                                    error = err;
                                })
                                .then(() => {
                                    database2.close();
                                });
                            })
                            .catch((err) => {
                                error = err;
                            })
                            .then(() => {
                                const database1 = new Database(databaseConfig);
    
                                database1.query("DELETE FROM Patient WHERE patient_no = 'test_no_R2'")
                                .then(() => {
                                    database1.query("DELETE FROM TokenControl WHERE table_key = 'test_no_R2'")
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
                            })
                            .then(() => {
                                if (error) done(error);
                                else done();
                            });
                        });
            });
        });


    });

    describe("Test refreshToken() function:", () => {
        
        describe("> Refresh an invalid token", () => {
            it("Should return an error message." , (done) => {
                db_controller.refreshToken("Patient", "1", "invalid token")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Refresh a valid token", () => {
            it("Should return a new token." , (done) => {
                const database = new Database(databaseConfig);
                let date = new Date();
                date.setMinutes(date.getMinutes() + 10);
                let expires = dateFormat(date, "yyyymmddHHMMss");
                database.query("INSERT INTO TokenControl VALUES " + 
                    "('ref_token', 'Patient', 'rand_id', '" + expires + "')")
                    .catch((err) => {
                        printSetupError(err);
                    })
                    .then(() => {
                        database.close();
                        let error = undefined;
                        db_controller.refreshToken("Patient", "rand_id", "ref_token")
                        .then((result) => {
                            expect(result.status).to.equal("OK");
                            let nowDate = new Date();
                            nowDate.setMinutes(nowDate.getMinutes() + 30);
                            const shouldExpire = dateFormat(nowDate, "yyyymmddHHMM");

                            let tokenExpire = new Date(result.response.expires);
                            const actualExpire = dateFormat(tokenExpire, "yyyymmddHHMM");
                            expect(actualExpire).to.equal(shouldExpire);

                            const shouldStartWith = dateFormat(new Date(), "yyyymmddHHMM");
                            expect(result.response.token.startsWith(shouldStartWith)).to.be.true;
                        })
                        .catch((err) => {
                            error = err;
                        })
                        .then(() => {
                            // check if previous token has been deleted
                            const database1 = new Database(databaseConfig);
                            database1.query("SELECT * FROM TokenControl WHERE table_name = 'Patient' AND table_key = 'rand_id'")
                            .then((result) => {
                                console.log(result);
                                expect(result.length).to.equal(1);
                            })
                            .catch((err) => {
                                error = err;
                            })
                            .then(() => {
                                // clean DB
                                database1.query("DELETE FROM TokenControl WHERE table_name = 'Patient' AND table_key = 'rand_id'")
                                .catch((err) => {
                                    error = err;
                                }).then(() => {
                                    database1.close();
                                    if (error) done(error);
                                    else done();
                                });
                            });
                        });
                    });
            });
        });

        describe("> Refresh an expired token", () => {
            it("Should return an error message." , (done) => {
                const database = new Database(databaseConfig);
                let date = new Date();
                date.setMinutes(date.getMinutes() - 10);
                let expires = dateFormat(date, "yyyymmddHHMMss");
                database.query("INSERT INTO TokenControl VALUES " + 
                    "('ref2_token', 'Patient', 'rand_id2', '" + expires + "')")
                    .catch((err) => {
                        printSetupError(err);
                    })
                    .then(() => {
                        database.close();
                        let error = undefined;
                        db_controller.refreshToken("Patient", "rand_id2", "ref2_token")
                        .then((result) => {
                            expect(result.status).to.equal("ERR");
                            expect(result.err.type).to.equal("Invalid request.");
                        })
                        .catch((err) => {
                            error = err;
                        })
                        .then(() => {
                            // check if previous token has been deleted
                            const database1 = new Database(databaseConfig);
                            database1.query("SELECT * FROM TokenControl WHERE table_name = 'Patient' AND table_key = 'rand_id2'")
                            .then((result) => {
                                console.log(result);
                                expect(result.length).to.equal(0);
                            })
                            .catch((err) => {
                                error = err;
                            })
                            .then(() => {
                                // clean DB
                                database1.query("DELETE FROM TokenControl WHERE table_name = 'Patient' AND table_key = 'rand_id2'")
                                .catch((err) => {
                                    error = err;
                                }).then(() => {
                                    database1.close();
                                    if (error) done(error);
                                    else done();
                                });
                            });
                        });
                    });
            });
        });

    });

    describe("Test cancelEditing() function:", () => {
        
        describe("> Cancel with an invalid token", () => {
            it("Should return an error message." , (done) => {
                db_controller.cancelEditing("Patient", "1", "invalid token")
                .then((result) => {
                    expect(result.status).to.equal("ERR");
                    expect(result.err.type).to.equal("Invalid request.");
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });

        describe("> Cancel with a valid token", () => {
            it("Should delete that token." , (done) => {
                const database = new Database(databaseConfig);
                let date = new Date();
                date.setMinutes(date.getMinutes() + 10);
                let expires = dateFormat(date, "yyyymmddHHMMss");
                database.query("INSERT INTO TokenControl VALUES " + 
                    "('ref3_token', 'Patient', 'rand_id3', '" + expires + "')")
                    .catch((err) => {
                        printSetupError(err);
                    })
                    .then(() => {
                        database.close();
                        let error = undefined;
                        db_controller.cancelEditing("Patient", "rand_id3", "ref3_token")
                        .then((result) => {
                            expect(result.status).to.equal("OK");
                            expect(result.response).to.equal("Editing successfully cancelled.");
                        })
                        .catch((err) => {
                            error = err;
                        })
                        .then(() => {
                            // check if previous token has been deleted
                            const database1 = new Database(databaseConfig);
                            database1.query("SELECT * FROM TokenControl WHERE table_name = 'Patient' AND table_key = 'rand_id3'")
                            .then((result) => {
                                console.log(result);
                                expect(result.length).to.equal(0);
                            })
                            .catch((err) => {
                                error = err;
                            })
                            .then(() => {
                                // clean DB
                                database1.query("DELETE FROM TokenControl WHERE table_name = 'Patient' AND table_key = 'rand_id3'")
                                .catch((err) => {
                                    error = err;
                                }).then(() => {
                                    database1.close();
                                    if (error) done(error);
                                    else done();
                                });
                            });
                        });
                    });
            });
        });

    });

    describe("Test improper use of query functions:", () => {

        describe("> Improper use of selectQuery", () => {
            it("Should throw an Error", (done) => {
                const sql = "updAte ...";

                db_controller.selectQuery(sql)
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
        });

        describe("> Improper use of insertQuery", () => {
            it("Should throw an Error", (done) => {
                const sql = "     SELECT ...";

                db_controller.insertQuery(sql)
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
        });

        describe("> Improper use of deleteQuery", () => {
            it("Should throw an Error", (done) => {
                const sql = "SELECT ...";

                db_controller.deleteQuery(sql, 'Patient', 'id')
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
            it("Should throw an Error", (done) => {
                const sql = "DELETE ...";

                db_controller.deleteQuery(sql, 'Test')
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
        });

        describe("> Improper use of updateQuery", () => {
            it("Should throw an Error", (done) => {
                const sql = "SELECT ...";

                db_controller.updateQuery(sql, "Patient", "id", "token")
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
            it("Should throw an Error", (done) => {
                const sql = "UPDATE ...";

                db_controller.updateQuery(sql, "Patient", "id")
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
        });

        describe("> Improper use of requestEditing", () => {
            it("Should throw an Error", (done) => {
                db_controller.requestEditing('Patient')
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
        });
        describe("> Improper use of refreshToken", () => {
            it("Should throw an Error", (done) => {
                db_controller.refreshToken('Patient', "entry")
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
        });
        describe("> Improper use of cancelEditing", () => {
            it("Should throw an Error", (done) => {
                db_controller.cancelEditing('Patient', "entry")
                .then((result) => {
                    done(new Error("Did not throw an error for improper use."))
                })
                .catch((err) => {
                    done();
                });
            });
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

