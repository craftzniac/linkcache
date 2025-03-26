"use client"
import HomePageProvider from "./contexts/HomePageProvider";
import Category from "./components/Category";
import { AddCategoryBtn, AddLinkBtn } from "./components/addButtons";
import { RenderDialogs } from "./components/dialogs";
import CategoryModel from "@/app/datasource/models/Category"
import { TCategory, TError } from "./types";
import { useQuery } from "@tanstack/react-query";
import { objectStores } from "./constants";

export default function Home() {
  const { data: categories, isError, error } = useQuery<TCategory[], TError>({
    queryKey: [objectStores.CATEGORIES],
    queryFn: () => {
      return CategoryModel.getAllWithContent()
    }
  });

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
              isError ? (
                <p>{error.error}</p>
              ) : (
                categories && (
                  categories.map(cat => (
                    <Category key={cat.id} {...cat} />
                  ))
                )
              )
            }
          </div>
        </div>
      </main>
    </HomePageProvider>
  );
}
