import { useState, FormEvent, useEffect, useCallback } from "react"
import { TCategory, TLinkItem } from "../types"
import { delay } from "../utils"
import * as mockdata from "../mockData"
import { useHomePageContext } from "../contexts/HomePageProvider"
import { useQuery } from "@tanstack/react-query"

export function LinkForm() {
  const { closeLinkForm, selectedLink } = useHomePageContext()
  const mode = selectedLink?.id ? "edit" : "new"
  const [state, setState] = useState<TLinkItem>(selectedLink || {
    title: "", url: "", category: ""
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  function handleOnChange(update: { [key in keyof Partial<TLinkItem>]: string }) {
    setState(prev => ({ ...prev, ...update }))
  }

  return (
    <div className="fixed inset-0 bg-white/50 flex flex-col justify-center p-2 overflow-auto">
      <div className="flex justify-end w-full">
        <button type="button" className="justify-self-end text-xl p-4" onClick={closeLinkForm}>close</button>
      </div>

      <div className="w-full h-full justify-center items-center flex border-gray-300">
        <form className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-lg font-medium text-center">{mode === "edit" ? "Edit Link" : "Add Link"}</legend>
            <div className="flex flex-col gap-2">
              <label htmlFor="url" className="font-medium">URL</label>
              <input id="url" type="text" placeholder="https://example.com" className="p-1 rounded" value={state.url} onChange={(e) => handleOnChange({ url: e.target.value })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="title" className="font-medium">Title</label>
              <input id="title" type="text" placeholder="A css color generator" className="p-1 rounded" value={state.title} onChange={(e) => handleOnChange({ title: e.target.value })} />
            </div>
            <CategorySelect categoryId={state.category} onChange={useCallback((id) => handleOnChange({ category: id }), [])} />
            <button className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">submit</button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

function CategorySelect({ categoryId, onChange }: { categoryId: string, onChange: (id?: string) => void }) {
  const mode = categoryId ? "edit" : "new"

  const [selectedCategory, setSelectedCategory] = useState<undefined | TCategory>(undefined)
  const {
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    data: categories,
  } = useQuery<TCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      await delay()
      return mockdata.categories
    },
  })

  useEffect(() => {
    if (categories) {
      const newCategory = categories.find(cat => cat.id == categoryId)
      setSelectedCategory(newCategory)
      onChange(newCategory?.id)
    }
  }, [categories, categoryId, onChange])

  return (
    <div className="flex flex-col">
      <label htmlFor="category" className="font-medium">Category</label>
      {
        isLoadingCategories ? (
          <div className="italic text-sm text-center w-full">Loading...</div>
        ) : (
          isCategoriesError ? (
            <div className="italic text-sm text-center w-full text-red-500">Error fetching categories</div>
          ) : (
            mode === "edit" ? (
              selectedCategory ? (
                categories && (
                  <select id="category"
                    className="p-1 rounded"
                    value={selectedCategory.id}
                    onChange={(e) => {
                      const newCategory = categories.find(cat => cat.id == e.target.value)
                      setSelectedCategory(newCategory)
                      onChange(newCategory?.id)
                    }}
                  >
                    {
                      categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="line-clamp-1">{cat.title}</option>
                      ))
                    }
                  </select>
                )) : (
                <div className="italic text-sm text-center w-full text-red-500">Couldn&apos;t determine link&apos;s category</div>
              )
            ) : (
              categories && (
                <select id="category"
                  className="p-1 rounded"
                  value={categories.length > 0 ? categories[0].id : undefined}
                  onChange={(e) => {
                    const newCategory = categories.find(cat => cat.id == e.target.value)
                    setSelectedCategory(newCategory)
                    onChange(newCategory?.id)
                  }}
                >
                  {
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="line-clamp-1">{cat.title}</option>
                    ))
                  }
                </select>
              )
            )
          )
        )
      }
    </div >
  )
}


export function CategoryForm() {
  const { closeCategoryForm, selectedCategory } = useHomePageContext()
  const mode = selectedCategory ? "edit" : "add"
  const [state, setState] = useState(selectedCategory ?? { title: "" })
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }
  return (
    <div className="fixed inset-0 bg-white/50 flex flex-col items-start p-2 overflow-auto">
      <div className="flex justify-end w-full">
        <button type="button" className="justify-self-end text-xl p-4" onClick={closeCategoryForm}>close</button>
      </div>
      <div className="flex w-full h-full justify-center items-center">
        <form className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-lg font-medium text-center">{mode === "edit" ? "Edit Category" : "Add Category"}</legend>
            <div className="flex flex-col">
              <label htmlFor="title" className="font-medium">Title</label>
              <input id="title" type="text" placeholder="Interesting blog posts" className="p-1 rounded" value={state.title} onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <button className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">submit</button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
