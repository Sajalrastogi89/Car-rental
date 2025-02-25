myApp.service('AuthService', ['IndexedDBService',function(IndexedDBService) {


  this.val={};


  this.checkEmail = async function(email) {
    try {
      this.val = await IndexedDBService.getRecord('users', email);
      if (this.val) {
        return true; 
      } else {
        return false;  
      }
    } catch (e) {
      console.log(e); 
    }
  }

  this.checkPassword = function(password){
    console.log(password,this.val.password);
    return password===this.val.password;
  }

  this.checkRole = function(role){
    return role===this.val.role;
  }

  this.getUserData = function(){
    console.log(this.val);
    return this.val;
  }
}])