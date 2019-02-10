const chai = require('chai');
const should = chai.should();
const mock_fs = require('mock-fs');

const json_controller = require('../../../lib/json-controller');


/**
 * Test if the getJSON returns the content of a file
 */
describe("Read JSON files", function () {
    it('should return a json object', function () {
        //create valid json file
        mock_fs({
            'test': {
                'test.json': `{
                        "port" : 4200,
                        "staticFolder" : "/public",
                        "indexFile" : "index.html"
                    }`
            }
        });
        
        const obj = json_controller.getJSON('test/test.json');
        const expected_result = {
            "port": 4200,
            "staticFolder": "/public",
            "indexFile": "index.html"
        }
        obj.should.deep.equal(expected_result);
    });

    it('should not find the file and return null', function () {
        const obj = json_controller.getJSON('test/other_test.json');
        should.not.exist(obj);
    });

    it('should return null because file is not json', function () {
        //create file which does not use json format
        mock_fs({
            'test': {
                'test_not_json.json': `this is not a JSON file`
            }
        });

        const obj = json_controller.getJSON('test/test_not_json.json');
        should.not.exist(obj);
    })
});
