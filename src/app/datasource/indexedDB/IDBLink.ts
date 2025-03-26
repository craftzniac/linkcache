import { TLink, TNewLink } from "@/app/types";
import connect from "./connect";
import { objectStores } from "@/app/constants";

export class IDBLink {
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
