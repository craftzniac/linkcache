import { TCategory, TError, TSimpleCategory } from "@/app/types";
import { IDBCategory } from "../indexedDB/IDBCategory"
import Link from "./Link";

export default class CategoryModel {
    static async getAll() {
        try {
            const categories = await IDBCategory.getAll()
            return categories
        } catch (err) {
            return err as TError
        }
    }
    //
    /**
     * @throws {TError}
     * */
    static async getAllWithContent() {
        const categories = await IDBCategory.getAll()
        const categoriesWithChildren: TCategory[] = []
        for (const cat of categories) {
            // fetch the links for each category
            const links = await Link.getAll({ categoryId: cat.id });
            categoriesWithChildren.push({ ...cat, children: [...links] })
        }
        return categoriesWithChildren
    }

    static add(categoryName: string): Promise<{ error: string } | TSimpleCategory> {
        console.log(categoryName)
        return new Promise((res, rej) => rej({ error: "not impl" }))
    }
}
