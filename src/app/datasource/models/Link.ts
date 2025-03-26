import { TNewLink, TLink } from "@/app/types";
import { IDBLink } from "../indexedDB/IDBLink"

export default class Link {
    /**
     *  add link to database
     * */
    static async add(newLink: TNewLink): Promise<TLink> {
        return IDBLink.add(newLink);
    }

    static async getAll({ categoryId }: { categoryId: string | number }): Promise<TLink[]> {
        return IDBLink.getAll({ categoryId });
    }

    static async delete({ id }: { id: string }) {
        return IDBLink.delete({ id });
    }
} 
