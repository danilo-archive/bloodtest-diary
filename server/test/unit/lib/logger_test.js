const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const rewire = require('rewire');
const mock_fs = require('mock-fs');
let logger = rewire('./../../../lib/logger', false);
beforeEach(() => {
    logger = rewire('./../../../lib/logger', false);
    logger.changeOption("fileOutput", true);
    logger.changeOption("consoleOutput", false);
});

describe("Test if module can fetch options for logging", () => {
    afterEach(() => {
        logger.deleteLogFile();
    });
    it('should log successfully when given a non-existent path', () => {

        const json_controller = require('./../../../lib/json-controller');
        const getJSONStub = sinon.stub(json_controller, "getJSON");
        getJSONStub.callsFake(function () {
            return null;
        })
        const initialise = logger.__get__("initialise");
        initialise("test");
        logger.log("test")
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("test");
        })
        logger.deleteLogFile();
        getJSONStub.restore();
    });
    it('should log successfully when given an existent path', () => {
        const json_controller = require('./../../../lib/json-controller');
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
        logger.log("test")
        getLastLineOfFile(logger.__get__("logPath"), 1).then((lastLine) => {
            lastLine.should.contain("test");
        })
        logger.deleteLogFile();
        getJSONStub.restore();
    });
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

