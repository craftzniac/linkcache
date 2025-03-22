import { DB_NAME, objectStores } from "@/app/constants";
import { TError } from "@/app/types";

/**
 * create a connection to indexedDB
 * */
const dbName = DB_NAME
const dbVersion = 1;

export default async function connect(): Promise<IDBDatabase> {
    return new Promise((resolve, reject: (reason: TError) => void) => {
        const request: IDBOpenDBRequest = window.indexedDB.open(dbName, dbVersion)
        request.onsuccess = function(ev) {
            console.log("connection successful")
            resolve((ev.target as IDBOpenDBRequest).result)
        }
        // setup datastores within an upgrade transaction
        request.onupgradeneeded = function(ev) {
            // a store for categories and links
            const db = request.result
            db.createObjectStore(objectStores.CATEGORIES, { keyPath: "id", autoIncrement: true })
            db.createObjectStore(objectStores.LINKS, { keyPath: "id", autoIncrement: true })

            const transaction = request.transaction as IDBTransaction

            // make sure upgrade transaction is completed  before setting up another transaction
            transaction.oncomplete = (event) => {
                // create a default category  called "Default"
                const categoriesObjectStore = db.transaction([objectStores.CATEGORIES], "readwrite").objectStore(objectStores.CATEGORIES)

                let req = categoriesObjectStore.add({
                    title: "Default"
                })
                req.onerror = () => {
                    reject({ error: "Error setting up database" })
                }

                req = categoriesObjectStore.add({
                    title: "Browser saves"
                })
                req.onerror = () => {
                    reject({ error: "Error setting up database" })
                }

                req = categoriesObjectStore.add({
                    title: "News articles"
                })
                req.onerror = () => {
                    reject({ error: "Error setting up database" })
                }
            }

        }
        request.onerror = function(ev) {
            reject({ error: "Connection to indexedDB failed: " + request.error?.message })
        }
    })
}
