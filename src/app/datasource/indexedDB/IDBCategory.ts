import { objectStores } from "@/app/constants";
import connect from "./connect";
import { TSimpleCategory } from "@/app/types";

export class IDBCategory {
    /**
     * get all categories from the store
     * @throws {TError} if request fails
     * */
    static async getAll() {
        return new Promise<TSimpleCategory[]>(async (resolve, reject) => {
            const dbConn = await connect()
            const transaction = dbConn.transaction([objectStores.CATEGORIES], "readonly")
            // catch all errors on this transaction
            transaction.onerror = (event) => {
                reject({ error: `Couldn't get categories from indexedDB` })
                return;
            }

            const catObjStore = transaction.objectStore(objectStores.CATEGORIES)

            const cursorRequest = catObjStore.openCursor()
            const categories: TSimpleCategory[] = []
            cursorRequest.onsuccess = (event) => {
                const cursor = cursorRequest.result;
                if (cursor) {
                    categories.push(cursor.value)
                    cursor.continue()
                }
            }

            (cursorRequest.transaction as IDBTransaction).oncomplete = () => {
                resolve(categories)
            }
        })
    }

    /**
     * add new  category to the store
     * @throws {TError} if request fails
     * */
    static async add({ title }: { title: string }): Promise<TSimpleCategory> {
        return new Promise(async (resolve, reject) => {
            const dbConn = await connect();
            const catsObjStore = dbConn.transaction(objectStores.CATEGORIES, "readwrite").objectStore(objectStores.CATEGORIES);
            const addReq = catsObjStore.add({ title });
            addReq.onsuccess = () => {
                const categoryId = addReq.result;
                resolve({ title, id: "" + categoryId });
            }
            addReq.onerror = () => {
                reject({ error: "" + addReq.error?.message });
            }
        });
    }


    /**
     * update a category
     * @throws {TError} if request fails
     * */
    static async update({ category }: { category: TSimpleCategory }): Promise<TSimpleCategory> {
        return new Promise(async (resolve, reject) => {
            const dbConn = await connect();

            const oldCategory = await IDBCategory.get({ catId: category.id });
            if (!oldCategory) {
                reject("Category does not exist")
                return;
            }

            // update the old value with the new one
            oldCategory.title = category.title;

            // put it back into the store
            const catsObjStore = dbConn.transaction(objectStores.CATEGORIES, "readwrite").objectStore(objectStores.CATEGORIES);
            const updateReq = catsObjStore.put(oldCategory);
            updateReq.onsuccess = () => {
                resolve(oldCategory);
            }
            updateReq.onerror = () => {
                reject({ error: "" + updateReq.error?.message });
            }
        });
    }


    /**
     * get a category using it's id
     * @throws {TError} if request fails
     * */
    static async get({ catId, dbConn }: { catId: string, dbConn?: IDBDatabase }): Promise<TSimpleCategory | null> {
        return new Promise(async (resolve, reject) => {
            let conn: IDBDatabase;
            if (!dbConn) {
                conn = await connect();
            } else {
                conn = dbConn;
            }
            const catsObjStore = conn.transaction(objectStores.CATEGORIES, "readwrite").objectStore(objectStores.CATEGORIES);
            const catGetReq = catsObjStore.get(catId);
            catGetReq.onsuccess = () => {
                const category = catGetReq.result;
                if (!category) {
                    resolve(null);
                } else {
                    resolve(category);
                }
            }
            catGetReq.onerror = () => {
                reject({ error: "" + catGetReq.error?.message });
            }
        });
    }

    /**
     * @throws {TError} if request fails
     * @returns {string} a string that represents the id of the deleted category
     * */
    static async delete({ id }: { id: string }): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const dbConn = await connect();
            const categoryObjStore = dbConn.transaction(objectStores.CATEGORIES, "readwrite").objectStore(objectStores.CATEGORIES);
            const delReq = categoryObjStore.delete(id);
            delReq.onsuccess = () => {
                resolve(id);
            }
            delReq.onerror = () => {
                reject({ error: "" + delReq.error?.message });
            }
        });
    }

}
