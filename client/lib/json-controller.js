/**
 * Controller functions for json files reading and writing
 * @module json-controller
 * @author Danilo Del Busso
 * @version 0.0.1
 */

const fs = require('fs');
/**
    * Returns the content of the JSON file
    * @param {string} path The absolute path of the config file
    * @returns {json} The config in JSON format
    * @example <caption>Example usage of getJSON.</caption>
    * getJSON(__dirname + '/config.json')
    */
function getJSON(path) {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        try {
            const json = JSON.parse(data);
            return json;
        } catch (e) {
            console.error(`The file at ${path} is not in JSON format`);
            return null;
        }
    } else {
        console.error(`There is no JSON file at ${path}`)
        return null;
    }
}
module.exports = {
    getJSON
}

