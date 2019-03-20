/**
 * This module contains functions for user authentication and verification.
 *
 * @author Mateusz Nowak, Luka Kralj
 * @version 1.0
 * @module authenicator
 */

const crypto = require("crypto");
const tokenGenerator = require('./db_controller/token-generator');
const db_controller = require('./db_controller/db-controller');
const mysql = require('mysql');

module.exports = {
  canLogin,
  produceIterations,
  produceSalt,
  produceHash,
  verifyToken,
  registerNewUsername,
  logoutUser
};

const accessTokens = {};
const ACCESS_TOKEN_VALIDITY_DAYS = 10;
initTokens();

/**
*Function tha naively checks if user
*provided right credentials
*/
function canLogin(user, userInDatabase)
{
  if(userInDatabase==undefined)
  {
    return false;
  }
  if(userInDatabase.length!==1)
  {
    return false;
  }
  if(user.username==null||user.password==null)
  {
    return false;
  }
  if(user.username===userInDatabase[0].username)
  {
    const hash = crypto.pbkdf2Sync(user.password,userInDatabase[0].salt,userInDatabase[0].iterations,64,'sha256').toString('hex');
    if(hash==userInDatabase[0].hashed_password)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  else
  {
    return false;
  }
}

function produceIterations()
{
  const min=1000;
  const max=2000;
  const random=Math.floor(Math.random() * (+max - +min)) + +min;
  return random;
}

function produceSalt()
{
  return crypto.randomBytes(16).toString('hex');
}

function produceHash(password, iterations, salt)
{
  return crypto.pbkdf2Sync(password,salt,iterations,64,'sha256').toString('hex');
}

/**
 * Retrieves all access tokens (if any) from the database and creates a lookup table for
 * faster access.
 */
async function initTokens() {
  const res = await db_controller.selectQuery("SELECT * FROM AccessTokens");
  if (res.status !== "OK") {
    console.log("Could not initialise tokens from the DB. Response: " + JSON.stringify(res));
    return;
  }
  const rows = res.response.rows;
  for (let i = 0; i < rows.length; i++) {
    accessTokens[rows[i].token] = {
      username: rows[i].username,
      expires: rows[i].expiration
    }
  }
  console.log("Successfully loaded " + rows.length + " token(s) from the DB.");
}


/**
 * Verifies user using the accessToken.
 *
 * @param {string} accessToken Token used for identification.
 * @returns Username of the user or undefined if token is invalid.
 */
async function verifyToken(accessToken) {
  if (!(accessToken in accessTokens)) {
      return undefined;
  }
  const expires = new Date(accessTokens[accessToken].expires);
  if ((expires - new Date()) <= 0) {
      delete accessTokens[accessToken];
      db_controller.deleteAccessToken(accessToken)
        .then((res) => {
          if (res.status === "OK") {
            console.log("Access token successfully deleted.")
          }
          else {
            console.log("Error deleting access token. Response: " + JSON.stringify(res));
          }
        });
      return undefined;
  }
  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + ACCESS_TOKEN_VALIDITY_DAYS);
  accessTokens[accessToken].expires = newExpiry;
  db_controller.updateAccessToken(accessToken, newExpiry)
    .then((res) => {
      if (res.status !== "OK") {
        console.log("Error updating access token. Response: " + JSON.stringify(res));
      }
    });

  return accessTokens[accessToken].username;
}

/**
* Register the given username with a login token that is
* used in authorisation of the requests.
*
* @param {string} username A valid username.
* @returns {string} A login token for this user.
*/
async function registerNewUsername(username) {
  const token = tokenGenerator.generateLoginToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + ACCESS_TOKEN_VALIDITY_DAYS);
  accessTokens[token] = {username: username, expires: expires};
  let sql = "INSERT INTO AccessTokens VALUES (?, ?, ?)";
  sql = mysql.format(sql, [token, username, expires]);
  db_controller.insertQuery(sql)
    .then((res) => {
      if (res.status === "OK") {
        console.log("Access token successfully stored.")
      }
      else {
        console.log("Error storing access token. Response: " + JSON.stringify(res));
      }
    });
  return token;
}

/**
 * Delete access token for this user.
 *
 * @param {string} accessToken Token used for identification.
 * @returns {boolean} True if token successfully deleted, false if invalid token.
 */
async function logoutUser(accessToken) {
  if (await verifyToken(accessToken)) {
    delete accessTokens[accessToken];
    db_controller.deleteAccessToken(accessToken)
    .then((res) => {
      if (res.status === "OK") {
        console.log("Access token successfully deleted.")
      }
      else {
        console.log("Error deleting access token. Response: " + JSON.stringify(res));
      }
    });
    return true;
  }
  else {
    return false;
  }
}
