const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const rewire = require('rewire');

let logger = rewire('./../../../lib/logger', false);
beforeEach(() => {
    logger = rewire('./../../../lib/logger', false);
    logger.changeOption("fileOutput", true);
    logger.changeOption("consoleOutput", false);
});

describe("Test logger module functionalities", () => {
    afterEach(() => {
        logger.deleteLogFile();
    });

    const commands = ["LOG", "INFO", "WARNING", "ERROR", "DEBUG"];
    for (const c in commands) {
        const command = commands[c];
        it(`should log ${command} successfully when given a non-existent path`, () => {

            const json_controller = require('./../../../lib/json-parser');
            const getJSONStub = sinon.stub(json_controller, "getJSON");
            getJSONStub.callsFake(function () {
                return null;
            })
            const initialise = logger.__get__("initialise");
            initialise("test");
            callCommand(command, logger, "test");

            getJSONStub.restore();
        });
        it(`should log ${command} successfully when given an existent path`, () => {
            const json_controller = require('./../../../lib/json-parser');
            const getJSONStub = sinon.stub(json_controller, "getJSON");
            getJSONStub.callsFake(function () {
                return {
                    "compact": true,
                    "timeStamp": true,
                    "consoleOutput": true,
                    "fileOutput": true,
                    "colorize": true,
                    "outputFilePath": "./../logs/"
                };
            })
            const initialise = logger.__get__("initialise");
            initialise("./../logs/");
            callCommand(command, logger, "test");
            getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
                lastLine.should.contain("test");
                lastLine.should.contain(command)
            })
            getJSONStub.restore();
        });
    }

    it('should log with level LOG when createLog is called with null level', () => {
        const json_controller = require('./../../../lib/json-parser');
        const getJSONStub = sinon.stub(json_controller, "getJSON");
        getJSONStub.callsFake(function () {
            return {
                "compact": true,
                "timeStamp": true,
                "consoleOutput": true,
                "fileOutput": true,
                "colorize": true,
                "outputFilePath": "./../logs/"
            };
        })
        const initialise = logger.__get__("initialise");
        initialise("./../logs/");
        const createLog = logger.__get__("createLog");
        createLog(["test"], null)
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("test");
            lastLine.should.contain("LOG")
        })
        getJSONStub.restore();
    })


    it('should log with level LOG when createLog is called with undefined level', () => {
        const json_controller = require('./../../../lib/json-parser');
        const getJSONStub = sinon.stub(json_controller, "getJSON");
        getJSONStub.callsFake(function () {
            return {
                "compact": true,
                "timeStamp": true,
                "consoleOutput": true,
                "fileOutput": true,
                "colorize": true,
                "outputFilePath": "./../logs/"
            };
        })
        const initialise = logger.__get__("initialise");
        initialise("./../logs/");
        const createLog = logger.__get__("createLog");
        createLog(["test"], undefined)
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("test");
            lastLine.should.contain("LOG")
        })
        getJSONStub.restore();

    })

    // TODO: needs fixing
    it('should be able to create options even when output directory string does not have a / at the end', () => {
        const json_controller = require('./../../../lib/json-parser');
        const getJSONStub = sinon.stub(json_controller, "getJSON");
        getJSONStub.callsFake(function () {
            return {
                "compact": true,
                "timeStamp": true,
                "consoleOutput": true,
                "fileOutput": true,
                "colorize": true,
                "outputFilePath": "./../logs"
            };
        })
        const initialise = logger.__get__("initialise");
        initialise("./../logs/");
        const createLog = logger.__get__("createLog");
        logger.changeOption("consoleOutput", false);

        createLog(["test"], undefined)
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("test");
            lastLine.should.contain("LOG")
        })
        getJSONStub.restore();
    })

    it('should be able to create options even when they are null when calling createLog()', () => {
        const json_controller = require('./../../../lib/json-parser');
        const getJSONStub = sinon.stub(json_controller, "getJSON");
        getJSONStub.callsFake(function () {
            return {
                "compact": true,
                "timeStamp": true,
                "consoleOutput": true,
                "fileOutput": true,
                "colorize": true,
                "outputFilePath": "./../logs"
            };
        })
        const initialise = logger.__get__("initialise");
        initialise("./../logs/");

        const createLog = logger.__get__("createLog");
        logger.__set__("options", null)  //manually setting options to null
        logger.changeOption("consoleOutput", false);

        createLog(["test"], "LOG")
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("test");
            lastLine.should.contain("LOG")
        })
        getJSONStub.restore();
    })

    it('should send an error to the log when the messages array is undefined', () => {
        const json_controller = require('./../../../lib/json-parser');
        const getJSONStub = sinon.stub(json_controller, "getJSON");
        getJSONStub.callsFake(function () {
            return {
                "compact": true,
                "timeStamp": true,
                "consoleOutput": true,
                "fileOutput": true,
                "colorize": true,
                "outputFilePath": "./../logs"
            };
        })
        const initialise = logger.__get__("initialise");
        initialise("./../logs/");
        logger.__set__("options", null)  //manually setting options to null
        logger.changeOption("consoleOutput", false);
        const createLog = logger.__get__("createLog");
        createLog(undefined, undefined)
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("Log failed with messages array:");
            lastLine.should.contain("ERROR")
        })
        getJSONStub.restore();
    })

});

after(() => { //remove the logs folder
    const fs = require('fs');
    logger.deleteAllLogFiles();
    if (fs.existsSync('./../logs'))
        fs.rmdirSync('./../logs');
})

/**
|--------------------------------------------------------------------------
| HELPER FUNCTIONS
|--------------------------------------------------------------------------
*/
/**
 * Return the last line of a file. 
 * Adapted from https://bit.ly/2Hz2lPO.
 * @param {string} fileName the path of the file to read
 */
function getLastLineOfFile(fileName) {
    const readline = require('readline');
    const Stream = require('stream');
    const fs = require('fs');

    const inStream = fs.createReadStream(fileName);
    const outStream = new Stream;
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface(inStream, outStream);

        let lastLine = '';
        rl.on('line', function (line) {
            if (line.length >= 1)
                lastLine = line;
        });

        rl.on('error', reject)

        rl.on('close', function () {
            resolve(lastLine)
        });
    })
}

/**
 * Call a logger command
 * @param {string} command the command to call
 * @param {JSON} logger the logger module object
 */
function callCommand(command, logger, message) {
    switch (command) {
        case "INFO":
            logger.info(message);
            break;
        case "ERROR":
            logger.error(message);
            break;
        case "WARNING":
            logger.warning(message);
            break;
        case "DEBUG":
            logger.debug(message);
            break;
        default:
            logger.log(message);
            break;
    }
}
