/**
 * Call the csv files and parse them into concrete
 * sql queries.
 * @module sql-insertion-config
 * @author Alessandro Amantini
 * @version 0.0.1
 */

const fs = require('fs');
const parser = require('./csv-reader');

//The paths of the csv files to parse
const dataToInsertAsCsv = ['./hospital.csv',
                           './carer.csv',
                           './patient.csv',
                           './test.csv'];

//The path of the insert.sql
const insertSqlFile = './insert.sql';
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

fs.writeFileSync(insertSqlFile, insertSqlHeader, function (err) {
    if (err) throw err;
}); 

for(table of dataToInsertAsCsv){
    parser.convert(table, insertSqlFile);
}