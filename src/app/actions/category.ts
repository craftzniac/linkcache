"use server"

import { TSimpleCategory } from "../types"

export async function addCategory(categoryTitle: string): Promise<TSimpleCategory> {
    return new Promise((res) => res({ id: "kasdifjasdfjad", title: "sometitle" }))
}
