"use client"
import HomePageProvider from "./contexts/HomePageProvider";
import Category from "./components/Category";
import { AddCategoryBtn, AddLinkBtn } from "./components/buttons";
import { RenderDialogs } from "./components/dialogs";
import CategoryModel from "@/app/datasource/models/Category"
import { TCategory, TError } from "./types";
import { useQuery } from "@tanstack/react-query";
import { objectStores } from "./constants";

export default function Home() {
  const { data: categories, isError, error, isLoading } = useQuery<TCategory[], TError>({
    queryKey: [objectStores.CATEGORIES],
    queryFn: () => {
      return CategoryModel.getAllWithContent()
    }
  });

  return (
    <HomePageProvider>
      <main className="flex p-2 justify-center overflow-y-auto mb-10 w-full h-full">
        <RenderDialogs />
        <div className="flex flex-col max-w-[30rem] w-full h-full gap-0.5">
          {
            categories && categories?.length > 0 && (
              <div className="flex w-full justify-end gap-2 items-center">
                <AddCategoryBtn />
                <AddLinkBtn />
              </div>
            )
          }
          <div className="flex  w-full h-full">
            {
              isLoading ? (
                <div className="h-full w-full flex justify-center items-center p-2">
                  <p className="text-lg text-gray-600">Loading...</p>
                </div>
              ) : (
                isError ? (
                  <div className="h-full w-full flex justify-center items-center p-2">
                    <p className="text-lg text-gray-600">{error.error}</p>
                  </div>
                ) : (
                  <ul className="flex  flex-col gap-8 w-full h-full">
                    {
                      categories && categories.length > 0 ? (
                        categories.map(cat => (
                          <li key={cat.id}> <Category  {...cat} /> </li>
                        ))
                      ) : (
                        <div className="h-full w-full flex flex-col justify-center items-center p-2 gap-4">
                          <p className="text-lg text-gray-600 max-w-80 text-center">You must create a category before you can save links</p>
                          <AddCategoryBtn isPrimary />
                        </div>
                      )}
                  </ul>
                )
              )
            }
          </div>
        </div>
      </main>
    </HomePageProvider>
  );
}
