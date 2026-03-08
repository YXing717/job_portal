const ImageDB = {
    dbName: 'JobPortalDB',
    storeName: 'Images',
    db: null,

    init: function () {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    },

    storeImage: function (id, base64) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                this.init().then(() => this._performStore(id, base64, resolve, reject)).catch(reject);
            } else {
                this._performStore(id, base64, resolve, reject);
            }
        });
    },

    _performStore: function (id, base64, resolve, reject) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(base64, id);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    },

    getImage: function (id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                this.init().then(() => this._performGet(id, resolve, reject)).catch(reject);
            } else {
                this._performGet(id, resolve, reject);
            }
        });
    },

    _performGet: function (id, resolve, reject) {
        if (!id) return resolve(null);
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    },

    deleteImage: function (id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                this.init().then(() => this._performDelete(id, resolve, reject)).catch(reject);
            } else {
                this._performDelete(id, resolve, reject);
            }
        });
    },

    _performDelete: function (id, resolve, reject) {
        if (!id) return resolve();
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    }
};

// Initialize DB on script load
ImageDB.init();
