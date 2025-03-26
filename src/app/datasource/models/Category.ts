import { TCategory, TError, TSimpleCategory } from "@/app/types";
import { IDBCategory } from "../indexedDB/IDBCategory"
import Link from "./Link";

export default class CategoryModel {
    static async getAll() {
        const categories = await IDBCategory.getAll()
        return categories
    }

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

    /**
     * @throws {TError} if request fails
     * */
    static add(title: string): Promise<TSimpleCategory> {
        return IDBCategory.add({ title });
    }

    /**
     * 
     * @throws {TError} if request fails
     * */
    static update(category: TSimpleCategory): Promise<TSimpleCategory> {
        return IDBCategory.update({ category });
    }
}
