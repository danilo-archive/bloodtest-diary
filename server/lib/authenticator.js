const crypto = require("crypto");
module.exports = {canLogin:canLogin};


/**
*Function tha naively checks if user
*provided right credentials
*/
function canLogin(user)
{
  //get data from database
  //should be one record
  var userInDatabase = getUserData(user)
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
    var hash = crypto.pbkdf2Sync(user.password,userInDatabase[0].salt,1000,64,'sha512').toString('hex');
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

/**
* TODO: Get user data from the database
**/
function getUserData(user)
{
  return [{id:"1", username:"admin", password:"abd5f9aaea246574ad8602f1acac14a053994ec48e91347bc581c473bfd79448070449ac9cc49aa032c5eb297d363a4a5e9e79e79623be7381d4d541644e1be1", salt:"33d14774647c00bf7062f80f79820816"}];
}
