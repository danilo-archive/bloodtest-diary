/** 
 * A logger module, it allows for different levels of logging
 * and to save a log file and/or output the log to console.
 * @module logger
 * @author Danilo Del Busso
 * @version 0.0.2
 */

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
    log,
    info,
    error,
    warning,
    debug,
    changeOption,
    deleteLogFile,
    deleteAllLogFiles
}

const jsonController = require('./json-parser.js');
const CONFIG_FILE_PATH = __dirname + '/../config/logger.json'
const fs = require('fs');
const dateformat = require('dateformat');
let writeStream = null;
let logPath = "";


const colors = {  //all colors are without background. usage: console.log(colors.Red, "string to display colorized") or replace the "%s" with the string that has to be colored
    Black: "\x1b[30m%s\x1b[0m",
    Red: "\x1b[31m%s\x1b[0m",
    Green: "\x1b[32m%s\x1b[0m",
    Yellow: "\x1b[33m%s\x1b[0m",
    Blue: "\x1b[34m%s\x1b[0m",
    Magenta: "\x1b[35m%s\x1b[0m",
    Cyan: "\x1b[36m%s\x1b[0m",
    White: "\x1b[37m%s\x1b[0m",
}
const defaultOptions = {   //default options for the use of the module
    compact: true,
    timeStamp: true,
    consoleOutput: true,
    fileOutput: true,
    colorize: true,
    outputFilePath: './../logs/'
}
let options = initialise(CONFIG_FILE_PATH); //the options used by the logger


/*
|--------------------------------------------------------------------------
| LEVELS LOGGING FUNCTIONS
|--------------------------------------------------------------------------
| This section contains all the functions which can be called to log something.
| They take in any kind and number of parameters and will display one message containing
| all the parameters' information.
| The log() function is general and does not hold any particular meaning.
*/

/**
 * Use to create a info log message. It takes any number of parameters
 */
function info() {
    createLog(argumentsToArray(arguments), "INFO")
}

/**
 * Use to create a error log message. It takes any number of parameters
*/
function error() {
    createLog(argumentsToArray(arguments), "ERROR")
}

/**
 * Use to create a warning log message. It takes any number of parameters
*/
function warning() {
    createLog(argumentsToArray(arguments), "WARNING")
}

/**
 * Use to create a debugging log message. It takes any number of parameters
*/
function debug() {
    createLog(argumentsToArray(arguments), "DEBUG")
}
/**
 * Use to create a general log message. It takes any number of parameters
*/
function log() {
    createLog(argumentsToArray(arguments), "LOG")
}


/**
|--------------------------------------------------------------------------
| LOG CREATION FUNCTIONS
|--------------------------------------------------------------------------
| This section contains all the functions that allow to generate logs both on the console
| and in a file.
| The behaviour depends on the options that are set in a config file (see CONFIG_FILE_PATH const for 
| the path of the options file.
*/

/**
 * Generate the options for the use of this module and create a write stream.
 * If the path of the config is not valid, use a set of default options.
 * @param {string} configPath the path of the config file.
 * @returns {JSON} the options for logging. 
 */
function initialise(configPath) {
    let json = jsonController.getJSON(configPath);

    if (json == null)
        json = defaultOptions;

    let outputFilePath = json.outputFilePath;
    if (outputFilePath[outputFilePath.length - 1] !== '/')  //check if the output file path is formatted as a directory
        outputFilePath += '/';
    logPath = outputFilePath + dateformat(new Date(), "yyyymmdd_HHMMss") + "_server.log";

    if (writeStream == null) {
        if (!fs.existsSync(outputFilePath))
            fs.mkdirSync(outputFilePath);

        writeStream = fs.createWriteStream(logPath, { 'flags': 'a' });
    }  //flag "a" allows for appending

    return json;
}

/**
 * Log all the strings or objects contained using the options configuration.
 * @param {array} messages the set of objects 
 * @param {string} level 
 */
function createLog(messages, level) {

    //checks for invalid parameters values
    if (options == null)
        options = initialise(CONFIG_FILE_PATH);

    if (level == null || level == undefined)
        level = "LOG";
    if (messages == undefined || !Array.isArray(messages)) {
        error(level, "Log failed with messages array:", messages);
        return;
    }

    let timeStamp = ""
    if (options.timeStamp == true)
        timeStamp = "|" + dateformat(new Date(), "yyyy-mm-dd HH-MM-ss") + "|";
    const fileOutputString = `${timeStamp} ${level} =>`;

    if (options.fileOutput == true) {
        append(`\n${fileOutputString}`)
        messages.forEach(msg => {
            append(msg);
        });
    }

    //OUTPUT TO CONSOLE

    let levelLabel = `\n<============ ${level} ============>\n`
    let logElementsSeparator = "\n";

    if (options.compact == true) {
        levelLabel = "\n" + level + ": ";
        logElementsSeparator = " ";
    }

    if (options.colorize == true) {
        let color = null;
        switch (level) {
            case "INFO":
                color = colors.Green;
                break;
            case "ERROR":
                color = colors.Red;
                break;
            case "WARNING":
                color = colors.Yellow;
                break;
            case "DEBUG":
                color = colors.Blue;
                break;
            default:
                color = colors.Magenta;
                break;
        }
        levelLabel = color.replace('%s', `${levelLabel}`);
        timeStamp = colors.Yellow.replace('%s', timeStamp);
    }

    const consoleOutputString = `${levelLabel}${timeStamp}`;

    if (options.consoleOutput == true) {
        process.stdout.write(consoleOutputString);
        messages.forEach(msg => {
            process.stdout.write(logElementsSeparator);
            typeof msg !== "string" ? console.log(msg) : process.stdout.write(msg)
        });
    }
}

/**
 * Append an element to the log file.
 * @param {Object} element the element to be appended to the log file
 */
function append(element) {
    if (writeStream == null) {
        options = initialise(CONFIG_FILE_PATH);
    }
    writeStream.write(convertToString(element) + " ");
}


/**
 * Flush the content of the log file. And delete it.
 */
function deleteLogFile() {
    if (options === null) {
        options = initialise(CONFIG_FILE_PATH);
    }
    if (fs.existsSync(logPath)) {
        fs.unlinkSync(logPath, function (err) {
            if (err) {
                return error(err)
            }
            return;
        });
    }
}
/**
 * Flush the content of every log file and delete them.
 */
function deleteAllLogFiles() {
    deleteFolderRecursive(options.outputFilePath);
}


/**
|--------------------------------------------------------------------------
| HELPER FUNCTIONS
|--------------------------------------------------------------------------
| Miscellaneous functions used for various purposes.
*/

/**
 * Change an existing option value.
 * If the option does not exist, nothing is changed.
 * If the value does not have the same type as the value that needs to be changed, nothing is changed.
 * @param {string} optionName the name of the existing options.
 * @param {Object} value the new value of the option.
 * @returns {Object} the new value of the option. null if the parameters are not valid.
 */
function changeOption(optionName, value) {
    if (options == null)
        options = initialise(CONFIG_FILE_PATH);

    if (typeof options[optionName] === typeof value) {
        options[optionName] = value;
        return options[optionName];
    }
    return null
}

/**
 * Convert any object to a string
 * If the object is a JSON file, use the stringify() function.
 * Else, use the String(obj)
 * @param {Object} obj the object to be converted to a string
 * @returns {string} the object converted to string
 */
function convertToString(obj) {
    if (typeof obj !== "string") {
        try {
            const temp = JSON.stringify(obj);
            if (temp == undefined)
                throw "Not a valid JSON object";
            return temp;
        }
        catch (err) {
            return String(obj);
        }
    }
    return obj
}

/**
 * Convert the JSON file created by calling the "arguments" variable inside a function with no parameters, to an array
 * @param {JSON} args the JSON file created by calling the "arguments" variable inside a function with no parameters7
 * @returns {array} an array containing the values of the JSON file. Empty if the args JSON was not valid.
 */
function argumentsToArray(args) {
    const array = []
    try {
        for (let i = 0; i < args.length; ++i) {
            array[i] = args[i];
        }
    }
    catch (e) { warning(e) }
    return array;
}


/**
 * Recursively and synchronously delete all files inside a path.
 * taken from https://bit.ly/2TqLDWv
 * @param {string} path 
 */
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { 
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath, function (err) {
                    if (err) {
                        return error(err);
                    }
                    return;
                });
            }
        });
        fs.rmdirSync(path);
    }
}
