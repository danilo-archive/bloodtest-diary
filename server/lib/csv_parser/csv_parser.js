/**
 * This module parses csv files into insertion queries
 * @module csv-reader
 * @author Alessandro Amantini
 * @version 0.0.2
 */

const csv = require('csvtojson');
const fs = require('fs');

/**
 * Take a csv as JSON and return the title of the table and
 * the records names. In order to work, the title has to be the 
 * very first column in the csv.
 * @param {JSON} object: the JSON to collect the names from
 * @return {JSON}: table name and record names as, respectively,
 *  tableName and recordNames
 */
function getJSONKeys(object){
    const recordNames = [];
    let tableName;
    for(const recordName in object){
        if(!tableName){
            tableName = recordName;
        }else if(object[recordName]){
            recordNames.push(recordName);
        }
    }
    return {tableName: tableName,
            recordNames: recordNames};
}

/**
 * Take a JSON and return the values contained as an array.
 * Only the values contained in the variable 'keys' will be
 * parsed.
 * @param {JSON} object: the JSON to collect the values from
 * @param {string[]} keys: the JSON keys
 * @return {string[]}: the values as an array
 */
function getJSONValues(object, keys){
    const values = [];
    for (const key of keys) {
        values.push(object[key]);
    }
    return values;
}

/**
 * Take an array and convert it into a string. Put the 'before' and 
 * 'after' characters around each element and separate them using the
 * 'separator' character. By default, separator is a comma ",", whereas
 * 'before' and 'after' are both a single quote "'".
 * 
 * @param {Object[]} array: array to be converted into a string
 * @param {string} separator: the character between each element.
 *  By default is a comma
 * @param {string} before: the character preceding each element.
 *  By default a single quote
 * @param {string} after: the character next each element. By default
 *  a single quote
 */
function arrayToString(array, separator = ",", before = "'", after = "'"){
    let stringToReturn = "";
    for(const element of array){
        stringToReturn += (before + element + after + separator);
    }
    stringToReturn = `${stringToReturn.slice(0,-1)}`;
    return stringToReturn;
}

/**
 * Take the name of the database table and fields, plus some
 * entries and covert them all into an insertion query.
 * @param {string} tableName: the name of the database table
 * @param {string} fields: the name of the database columns
 * @param {string} value: an entry as string respecting the order
 *  dictated by 'records'
 * @param {string} insertSqlFile: path of the insert sql file
 */
function generateInsertionQuery(tableName, fields, value, insertSqlFile){
    let query = `INSERT INTO ${tableName} (${fields}) VALUES`;
    query += ` (${value});\n`;
    fs.appendFileSync(insertSqlFile, query, (err) => {
        if (err) throw err;
    });
}


/**
 * Take the path of a csv file, parse it, and put into the insertion sql
 * file passed as path
 * @param {string} csvFilePath: the path of the csv file 
 * @param {string} insertSqlFile: path of the insert sql file
 */
function convert(csvFilePath, insertSqlFile){
    csv()
    .fromFile(csvFilePath)
    .then((data)=>{
        const table = getJSONKeys(data[0]);
        const tableName = table['tableName'];
        const recordNames = table['recordNames'];
        const entries = [];
        for(let i = 0; i < data.length; i++){
            const entry = data[i];
            entries.push(getJSONValues(entry, recordNames));
        }
        const recordNamesAsString = arrayToString(recordNames);
        const entriesAsString = [];
        for(const entry of entries){
            entriesAsString.push(arrayToString(entry,",","",""));
        }
        for(let i = 0; i < entriesAsString.length; ++i){
            generateInsertionQuery(tableName, recordNamesAsString, entriesAsString[i], insertSqlFile);
        } 
    });
};

module.exports = {
    convert
};