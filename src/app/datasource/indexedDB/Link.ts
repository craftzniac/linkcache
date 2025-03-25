import { TLink, TNewLink } from "@/app/types";
import connect from "./connect";
import { objectStores } from "@/app/constants";

export default class Link {

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

    static async getAll(categoryId: string): Promise<TLink[]> {
        return new Promise(async (resolve, reject) => {

            const dbConn = await connect();

            const linkObjStore = dbConn.transaction([objectStores.LINKS]).objectStore(objectStores.LINKS);

            const getAllReq = linkObjStore.getAll();
            getAllReq.onsuccess = () => {
                resolve(getAllReq.result);
            }

            getAllReq.onerror = () => {
                reject({ error: "Couldn't get Links" })
            }
        })
    }
}
