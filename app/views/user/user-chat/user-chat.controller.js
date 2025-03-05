myApp.controller("userChatController", ["$scope","chatService","ToastService", function ($scope,chatService,ToastService) {
  

  $scope.chats = []; // store all chats related to that user
  $scope.messages = []; // store all messages for selected chat
  $scope.userEmail=JSON.parse(sessionStorage.getItem('loginData')).email; //retrieve user email from session storage
  $scope.currentMessage={}; // object for storing input message
  $scope.currentMessage.messageText = ""; // initialization of message text


  /**
   * @description - initial function called when page is loaded
   */
  $scope.init = function(){
    $scope.getAllChats();
  }



/**
 * @description - fetch all chats related to that user
 */
  $scope.getAllChats = function(){
    chatService.getChats("user_email").then((AllChats)=>{
      $scope.chats=AllChats;
    }).catch((e)=>{
      console.log(e);
      ToastService.error(e,3000);
    })
  }

  /**
   * @description - fetch conversation related to this chat from conversation table
   * @param {Object} chat 
   */
  $scope.selectChat = function(chat) {
    $scope.selectedChat = chat;
    chatService.getSelectedChatData(chat.id).then((conversation)=>{
      $scope.messages=conversation;
    }).catch((e)=>{
      console.log("selectChat",e);
      ToastService.error(e,3000);
    })
  };

  /**
   * @description - This function create a message object and insert 
   * inside the conversation table
   * @param {String} messageText 
   */
  $scope.sendMessage = function(messageText) {
    if (!messageText.trim()) return; 

    let messageData = {
      chat_id: $scope.selectedChat.id, 
      sender: $scope.selectedChat.user.email,
      message: messageText,
      timestamp: Date.now(),
    };

    $scope.messages.push(messageData);
    $scope.currentMessage.messageText = "";
    chatService.addNewMessage(messageData);
};


}]);
