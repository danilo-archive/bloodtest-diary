const csvFilePath = './patients.csv';
const csv = require('csvtojson');

/**
 * Take a JSON object and return the keys of such object as an array
 * @param {JSON} object: the JSON to collect the names from
 * @return {JSON}: the names as an array
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

function generateInsertionQuery(tableName, records, values){
    let query = `INSERT INTO ${tableName} ${records} VALUES`;
    for(const entry of values){
        query += ` ${entry},`;
    }
    query = `${query.slice(0,-1)};`;
    console.log(query);
}

function convert(){
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
        console.log(tableName);
        console.log(recordNames);
        console.log(entries);
    });
}
 
convert();

// Async / await usage
//const jsonArray = await csv().fromFile(csvFilePath);