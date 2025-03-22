import { TCategory, TError, TSimpleCategory } from "@/app/types";
import IDBCategory from "../indexedDB/Category"

export default class Category {
    static async getAll() {
        try {
            const categories = await IDBCategory.getAll()
            return categories
        } catch (err) {
            return err as TError
        }
    }
    //
    static async getAllWithContent() {
        try {
            const categories = await IDBCategory.getAll()
            const categoriesWithChildren: TCategory[] = []
            for (const cat of categories) {
                // TODO: for now, just have empty links. But these will be fetched from indexedDB
                categoriesWithChildren.push({ ...cat, children: [] })
            }
            return categoriesWithChildren
        } catch (err) {
            return err as TError
        }
    }

    static add(categoryName: string): Promise<{ error: string } | TSimpleCategory> {
        console.log(categoryName)
        return new Promise((res, rej) => rej({ error: "not impl" }))
    }
}
