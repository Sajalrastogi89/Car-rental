myApp.service("IndexedDBService", function ($q) {
  let db;
  const dbName = "CarUserDB";
  const dbVersion = 7;

  this.openDB = function openDB() {
    console.log(17);
    if (db) return $q.resolve(db);

    let deferred = $q.defer();
    let request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      db = event.target.result;

      if (!db.objectStoreNames.contains("users")) {
        let userStore = db.createObjectStore("users", { keyPath: "email" });
        userStore.createIndex("role", "role", { unique: false });
      }

      if (!db.objectStoreNames.contains("cars")) {
        let carStore = db.createObjectStore("cars", {
          keyPath: "id",
          autoIncrement: true,
        });
        carStore.createIndex("city", "city", { unique: false });
        carStore.createIndex("owner_id", "owner.email", { unique: false });
      }

      if (!db.objectStoreNames.contains("biddings")) {
        let biddingStore = db.createObjectStore("biddings", {
          keyPath: "id",
          autoIncrement: true,
        });
        biddingStore.createIndex("car_id", "car.id", { unique: false });
        biddingStore.createIndex("user_id", "user.email", { unique: false });
        biddingStore.createIndex("owner_id", "car.owner.email", {
          unique: false,
        });
      }

     
      if (!db.objectStoreNames.contains("chat")) {
        let chatStore = db.createObjectStore("chat", {
          keyPath: "id",
          autoIncrement: true,
        });
        chatStore.createIndex("user_email", "user.email", { unique: false });
        chatStore.createIndex("owner_email", "owner.email", {
          unique: false,
        });
      }

      // Create Conversation Store
      if (!db.objectStoreNames.contains("conversation")) {
        let conversationStore = db.createObjectStore("conversation", {
          keyPath: "id",
          autoIncrement: true,
        });
        conversationStore.createIndex("chat_id", "chat_id", { unique: false });
      }
    };

    request.onsuccess = function (event) {
      db = event.target.result;
      deferred.resolve(db);
    };

    request.onerror = function (event) {
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  };

  this.addRecord = function (storeName, record) {
    return this.openDB().then(function (db) {
      console.log(18);
      let tx = db.transaction(storeName, "readwrite");
      let store = tx.objectStore(storeName);
      return new Promise((resolve, reject) => {
        console.log(19);
        let request = store.add(record);

        request.onsuccess = function (event) {
          console.log(20);
          resolve(event.target.result);
        };
        request.onerror = function (event) {
          console.log(21);
          reject(event.target.error);
        };
      });
    });
  };

  this.getRecord = function (storeName, key) {
    return this.openDB().then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      return new Promise((resolve, reject) => {
        let request = store.get(key);

        request.onsuccess = function (event) {
          resolve(event.target.result);
        };
        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    });
  };

  this.getAll = function (storeName) {
    return this.openDB().then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      return new Promise((resolve, reject) => {
        let request = store.getAll();
        request.onsuccess = function (event) {
          resolve(event.target.result);
        };
        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    });
  };

  this.updateRecord = function (storeName, record) {
    return this.openDB().then(function (db) {
      let tx = db.transaction(storeName, "readwrite");
      let store = tx.objectStore(storeName);
      return new Promise((resolve, reject) => {
        let request = store.get(record.id);

        request.onsuccess = function (event) {
          let existingRecord = event.target.result;
          if (!existingRecord) {
            return reject(new Error("Record not found"));
          }
          let mergedRecord = { ...existingRecord, ...record };
          let updateRecord = store.put(mergedRecord);
          updateRecord.onsuccess = function () {
            resolve(mergedRecord);
          };
          updateRecord.onerror = function () {
            reject(new Error("Failed to update record: " + event.target.error));
          };
        };
        request.onerror = function (event) {
          reject(new Error("Failed to fetch record: " + event.target.error));
        };
      });
    });
  };

  this.getRecordsUsingIndex = function (storeName, indexName, indexValue) {
    return this.openDB().then(function (db) {
      console.log(16);
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      let index = store.index(indexName);
      console.log(indexValue, 19);
      return new Promise((resolve, reject) => {
        console.log(indexValue, 18);
        let getRequest = index.getAll(indexValue);

        getRequest.onsuccess = function (event) {
          resolve(event.target.result);
        };
        getRequest.onerror = function (event) {
          reject(event.target.error);
        };
      });
    });
  };

  this.getRecordsUsingPagination = function (storeName, pageSize, start) {
    return this.openDB().then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      let records = [];
      return new Promise((resolve, reject) => {
        let cursorRequest = store.openCursor();
        cursorRequest.onsuccess = function (event) {
          let cursor = event.target.result;
          if (!cursor) {
            resolve(records);
            return;
          }
          if (start > 0) {
            cursor.advance(start);
            start = 0;
          } else if (records.length < pageSize) {
            records.push(cursor.value);
            cursor.continue();
          } else {
            resolve(records);
          }
        };
        cursorRequest.onerror = function (event) {
          reject(event.target.error);
        };
      });
    });
  };

  this.getRecordsUsingPaginationWithIndex = function (
    storeName,
    indexName,
    indexValue,
    pageSize,
    start
  ) {
    return this.openDB().then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      let index = store.index(indexName);
      let records = [];
      console.log(indexValue);
      return new Promise((resolve, reject) => {
        let cursorRequest = index.openCursor(IDBKeyRange.only(indexValue));
        cursorRequest.onsuccess = function (event) {
          let cursor = event.target.result;
          if (!cursor) {
            resolve(records);
            return;
          }
          if (start > 0) {
            cursor.advance(start);
            start = 0;
          } else if (records.length < pageSize) {
            records.push(cursor.value);
            cursor.continue();
          } else {
            resolve(records);
          }
        };
        cursorRequest.onerror = function (event) {
          reject(event.target.error);
        };
      });
    });
  };
});
