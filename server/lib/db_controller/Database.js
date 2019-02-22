/**
 * Promisify mysql.
 * Adapted from: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
 *
 * @class Database
 */

const mysql = require("mysql");

module.exports = class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
        this.connection.beginTransaction();
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        this.connection.commit();
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
