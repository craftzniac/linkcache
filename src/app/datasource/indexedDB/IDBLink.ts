import { TLink, TNewLink } from "@/app/types";
import connect from "./connect";
import { objectStores } from "@/app/constants";

export class IDBLink {

    /**
     * @throws {TError} if request fails
     * */
    static async add(newLink: TNewLink): Promise<TLink> {
        return new Promise(async (resolve, reject) => {
            const dbConn = await connect();
            const transaction = dbConn.transaction([objectStores.LINKS], "readwrite");
            const linkObjStore = transaction.objectStore(objectStores.LINKS);
            const addReq = linkObjStore.add(newLink);
            addReq.onsuccess = () => {
                const linkId = addReq.result
                // get the link item
                resolve({ ...newLink, id: "" + linkId })
            }

            addReq.onerror = () => {
                reject({ error: "Couldn't add link: " + addReq.error?.message })
            }

        })
    }


    /**
     * update a link
     * @throws {TError} if request fails
     * */
    static async update(link: TLink): Promise<TLink> {
        return new Promise(async (resolve, reject) => {
            const dbConn = await connect();
            let linkObjStore = dbConn.transaction([objectStores.LINKS], "readwrite").objectStore(objectStores.LINKS);

            const oldLink = await IDBLink.get({ linkId: link.id });
            if (!oldLink) {
                reject({ error: "Link does not exist" });
                return;
            }

            // update the link
            oldLink.title = link.title;
            oldLink.url = link.url;
            oldLink.category = link.category;

            // create a new transaction to put the updated link back into the db
            linkObjStore = dbConn.transaction([objectStores.LINKS], "readwrite").objectStore(objectStores.LINKS);
            // put it back into the store
            const updateReq = linkObjStore.put(oldLink);
            updateReq.onsuccess = () => {
                resolve(oldLink);
                return;
            }
            updateReq.onerror = () => {
                reject({ error: "Couldn't update link: " + updateReq.error?.message })
            }

        })
    }


    /**
     *  get link using it's id
     *  @throws {TError} if request fails
     * */
    static async get({ linkId, dbConn }: { linkId: string, dbConn?: IDBDatabase }): Promise<TLink | null> {
        return new Promise(async (resolve, reject) => {
            let conn: IDBDatabase;
            if (!dbConn) {
                conn = await connect();
            } else {
                conn = dbConn;
            }

            const linkObjStore = conn.transaction(objectStores.LINKS, "readwrite").objectStore(objectStores.LINKS);

            const linkGetReq = linkObjStore.get(linkId);
            linkGetReq.onsuccess = () => {
                const link = linkGetReq.result;
                if (!link) {
                    resolve(null);
                } else {
                    resolve(link);
                }
            }
            linkGetReq.onerror = () => {
                reject({ error: "" + linkGetReq.error?.message });
            }
        })
    }

    /**
     * @throws {TError} if request fails
     * @returns {string} a string that represents the id of the deleted link
     * */
    static async delete({ id }: { id: string }): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const dbConn = await connect();
            const linkObjStore = dbConn.transaction([objectStores.LINKS], "readwrite").objectStore(objectStores.LINKS);
            const delLinkReq = linkObjStore.delete(id);
            delLinkReq.onsuccess = () => {
                resolve(id);
            }
            delLinkReq.onerror = () => {
                reject({ error: "" + delLinkReq.error?.message })
            }
        })
    }

    /**
     * @throws {TError} if request fails
     * */
    static async getAll({ categoryId }: { categoryId: string | number }): Promise<TLink[]> {
        return new Promise(async (resolve, reject) => {

            const dbConn = await connect();

            const linkObjStore = dbConn.transaction([objectStores.LINKS]).objectStore(objectStores.LINKS);

            // get links based on their category
            const categoryIndex = linkObjStore.index("category");
            const getAllReq = categoryIndex.getAll(categoryId);
            getAllReq.onsuccess = () => {
                resolve(getAllReq.result);
            }

            getAllReq.onerror = () => {
                reject({ error: "Couldn't get Links" })
            }
        })
    }
}
