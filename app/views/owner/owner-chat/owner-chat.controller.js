myApp.controller("ownerChatController", ["$scope","chatService", function ($scope,chatService) {
  // Example chat list

  $scope.chats = []; // store all chats related to that user
  $scope.messages = []; // store all messages for selected chat
  $scope.messageText=""; 
  $scope.ownerEmail=JSON.parse(sessionStorage.getItem('loginData')).email; // fetch owner email from session storage
  $scope.currentMessage={}; // object for storing input message
  $scope.currentMessage.messageText = ""; // initialization of message text


  /**
   * @description - execute when page will be loaded
   */
  $scope.init = function(){
    $scope.getAllChats();
  }

  /**
   * @description - fetch all chats associated with owner email
   */
  $scope.getAllChats = function(){
    chatService.getChats("owner_email").then((AllChats)=>{
      console.log(AllChats);
      $scope.chats=AllChats;
    }).catch((e)=>{
      console.log(e);
    })
  }

  /**
   * @description - fetch conversation for selected chat
   * @param {Object} chat 
   */
  $scope.selectChat = function(chat) {
    console.log(chat);
    $scope.selectedChat = chat;
    chatService.getSelectedChatData(chat.id).then((conversation)=>{
      console.log(conversation);
      $scope.messages=conversation;
    }).catch((e)=>{
      console.log("selectChat",e);
    })
  };

  /**
   * @description - store message data inside table and update view using two way binding
   * @param {String} messageText 
   */
  $scope.sendMessage = function(messageText) {
    console.log(messageText);
    if (!messageText.trim()) return; 

    let messageData = {
      chat_id: $scope.selectedChat.id, 
      sender: $scope.selectedChat.owner.email,
      message: messageText,
      timestamp: Date.now(),
    };

    $scope.messages.push(messageData);
    chatService.addNewMessage(messageData);
    $scope.currentMessage.messageText = "";

    // Clear the input field
    
};

  $scope.init();

}]);
