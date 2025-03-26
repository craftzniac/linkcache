import { objectStores } from "@/app/constants";
import connect from "./connect";
import { TError, TSimpleCategory } from "@/app/types";

export class IDBCategory {
    static async getAll() {
        return new Promise<TSimpleCategory[]>(async (resolve, reject) => {
            try {
                const dbConn = await connect()
                const transaction = dbConn.transaction([objectStores.CATEGORIES], "readonly")
                // catch all errors on this transaction
                transaction.onerror = (event) => {
                    reject({ error: `Couldn't get categories from indexedDB` })
                }

                const catObjStore = transaction.objectStore(objectStores.CATEGORIES)

                const cursorRequest = catObjStore.openCursor()
                const categories: any[] = []
                cursorRequest.onsuccess = (event) => {
                    const cursor = (event.target as any).result as IDBCursorWithValue
                    if (cursor) {
                        categories.push(cursor.value)
                        cursor.continue()
                    }
                }

                (cursorRequest.transaction as IDBTransaction).oncomplete = () => {
                    resolve(categories)
                }
            } catch (err) {
                reject(err as TError)
            }
        })
    }
}
