/**
 * Controller functions for json files reading and writing
 * @module json-controller
 * @author Danilo Del Busso
 * @version 0.0.2
 */

const fs = require('fs');

/**
    * Returns the content of the JSON file
    * @param {string} path The absolute path of the config file
    * @return {json} The config in JSON format, null if the file doesn't exist or is not a properly formatted JSON object
    * @example <caption>Example usage of getJSON.</caption>
    * getJSON(__dirname + '/config.json')
    */
function getJSON(path) {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        return isJSON(data)
    } else {
        console.error(`There is no JSON file at ${path}`)
        return null;
    }
}

/**
 * Check if the data is a properly formatted JSON file
 * @param {string} data 
 * @return {JSON} null if the data was not a properly formatted JSON object, the data in JSON if otherwise
 */
function isJSON(data) {
    try {
        const json = JSON.parse(data);
        return json;
    } catch (e) {
        console.error(`The file at ${path} is not in JSON format`);
        return null;
    }
}

module.exports = {
    getJSON,
    isJSON
}
