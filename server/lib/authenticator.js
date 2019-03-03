
const crypto = require("crypto");
module.exports = {canLogin:canLogin};


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
    var hash = crypto.pbkdf2Sync(user.password,userInDatabase[0].salt,userInDatabase[0].iterations,64,'sha256').toString('hex');
    if(hash==userInDatabase[0].password)
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
