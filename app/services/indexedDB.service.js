myApp
.service('IndexedDBService', function($q) {
    let db;
    const dbName = "CarUserDB";
    const dbVersion = 1;


    

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

    // Generic CRUD operations defined on `this`
    this.addRecord = function(storeName, record) {
      return this.openDB().then(function(db) {
        return $q(function(resolve, reject) {
          let tx = db.transaction(storeName, "readwrite");
          let store = tx.objectStore(storeName);
          let request = store.add(record);

          request.onsuccess = function(event) {
            resolve(event.target.result);
          };
          request.onerror = function(event) {
            reject(event.target.error);
          };
        });
      });
    };

    this.getRecord = function(storeName, key) {
      return this.openDB().then(function(db) {
        return $q(function(resolve, reject) {
          let tx = db.transaction(storeName, "readonly");
          let store = tx.objectStore(storeName);
          let request = store.get(key);
          request.onsuccess = function(event) {
            resolve(event.target.result);
          };
          request.onerror = function(event) {
            reject(event.target.error);
          };
        });
      });
    };

    this.getAll = function(storeName) {
      return this.openDB().then(function(db) {
        return $q(function(resolve, reject) {
          let tx = db.transaction(storeName, "readonly");
          let store = tx.objectStore(storeName);
          let request = store.getAll();
          
          request.onsuccess = function(event) {
            resolve(event.target.result);
          };
          request.onerror = function(event) {
            reject(event.target.error);
          };
        });
      });
    };
    

    this.updateRecord = function(storeName, record) {
      return this.openDB().then(function(db) {
        return $q(function(resolve, reject) {
          let tx = db.transaction(storeName, "readwrite");
          let store = tx.objectStore(storeName);
          let request = store.put(record);
          
          request.onsuccess = function(event) {
            resolve(event.target.result);
          };
          request.onerror = function(event) {
            reject(event.target.error);
          };
        });
      });
    };
    

  });
