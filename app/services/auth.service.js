myApp.service('AuthService', function(IndexedDBService) {

  this.checkEmail = async function(email) {
    try {
      const val = await IndexedDBService.getRecord('users', email);
      if (val) {
        return false; // Email already exists
      } else {
        return true; // Email does not exist
      }
    } catch (e) {
      console.log(e);
      return false; // In case of error, assume email exists
    }
  }

  // this.verifyDetails=function(user){
  //   if(user.password!==user.confirmPassword){
  //     return false;
  //   }
  // }
})