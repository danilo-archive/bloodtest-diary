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

// These are needed in setting up a testing environment.
const mysql = require("mysql");
const databaseConfig = require("../../config/database");
const Database = require("../../lib/db_controller/Database");

describe("Test main DB controller behaviour:", () => {
    describe("Test selectQuery() function:", () => {

        // Setup environment.
        let test_lab_id = 0;
        before(async () => {
            const database = new Database(databaseConfig);
            
            await database.query("INSERT INTO Laboratory (lab_name) VALUES ('Test Lab 123')")
                        .then((result) => {
                            test_lab_id = result.insertId;
                        })
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.query("INSERT INTO Patient " + 
                                "(patient_no, patient_name, patient_surname, preferred_lab) " +
                                "VALUES ('test_no', 'testName', 'testSurname', '" + test_lab_id + "')")
                        .catch((err) => {
                            printSetupError(err);
                        });
            await database.close();            
        });
        
        it("waiting");

        after(async () => {
            const database = new Database(databaseConfig);

            await database.query("DELETE FROM Patient WHERE patient_no = 'test_no'")
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