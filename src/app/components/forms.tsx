import { useState, FormEvent, useEffect, useCallback } from "react"
import { TCategory, TError, TLink, TNewLink } from "../types"
import { useHomePageContext } from "../contexts/HomePageProvider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CategoryModel from "../datasource/models/Category"
import LinkModel from "../datasource/models/Link"
import { isValidUrl } from "../utils"
import { objectStores } from "../constants"

export function LinkForm() {
  const defaultState = {
    title: "", url: "", category: ""
  };
  const { closeLinkForm, editableLink } = useHomePageContext();
  const mode = editableLink?.id ? "edit" : "new";
  const [state, setState] = useState<TLink | TNewLink>(editableLink || defaultState);
  const [errorUrl, setErrorUrl] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync: addLinkMut, isPending: isAddLinkPending } = useMutation({
    mutationFn: async (newLink: TNewLink) => {
      return LinkModel.add(newLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [objectStores.CATEGORIES] });
    }
  })

  const { mutateAsync: editLinkMut, isPending: isEditLinkPending } = useMutation({
    mutationFn: async (link: TLink) => {
      return LinkModel.update(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [objectStores.CATEGORIES] });
    }
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const errors = {
      errorUrl: "",
      errorTitle: ""
    }

    // input validation
    if (!state.url) {
      errors.errorUrl = "Url should not be empty";
    } else if (isValidUrl(state.url) == false) {
      errors.errorUrl = "The text is not a valid url";
    } else {
      errors.errorUrl = "";
    }

    if (!state.title) {
      errors.errorTitle = "Title should not be empty";
    } else {
      errors.errorTitle = "";
    }


    setErrorTitle(errors.errorTitle);
    setErrorUrl(errors.errorUrl);
    if (errors.errorTitle || errors.errorUrl) {   // force user to handle validation errors before submitting form
      return;
    }

    if (mode === "edit") {
      await editLinkMut(state as TLink);
    } else {
      await addLinkMut(state);
      // clear state
      setState({ ...defaultState });
    }
  }

  function handleOnChange(update: { [key in keyof Partial<TLink>]: string }) {
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
              <p className="text-red-400 text-sm">{errorUrl}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="title" className="font-medium">Title</label>
              <input id="title" type="text" placeholder="A css color generator" className="p-1 rounded" value={state.title} onChange={(e) => handleOnChange({ title: e.target.value })} />
              <p className="text-red-400 text-sm">{errorTitle}</p>
            </div>
            <CategorySelect mode={mode} categoryId={state.category} onChange={useCallback((id) => handleOnChange({ category: id }), [])} />
            <button className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white" disabled={isAddLinkPending || isEditLinkPending}>submit</button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

function CategorySelect({ categoryId, onChange, mode }: { categoryId: string, onChange: (id?: string) => void, mode: "edit" | "new" }) {

  const [selectedCategory, setSelectedCategory] = useState<undefined | TCategory>(undefined)
  const {
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    data: categories,
    error,
  } = useQuery<TCategory[], TError>({
    queryKey: ["categories"],
    queryFn: async () => {
      return CategoryModel.getAllWithContent()
    },
  })

  // Select a default category. Use the first category 
  useEffect(() => {
    if (categories) {
      if (!categoryId) {
        const defaultCategory = categories[0];
        setSelectedCategory(defaultCategory);
        onChange(defaultCategory.id);
      }
    }
  }, [categories, onChange, categoryId])

  useEffect(() => {  // update category in form state whenever selectedCategory is updated
    if (categories) {
      onChange(selectedCategory?.id || "");
    }
  }, [onChange, selectedCategory, categories])

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
                  value={selectedCategory?.id}
                  onChange={(e) => {
                    setSelectedCategory(() => categories.find(cat => cat.id == e.target.value))
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("state:", state)

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
