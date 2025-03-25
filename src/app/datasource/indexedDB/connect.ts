import { DB_NAME, objectStores } from "@/app/constants";
import { TError } from "@/app/types";

const dbName = DB_NAME
const dbVersion = 2;

const DB_Version = {
    One: 1,
    Two: 2
}

function storeExists(store: string, stores: DOMStringList): boolean {
    for (const i of stores) {
        if (store == i) {
            return true;
        }
    }
    return false;
}

function db_v1(request: IDBOpenDBRequest, onStoreCreationCompleted?: () => void) {
    const db = request.result;
    let linksObjStore: IDBObjectStore | undefined = undefined;

    // v1
    // create categories store if it does not exist
    if (storeExists(objectStores.CATEGORIES, db.objectStoreNames) == false) {
        db.createObjectStore(objectStores.CATEGORIES, { keyPath: "id", autoIncrement: true })
    }
    if (storeExists(objectStores.LINKS, db.objectStoreNames) == false) {
        // create the links store
        linksObjStore = db.createObjectStore(objectStores.LINKS, { keyPath: "id", autoIncrement: true })
    } else {
        linksObjStore = request.transaction?.objectStore(objectStores.LINKS);
    }

    // make sure the object stores have been created before you try to put stuff into it
    (request.transaction as IDBTransaction).oncomplete = (ev) => {
        // v1 // create a default category  called "Default" in the categories store
        const categoriesObjStore = db.transaction([objectStores.CATEGORIES], "readwrite").objectStore(objectStores.CATEGORIES);

        // first check that there are no categories in the categories store before attempting to seed it, to avoid duplicating data
        categoriesObjStore.getAll().onsuccess = (ev) => {
            const existingCategories = (ev.target as IDBRequest).result
            if (existingCategories.length == 0) {
                seedCategoryStore(categoriesObjStore);
            }
        }

        if (onStoreCreationCompleted) {
            onStoreCreationCompleted();   // for the next version
        }
    }

    return {
        linksObjStore
    }
}

function db_v2(request: IDBOpenDBRequest, onStoreCreationCompleted?: () => void) {
    const db = request.result;
    const { linksObjStore } = db_v1(request, () => {
        if (onStoreCreationCompleted) {
            onStoreCreationCompleted();
        }
    });

    //v2 // these execute before the stuff inside the callback of db_v1()

    // create a users store
    if (storeExists("users", db.objectStoreNames) === false) {
        db.createObjectStore("users", { keyPath: "user_id", autoIncrement: true });
    }
    // create index on the "category" property of link
    if (linksObjStore) {
        if (storeExists(objectStores.LINKS, db.objectStoreNames)) {  // v2
            linksObjStore.createIndex("category", "category", { unique: false });
        }
    }
}

/**
 * create a connection to indexedDB
 * */
export default async function connect(): Promise<IDBDatabase> {
    return new Promise((resolve, reject: (reason: TError) => void) => {
        const request: IDBOpenDBRequest = window.indexedDB.open(dbName, dbVersion)
        request.onsuccess = function(ev) {
            resolve((ev.target as IDBOpenDBRequest).result)
        }
        // setup datastores within an upgrade transaction
        request.onupgradeneeded = (ev) => {
            const dbVersion = request.result.version
            switch (dbVersion) {
                case DB_Version.One:
                    db_v1(request);
                    break;
                case DB_Version.Two:
                    db_v2(request);
                    break;
                default:
                    throw new Error("Unrecognized database version number");
            }
        }
        request.onerror = function(ev) {
            reject({ error: "Connection to indexedDB failed: " + request.error?.message })
        }
    })
}

// create a default category called "Default"
function seedCategoryStore(catsObjStore: IDBObjectStore) {
    return new Promise((resolve, reject) => {
        let req = catsObjStore.add({
            title: "Default"
        })
        req.onerror = () => {
            reject({ error: "Error setting up database" })
        }

        req = catsObjStore.add({
            title: "Browser saves"
        })
        req.onerror = () => {
            reject({ error: "Error setting up database" })
        }

        req = catsObjStore.add({
            title: "News articles"
        })
        req.onerror = () => {
            reject({ error: "Error setting up database" })
        }
    })
}

