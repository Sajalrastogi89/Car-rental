myApp.controller("userChatController", ["$scope","chatService","ToastService", function ($scope,chatService,ToastService) {
  // Example chat list
  $scope.chats = [];
  $scope.messages = [];
  $scope.newMessage = "";
  $scope.messageText="";
  $scope.userEmail=JSON.parse(sessionStorage.getItem('loginData')).email;
  $scope.currentMessage={};
  $scope.currentMessage.messageText = "";


  $scope.init = function(){
    $scope.getAllChats();
  }

  $scope.getAllChats = function(){
    chatService.getChats("user_email").then((AllChats)=>{
      $scope.chats=AllChats;
    }).catch((e)=>{
      console.log(e);
    })
  }

  // Select Chat
  $scope.selectChat = function(chat) {
    $scope.selectedChat = chat;
    chatService.getSelectedChatData(chat.id).then((conversation)=>{
      $scope.messages=conversation;
    }).catch((e)=>{
      console.log("selectChat",e);
    })
  };

  // Send Message
  $scope.sendMessage = function(messageText) {
    if (!messageText.trim()) return; // Prevent sending empty messages

    let messageData = {
      chat_id: $scope.selectedChat.id, // Auto-generated ID from IndexedDB
      sender: $scope.selectedChat.user.email,
      message: messageText,
      timestamp: Date.now(),
    };

    $scope.messages.push(messageData);
    chatService.addNewMessage(messageData);
    $scope.currentMessage.messageText = "";
};


  $scope.init();

}]);
