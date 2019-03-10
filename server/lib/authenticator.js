const crypto = require("crypto");
const tokenGenerator = require('./lib/db_controller/token-generator');

module.exports = {
  canLogin,
  produceIterations,
  produceSalt,
  produceHash,
  verifyToken,
  registerNewUsername
};

const accessTokens = {};
const ACCESS_TOKEN_VALIDITY_DAYS = 10;

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
 * Verifies user using the accessToken.
 *
 * @param {string} accessToken
 * @returns Username of the user or undefined if token is invalid.
 */
async function verifyToken(accessToken) {
  if (!(accessToken in accessTokens)) {
      return undefined;
  }
  const expires = new Date(accessTokens[accessToken].expires);
  if ((expires - new Date()) <= 0) {
      delete accessTokens[accessToken];
      return undefined;
  }
  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + ACCESS_TOKEN_VALIDITY_DAYS);
  accessTokens[accessToken][expires] = newExpiry;
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
  return token;
}