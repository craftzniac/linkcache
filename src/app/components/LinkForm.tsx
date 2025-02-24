import { useState, FormEvent } from "react"
import { TLinkItem } from "../types"
import useQuery, { delay } from "../hooks/useQuery"
import * as mockdata from "../mockData"
import { useHomePageContext } from "../contexts/HomePageProvider"

export default function LinkForm({ initialLinkData }: { initialLinkData?: TLinkItem }) {
  const mode = initialLinkData?.id ? "edit" : "new"
  const [state, setState] = useState<TLinkItem>(initialLinkData || {
    title: "", url: "", id: "", category: ""
  })
  const { closeLinkForm } = useHomePageContext()

  const {
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    data: categories,
  } = useQuery({
    queryFn: async () => {
      await delay()
      return mockdata.categories
    }
  })

  const linkCategory = categories ? categories.find(cat => cat.id === state.id) : undefined

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  const errorMsg = ""
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
              <input id="url" type="text" placeholder="https://example.com" className="p-1 rounded" value={state.url} />
              <p className="text-red-300">{errorMsg}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="title" className="font-medium">Title</label>
              <input id="title" type="text" placeholder="A css color generator" className="p-1 rounded" value={state.title} />
              <p className="text-red-300">{errorMsg}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="category" className="font-medium">Category</label>
              {
                isLoadingCategories ? (
                  <div className="italic text-sm text-center w-full">Loading...</div>
                ) : (
                  isCategoriesError ? (
                    <div className="italic text-sm text-center w-full text-red-500">Error fetching categories</div>
                  ) : (
                    categories && (
                      linkCategory ? (
                        <select id="category" className="p-1 rounded" value={linkCategory.id}>
                          {
                            categories.map(cat => (
                              <option key={cat.id} value={cat.id} className="line-clamp-1">{cat.title}</option>
                            ))
                          }
                        </select>
                      ) : (
                        <div className="italic text-sm text-center w-full text-red-500">Couldn&apos;t determine link&apos;s category</div>
                      )
                    )
                  )
                )
              }
              <p className="text-red-300">{errorMsg}</p>
            </div>
            <button className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">submit</button>
          </fieldset>
        </form>
      </div>
    </div >
  )
}
