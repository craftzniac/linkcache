import { TNewLink, TLink } from "@/app/types";
import IDBLink from "../indexedDB/Link"

export default class Link {
    /**
     *  add link to database
     * */
    static async add(newLink: TNewLink): Promise<TLink> {
        return IDBLink.add(newLink);
    }
} 
