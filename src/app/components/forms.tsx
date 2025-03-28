import { useState, FormEvent, useEffect, useCallback } from "react"
import { TCategory, TError, TLink, TNewLink, TSimpleCategory } from "../types"
import { useHomePageContext } from "../contexts/HomePageProvider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CategoryModel from "../datasource/models/Category"
import LinkModel from "../datasource/models/Link"
import { isValidUrl } from "../utils"
import { objectStores } from "../constants"
import { CloseBtn } from "./buttons"

export function LinkForm() {
  const defaultState = {
    title: "", url: "", category: ""
  };
  const { closeLinkForm, editableLink } = useHomePageContext();
  const mode = editableLink?.id ? "edit" : "new";
  const [state, setState] = useState<TLink | TNewLink>(editableLink || defaultState);
  const [errorUrl, setErrorUrl] = useState("");
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

    // input validation
    if (!state.url) {
      setErrorUrl("Url should not be empty");
      return;
    }

    if (isValidUrl(state.url) == false) {
      setErrorUrl("The text is not a valid url");
      return;
    }

    setErrorUrl("");

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
      <CloseBtn action={closeLinkForm} />

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
  const {
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    data: categories,
  } = useQuery<TCategory[], TError>({
    queryKey: ["categories"],
    queryFn: async () => {
      return CategoryModel.getAllWithContent()
    },
  })

  const [selectedCategory, setSelectedCategory] = useState<undefined | TCategory>(() => {
    if (mode == "new") {
      if (categories) {
        return categories[0]
      }
    } else {
      if (categories) {
        return categories.find(cat => cat.id == categoryId)
      }
    }
  })

  useEffect(() => {  // update parent form state whenever user selects a different category 
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
  const initialState = { title: "" };
  const { closeCategoryForm, selectedCategory } = useHomePageContext();
  const mode = selectedCategory ? "edit" : "add";
  const [state, setState] = useState(mode === "edit" ? (selectedCategory as TSimpleCategory) : initialState);
  const [errorTitle, setErrorTitle] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync: addCategoryMut, isPending: isAddPending } = useMutation({
    mutationFn: (title: string) => {
      return CategoryModel.add(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [objectStores.CATEGORIES] });
    }
  });

  const { mutateAsync: updateCategoryMut, isPending: isUpdatePending } = useMutation({
    mutationFn: (cat: TSimpleCategory) => {
      return CategoryModel.update(cat);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [objectStores.CATEGORIES] });
    }
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!state.title) {
      setErrorTitle("Title should not be empty");
      return;
    }
    setErrorTitle("");
    if (mode === "edit") {
      await updateCategoryMut(state as TSimpleCategory);
    } else {
      await addCategoryMut(state.title);
      // clear form state
      setState(initialState);
    }
  }

  return (
    <div className="fixed inset-0 bg-white/50 flex flex-col items-start p-2 overflow-auto">
      <CloseBtn action={closeCategoryForm} />
      <div className="flex w-full h-full justify-center items-center">
        <form className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-lg font-medium text-center">{mode === "edit" ? "Edit Category" : "Add Category"}</legend>
            <div className="flex flex-col">
              <label htmlFor="title" className="font-medium">Title</label>
              <input id="title" type="text" placeholder="Interesting blog posts" className="p-1 rounded" value={state.title} onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))} />
              <p className="text-red-400 text-sm">{errorTitle}</p>
            </div>
            <button disabled={isAddPending || isUpdatePending} className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">{isAddPending || isUpdatePending ? "submitting..." : "submit"}</button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
