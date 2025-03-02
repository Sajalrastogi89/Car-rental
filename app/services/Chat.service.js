myApp.service("chatService", [
  "IndexedDBService",
  "$q",
  function (IndexedDBService,$q) {
    this.addChat = function (owner_id, user_id, car) {
      let chatData = {
        user: { email: user_id },
        owner: { email: owner_id, name: car.owner.firstName },
        car: car
      };

      return IndexedDBService.addRecord("chat", chatData).then((chatId) => {
        console.log(chatId,1);
        let messageData = {
          chat_id: chatId, // Auto-generated ID from IndexedDB
          sender: user_id,
          message: "Hi",
          timestamp: Date.now(),
        };

        return IndexedDBService.addRecord("conversation", messageData)
      })
      .catch((e)=>{
        console.log(e);
      })
    };

    this.getChats = function(indexName){
      const indexValue=JSON.parse(sessionStorage.getItem('loginData')).email;
      console.log(indexName,indexValue,12);
      return IndexedDBService.getRecordsUsingIndex("chat",indexName,indexValue);
    }

    this.getSelectedChatData = function(id){
      console.log(id);
      return IndexedDBService.getRecordsUsingIndex("conversation","chat_id",id);
    }

    this.addNewMessage = function(messageData){
      console.log(12345);
      let deferred=$q.defer();    
      IndexedDBService.addRecord("conversation", messageData).then((messageData)=>{
        deferred.resolve(messageData);
      })
      .catch((e)=>{
        deferred.reject("message not added");
      })
     return deferred.promise;
    }

  },
]);
