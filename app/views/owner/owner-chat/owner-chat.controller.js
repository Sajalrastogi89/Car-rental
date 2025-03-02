myApp.controller("ownerChatController", ["$scope","chatService", function ($scope,chatService) {
  // Example chat list
  $scope.chats = [];
  $scope.messages = [];
  $scope.newMessage = "";
  $scope.messageText="";
  $scope.ownerEmail=JSON.parse(sessionStorage.getItem('loginData')).email;
  $scope.currentMessage={};
  $scope.currentMessage.messageText = "";


  $scope.init = function(){
    $scope.getAllChats();
  }

  $scope.getAllChats = function(){
    chatService.getChats("owner_email").then((AllChats)=>{
      console.log(AllChats);
      $scope.chats=AllChats;
    }).catch((e)=>{
      console.log(e);
    })
  }

  // Select Chat
  $scope.selectChat = function(chat) {
    $scope.selectedChat = chat;
    chatService.getSelectedChatData(chat.id).then((conversation)=>{
      console.log(conversation);
      $scope.messages=conversation;
    }).catch((e)=>{
      console.log("selectChat",e);
    })
  };

  // Send Message
  $scope.sendMessage = function(messageText) {
    console.log(messageText);
    if (!messageText.trim()) return; // Prevent sending empty messages

    let messageData = {
      chat_id: $scope.selectedChat.id, // Auto-generated ID from IndexedDB
      sender: $scope.selectedChat.owner.email,
      message: messageText,
      timestamp: Date.now(),
    };

    $scope.messages.push(messageData);
    chatService.addNewMessage(messageData);
    $scope.currentMessage.messageText = "";

    // Clear the input field
    
    console.log($scope.messageText);
};


  // Upload Image
  $scope.uploadImage = function(event) {
    var file = event.target.files[0];
    if (file && $scope.selectedChat) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.selectedChat.messages.push({ sender: "me", image: e.target.result });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  $scope.init();

}]);
