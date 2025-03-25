"use client"
import HomePageProvider from "./contexts/HomePageProvider";
import Category from "./components/Category";
import { AddCategoryBtn, AddLinkBtn } from "./components/addButtons";
import { RenderDialogs } from "./components/dialogs";
import { useEffect, useState } from "react";
import CategoryModel from "@/app/datasource/models/Category"
import { TCategory } from "./types";

export default function Home() {
  const [categories, setCategories] = useState<TCategory[]>([])

  async function fetchCategories() {
    const res = await CategoryModel.getAllWithContent()
    if ("error" in res) {
      alert(res.error)
      return;
    }
    console.log("res: ", res);
    setCategories(res);
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <HomePageProvider>
      <main className="flex p-2 justify-center overflow-y-auto mb-10">
        <RenderDialogs />
        <div className="flex flex-col max-w-[30rem] w-full gap-0.5">
          <div className="flex w-full justify-end gap-2 items-center">
            <AddCategoryBtn />
            <AddLinkBtn />
          </div>
          <div className="flex flex-col gap-8 w-full">
            {
              categories.map(cat => (
                <Category key={cat.id} {...cat} />
              ))
            }
          </div>
        </div>
      </main>
    </HomePageProvider>
  );
}
