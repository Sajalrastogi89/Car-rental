myApp.service("chatService", [
  "IndexedDBService",
  "$q",
  "ToastService",
  function (IndexedDBService,$q,ToastService) {

    /**
     * @description - this will add new chat in chat table with 'Hi' message
     * @param {String} owner_id 
     * @param {String} user_id 
     * @param {Object} car 
     * @returns {Object}
     */
    this.addChat = function (userName,ownerName, owner_id, user_id, car) {
      let chatData = {
        user: { email: user_id, name: userName },
        owner: { email: owner_id, name: ownerName },
        car: car
      };

      return IndexedDBService.addRecord("chat", chatData).then((chatId) => {
        let messageData = {
          chat_id: chatId, 
          sender: user_id,
          message: "Hi",
          timestamp: Date.now(),
        };

        return IndexedDBService.addRecord("conversation", messageData)
      })
      .catch((e)=>{
        ToastService.showToast("error",e);
      })
    };

    /**
     * @description - this will get chats related to user from database 
     * @param {String} indexName 
     * @returns array of objects
     */
    this.getChats = function(indexName){
      const indexValue=JSON.parse(sessionStorage.getItem('loginData')).email;
      return IndexedDBService.getRecordsUsingIndex("chat",indexName,indexValue);
    }

    /**
     * @description - this will fetch convertation related to that chat id
     * @param {Number} id 
     * @returns array of objects
     */
    this.getSelectedChatData = function(id){
      return IndexedDBService.getRecordsUsingIndex("conversation","chat_id",id);
    }

    /**
     * @description - this will add new message to database
     * @param {Object} messageData 
     * @returns {Object|String}
     */
    this.addNewMessage = function(messageData){
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
