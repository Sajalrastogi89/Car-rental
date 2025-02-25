myApp
.service('IndexedDBService', function($q) {
    let db;
    const dbName = "CarUserDB";
    const dbVersion = 2;


    

    this.openDB=function openDB() {
      if (db) return $q.resolve(db); 

      let deferred = $q.defer();
      let request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = function(event) {
        db = event.target.result;

        if (!db.objectStoreNames.contains("users")) {
          let userStore = db.createObjectStore("users", { keyPath: "email" });
          userStore.createIndex("role", "role", { unique: false });
        }

        if (!db.objectStoreNames.contains("cars")) {
          let carStore = db.createObjectStore("cars", { keyPath: "id", autoIncrement: true });
          carStore.createIndex("city", "city", { unique: false });
          carStore.createIndex("user_id", "user_id", { unique: false });
        }

        if(!db.objectStoreNames.contains("biddings")){
          let biddingStore = db.createObjectStore("biddings",{ keyPath: "id", autoIncrement:true});
          biddingStore.createIndex("car_id","car_id",{ unique: false });
          biddingStore.createIndex("user_id","user_id",{ unique: false});
          biddingStore.createIndex("owner_id","owner_id",{ unique: false});
        }

      };

      request.onsuccess = function(event) {
        db = event.target.result;
        deferred.resolve(db);
      };

      request.onerror = function(event) {
        deferred.reject(event.target.error);
      };

      return deferred.promise;
    };

    
    this.addRecord = function(storeName, record) {
      let deferred=$q.defer();
      this.openDB().then(function(db) {
          let tx = db.transaction(storeName, "readwrite");
          let store = tx.objectStore(storeName);
          let request = store.add(record);

          request.onsuccess = function(event) {
            deferred.resolve(event.target.result);
          };
          request.onerror = function(event) {
            deferred.reject(event.target.error);
          };
        }).catch((e)=>{
          deferred.reject(e);
        })
    };

    this.getRecord = function(storeName, key) {
      let deferred=$q.defer();
      this.openDB().then(function(db) {
          let tx = db.transaction(storeName, "readonly");
          let store = tx.objectStore(storeName);
          let request = store.get(key);
          console.log(key);
          request.onsuccess = function(event) {
            deferred.resolve(event.target.result);
          };
          request.onerror = function(event) {
            deferred.reject(event.target.error);
          };
      }).catch((e)=>{
        deferred.reject(e);
      })
      return deferred.promise;
    };

    this.getAll = function(storeName) {
      let deferred=$q.defer();
      this.openDB().then(function(db) {
          let tx = db.transaction(storeName, "readonly");
          let store = tx.objectStore(storeName);
          let request = store.getAll();
          
          request.onsuccess = function(event) {
            deferred.resolve(event.target.result);
          };
          request.onerror = function(event) {
            deferred.reject(event.target.error);
          };
        })
        .catch((e)=>{
          deferred.reject(e);
        })
      return deferred.promise;
    };
    

    this.updateRecord = function(storeName, record) {
      let deferred=$q.defer();
      this.openDB().then(function(db) {
          let tx = db.transaction(storeName, "readwrite");
          let store = tx.objectStore(storeName);
          let request = store.put(record);
          
          request.onsuccess = function(event) {
            deferred.resolve(event.target.result);
          };
          request.onerror = function(event) {
            deferred.reject(event.target.error);
          };
        }
        )
        .catch((e)=>{
          deferred.reject(e);
        })
        return deferred.promise;
    };


    this.getRecordsUsingIndex = function(storeName, indexName, indexValue){
      let deferred = $q.defer();
      this.openDB().then(function(db){
          let tx=db.transaction(storeName,"readonly");
          let store = tx.objectStore(storeName);
          let index=store.index(indexName);
          let getRequest=index.getAll(indexValue);
          getRequest.onsuccess = function(event){
              deferred.resolve(event.target.result);
          };
          getRequest.onerror = function(event){
            deferred.reject(event.target.error);
          };
        })
        .catch((e)=> deferred.reject(e));
      return deferred.promise;
    };

    this.getRecordsUsingPagination = function(storeName, pageSize, start){
      let deferred=$q.defer();
      console.log(storeName,pageSize,start);
      this.openDB().then(function(db){
        let tx=db.transaction(storeName,"readonly");
        let store=tx.objectStore(storeName);
        let records=[];
        let cursorRequest = store.openCursor();
        cursorRequest.onsuccess = function(event){
          let cursor=event.target.result;
          if(!cursor){
            deferred.resolve(records);
            return;
          }
          if(start>0){
            cursor.advance(start);
            start=0;
          }
          else if(records.length<pageSize){
            records.push(cursor.value);
            cursor.continue();
          }
          else{
            deferred.resolve(records);
          }
        }
        cursorRequest.onerror = function(event){
          deferred.reject(event.target.error);
        }
      }).catch((e)=>{
        console.log(2);
        deferred.reject(e);
      })
      return deferred.promise;
    }

    this.getRecordsUsingPaginationWithIndex = function(storeName, indexName, indexValue, pageSize, start){
      let deferred=$q.defer();
      this.openDB().then(
        (function(db){
          let tx = db.transaction(storeName,"readonly");
          let store = tx.objectStore(storeName);
          let index = store.index(indexName);
          let records=[];
          let cursorRequest = index.openCursor(IDBKeyRange.only(indexValue));
          cursorRequest.onsuccess = function(event){
            let cursor=event.target.result;
            if(!cursor){
              deferred.resolve(records);
              return;
            }
            if(start>0){
              cursor.advance(start);
              start=0;
            }
            else if(records.length<pageSize){
              records.push(cursor.value);
              cursor.continue();
            }
            else {
              deferred.resolve(records);
            }
          }
          cursorRequest.onerror = function(event){
            deferred.reject(event.target.error);
          }
        })
      ).catch((e)=>{
        deferred.reject(e);
      })
      return deferred.promise;
    }
    

  });
