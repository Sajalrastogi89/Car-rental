myApp.service('AuthService', function(IndexedDBService) {


  this.val={};


  this.checkEmail = async function(email) {
    try {
      this.val = await IndexedDBService.getRecord('users', email);
      if (this.val) {
        return true; // Email already exists
      } else {
        return false; // Email does not exist
      }
    } catch (e) {
      console.log(e); // In case of error, assume email exists
    }
  }

  this.checkPassword = function(password){
    console.log(password,this.val.password);
    return password===this.val.password;
  }

  this.checkRole = function(role){
    return role===this.val.role;
  }
})