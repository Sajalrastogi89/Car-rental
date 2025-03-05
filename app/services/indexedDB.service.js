myApp.service("IndexedDBService", function ($q) {
  let db;
  const dbName = "CarUserDB";
  const dbVersion = 4;

  /**
   * @description - this function will open database and if version is changed then upgrade
   * function will be called and previous data will be stored inside oldData object and old data stores
   * will be deleted and new data stores will be added
   * @returns db instance
   */
  this.openDB = function openDB() {
    if (db) return $q.resolve(db);

    let deferred = $q.defer();
    let request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      let transaction = event.target.transaction;
      let storeNames = ["users", "cars", "biddings", "chat", "conversation"];
      let oldData = {};

      async.parallel(
        storeNames.map((storeName) => {
          return function (callback) {
            if (db.objectStoreNames.contains(storeName)) {
              let store = transaction.objectStore(storeName);
              let getAllRequest = store.getAll();

              getAllRequest.onsuccess = function (event) {
                oldData[storeName] = event.target.result;
                callback(null, oldData[storeName]);
              };

              getAllRequest.onerror = function (err) {
                oldData[storeName] = [];
                callback(err, null);
              };
            } else {
              callback(null, []);
            }
          };
        }),
        function (err, results) {
          if (err) {
            console.error("Error fetching store data:", err);
          } else {
            console.log("Fetched store data:", results);
          }
          storeNames.forEach((store) => {
            if (db.objectStoreNames.contains(store))
              db.deleteObjectStore(store);
          });
          createStores();
        }
      );

      function createStores() {
        let userStore = db.createObjectStore("users", { keyPath: "email" });
        userStore.createIndex("role", "role", { unique: false });

        let carStore = db.createObjectStore("cars", {
          keyPath: "id",
          autoIncrement: true,
        });
        carStore.createIndex("city", "city", { unique: false });
        carStore.createIndex("owner_id", "owner.email", { unique: false });

        let biddingStore = db.createObjectStore("biddings", {
          keyPath: "id",
          autoIncrement: true,
        });
        biddingStore.createIndex("car_id", "car.id", { unique: false });
        biddingStore.createIndex("user_id", "user.email", { unique: false });
        biddingStore.createIndex("owner_id", "car.owner.email", {
          unique: false,
        });

        let chatStore = db.createObjectStore("chat", {
          keyPath: "id",
          autoIncrement: true,
        });
        chatStore.createIndex("user_email", "user.email", { unique: false });
        chatStore.createIndex("owner_email", "owner.email", { unique: false });

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

  /**
   * @description - this function will add records inside database
   * @param {String} storeName
   * @param {Object} record
   * @returns {Object}
   */
  this.addRecord = function (storeName, record) {
    let deferred=$q.defer();
    this.openDB().then(function (db) {
      let tx = db.transaction(storeName, "readwrite");
      let store = tx.objectStore(storeName);
        let request = store.add(record);

        request.onsuccess = function (event) {
          deferred.resolve(event.target.result);
        };
        request.onerror = function (event) {
          deferred.reject(event.target.error);
        };
      }
      )
      .catch((e)=>{
        deferred.reject(e);
      })
    return deferred.promise;
  };

  /**
   * @description - this function will retrieve records inside database
   * @param {String} storeName
   * @param {Integer} record
   * @returns {Object}
   */
  this.getRecord = function (storeName, key) {
    let deferred=$q.defer();
    this.openDB()
    .then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
        let request = store.get(key);

        request.onsuccess = function (event) {
          deferred.resolve(event.target.result);
        };
        request.onerror = function (event) {
          deferred.reject(event.target.error);
        };
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
  };

  /**
   * @description - this will fetch all records from database
   * @param {String} storeName
   * @returns
   */

  this.getAll = function (storeName) {
    let deferred=$q.defer();
    this.openDB()
    .then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
        let request = store.getAll();
        request.onsuccess = function (event) {
          deferred.resolve(event.target.result);
        };
        request.onerror = function (event) {
          deferred.reject(event.target.error);
        };
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
  };

  /**
   * @description - This will update existing record
   * @param {String} storeName
   * @param {Object} record
   * @returns {Object} updated record
   */
  this.updateRecord = function (storeName, record) {
    let deferred=$q.defer();
    this.openDB()
    .then(function (db) {
      let tx = db.transaction(storeName, "readwrite");
      let store = tx.objectStore(storeName);
        let request = store.get(record.id);

        request.onsuccess = function (event) {
          let existingRecord = event.target.result;
          console.log("exsisting frecord",existingRecord);
          if (!existingRecord) {
            return deferred.reject(new Error("Record not found"));
          }
          let mergedRecord = { ...existingRecord, ...record };
          console.log("merged record",mergedRecord);
          let updateRecord = store.put(mergedRecord);
          updateRecord.onsuccess = function () {
            deferred.resolve(mergedRecord);
          };
          updateRecord.onerror = function () {
            deferred.reject(new Error("Failed to update record: " + event.target.error));
          };
        };
        request.onerror = function (event) {
          deferred.reject(new Error("Failed to fetch record: " + event.target.error));
        };
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
  };

  /**
   * @description - this will fetch records of a particular index
   * @param {String} storeName
   * @param {String} indexName
   * @param {*} indexValue
   * @returns - array of objects
   */
  this.getRecordsUsingIndex = function (storeName, indexName, indexValue) {
    let deferred=$q.defer();
    this.openDB()
    .then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      let index = store.index(indexName);
        let getRequest = index.getAll(indexValue);

        getRequest.onsuccess = function (event) {
          deferred.resolve(event.target.result);
        };
        getRequest.onerror = function (event) {
          deferred.reject(event.target.error);
        };
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
  };

  /**
   * @description - this will fetch fixed number of records
   * @param {String} storeName
   * @param {Number} pageSize
   * @param {Number} start
   * @returns - array of objects
   */
  this.getRecordsUsingPagination = function (storeName, pageSize, start) {
    let deferred=$q.defer();
      this.openDB()
      .then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      let records = [];
        let cursorRequest = store.openCursor();
        cursorRequest.onsuccess = function (event) {
          let cursor = event.target.result;
          if (!cursor) {
            deferred.resolve(records);
            return;
          }
          if (start > 0) {
            cursor.advance(start);
            start = 0;
          } else if (records.length < pageSize) {
            records.push(cursor.value);
            cursor.continue();
          } else {
            deferred.resolve(records);
          }
        };
        cursorRequest.onerror = function (event) {
          deferred.reject(event.target.error);
        };
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
  };

  /**
   * @description - this will fetch records form table on particular index with pagination
   * @param {String} storeName
   * @param {String} indexName
   * @param {*} indexValue
   * @param {Number} pageSize
   * @param {Number} start
   * @returns - array of objects
   */
  this.getRecordsUsingPaginationWithIndex = function (
    storeName,
    indexName,
    indexValue,
    pageSize,
    start
  ) {
    let deferred=$q.defer();
    this.openDB()
    .then(function (db) {
      let tx = db.transaction(storeName, "readonly");
      let store = tx.objectStore(storeName);
      let index = store.index(indexName);
      let records = [];
      console.log(indexValue);
        let cursorRequest = index.openCursor(IDBKeyRange.only(indexValue));
        cursorRequest.onsuccess = function (event) {
          let cursor = event.target.result;
          if (!cursor) {
            deferred.resolve(records);
            return;
          }
          if (start > 0) {
            cursor.advance(start);
            start = 0;
          } else if (records.length < pageSize) {
            records.push(cursor.value);
            cursor.continue();
          } else {
            deferred.resolve(records);
          }
        };
        cursorRequest.onerror = function (event) {
          deferred.reject(event.target.error);
        };
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
  };
});
