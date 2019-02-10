/**
 * Controller functions for json files reading and writing
 * @module json-controller
 * @author Danilo Del Busso
 * @version 0.0.1
 */

const fs = require('fs');

module.exports = {
    /**
     * Returns the content of the JSON file
     * @param {string} path The absolute path of the config file
     * @returns {json} The config in JSON format
     * @example <caption>Example usage of getJSON.</caption>
     * getJSON(__dirname + '/config.json')
     */
    getJSON: function (path) {
        if (fs.existsSync(path)) {
            let data = fs.readFileSync(path);
            let json = JSON.parse(data);
            return json;
        }else{
            console.error(`There is no JSON file at ${path}`)
        }
    }
}