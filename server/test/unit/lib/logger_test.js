const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const rewire = require('rewire');
const json_controller = require('./../../../lib/json-parser');

const getJSONStub = sinon.stub(json_controller, "getJSON");
const outpath = __dirname.split("server")[0] + "server/logs";

getJSONStub.callsFake(function () {
    return {
        "compact": true,
        "timeStamp": true,
        "consoleOutput": true,
        "fileOutput": true,
        "colorize": true,
        "outputFilePath": outpath
    };
})

const logger = rewire('./../../../lib/logger', false);
logger.__set__("writeStream", null);

describe("Test logger module functionalities", () => {
    beforeEach(()=>{
        logger.__get__("initialise")();
    })

    const commands = ["LOG", "INFO", "WARNING", "ERROR", "DEBUG"];
    for (const c in commands) {
        const command = commands[c];
        it(`should log ${command} successfully when given a non-existent path`, async () => {
            callCommand(command, logger, "test");


            await sleep(10)

            let lastLine = "";
            let done = false;
            getLastLineOfFile(logger.__get__("logPath"), 1).then((ll) => {
                lastLine = ll;
                done = true;
            });

            while (!done) {
                await sleep(5);
            }
            lastLine.should.contain("test")
            lastLine.should.contain(command)

        });
    }

    it('should log with level LOG when createLog is called with null level', async () => {
        logger.createLog(["test"], null)
        let lastLine = "";
        let done = false;
        getLastLineOfFile(logger.__get__("logPath"), 1).then((ll) => {
            lastLine = ll;
            done = true;
        });

        while (!done) {
            await sleep(10);
        }
        lastLine.should.contain("test")
        lastLine.should.contain("LOG")
    });

    after(()=>{logger.deleteLogFile()})

});


getJSONStub.restore();
logger.deleteLogFile();

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


/**
 * Await for this function to pause execution for a certain time.
 *
 * @param {number} ms Time in milliseconds
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
