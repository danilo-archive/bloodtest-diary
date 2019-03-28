/**
 * Call the csv files and parse them into concrete
 * sql queries.
 * @module sql-insertion-config
 * @author Alessandro Amantini
 * @version 0.0.1
 */

const fs = require('fs');
const parser = require('./csv-reader');

//Change this according to the path of the csv files
const PATH_CSV_FILES = './';

//The paths of the csv files to parse. 
//Don't change the order of the files to be parsed!!
const dataToInsertAsCsv = [`${PATH_CSV_FILES}user.csv`,
                           `${PATH_CSV_FILES}hospital.csv`,
                           `${PATH_CSV_FILES}carer.csv`,
                           `${PATH_CSV_FILES}patient.csv`,
                           `${PATH_CSV_FILES}test.csv`];

//The path of the insert.sql
const PATH_INSERT_FILE = '../insert.sql';
const insertSqlHeader = `
USE BloodTestDB;

DELETE FROM Test;
DELETE FROM Patient;
DELETE FROM Carer;
DELETE FROM Hospital;
DELETE FROM TokenControl;
DELETE FROM ActionLog;
DELETE FROM User;

`;

/**
 * Generate the header of the file, this will not change with the
 * entries, but but can be changed in case of table structures changes
 */
fs.writeFileSync(PATH_INSERT_FILE, insertSqlHeader, function (err) {
    if (err) throw err;
}); 

/**
 * Insert the entries
 */
for(table of dataToInsertAsCsv){
    parser.convert(table, PATH_INSERT_FILE);
}