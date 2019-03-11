const csv = require('csvtojson');

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
 * @param {string[]} values: a collection of database entries as strings
 *  respecting the order dictated by 'records'
 */
function generateInsertionQuery(tableName, fields, values){
    let query = `INSERT INTO ${tableName} (${fields}) VALUES`;
    for(const value of values){
        query += ` (${value}),`;
    }
    query = `${query.slice(0,-1)};`;
    console.log(query);
}

/**
 * Take the path of a csv and 
 * @param {string} csvFilePath: the path of the csv file 
 */
function convert(csvFilePath){
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
            entriesAsString.push(arrayToString(entry,",","'","'"));
        }
        generateInsertionQuery(tableName, recordNamesAsString, entriesAsString);
    });
}
 
convert('./patients.csv');

// Async / await usage
//const jsonArray = await csv().fromFile(csvFilePath);