const email_sender = require('./email/email-sender');
const queryController = require('./query-controller')
const authenticator = require('./authenticator.js');
const crypto = require("crypto");

module.exports = {
recoverPassword
};

/**
* Recover password of user
* @param {String} username - user to recover password
* @result {JSON} result - {success:Boolean response:(optional) Error/Problem}
**/
async function recoverPassword(username){
  const user = await queryController.getUser(username);
  if(!user.success){
    return user;
  }
  if(user.response[0].length==0){
    return {success:false, response:"No user found!"}
  }
  const newPassword = authenticator.produceSalt();
  //TODO: DELETE
  console.log("PASSWORD HERE FOR TESTING: " + newPassword);
  const hash = crypto.createHash('sha256').update(newPassword).digest('hex');
  const responseUserUpdate = await queryController.updatePassword({username:username, hashed_password:hash},username);
  if(!responseUserUpdate.success){
    return responseUserUpdate;
  }
  const userToEmail = {
    user:{
      username:username,
      new_password:newPassword,
      recovery_email:user.response[0].recovery_email
    }
  }
  return email_sender.sendPasswordRecoveryEmail(userToEmail);
}
