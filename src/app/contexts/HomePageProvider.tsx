"use client"
import { useState, createContext, ReactNode, useContext } from "react"
import { TLink, TSimpleCategory } from "../types"
import Link from "../datasource/models/Link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { objectStores } from "../constants"

const HomePageContext = createContext<{
  closeLinkForm: () => void,
  openLinkForm: (link?: TLink) => void
  isShowLinkForm: boolean,
  isShowLinkConfirmDelete: boolean,
  editableLink: TLink | null,
  triggerDeleteLink: (linkId: string) => void,
  closeDeleteLinkDialog: () => void,
  proceedDeleteLink: () => void
  openCategoryForm: (category?: TSimpleCategory) => void,
  isShowCategoryForm: boolean,
  selectedCategory: TSimpleCategory | null,
  closeCategoryForm: () => void,
  triggerDeleteCategory: (cat: TSimpleCategory) => void,
  closeDeleteCategoryDialog: () => void,
  proceedDeleteCategory: () => void,
  isShowCategoryConfirmDelete: boolean,
  isDeletingLink: boolean,
}>({
  closeLinkForm: () => { },
  triggerDeleteLink: () => { },
  openLinkForm: () => { },
  isShowLinkForm: false,
  isShowLinkConfirmDelete: false,
  editableLink: null,
  closeDeleteLinkDialog: () => { },
  proceedDeleteLink: () => { },
  openCategoryForm: () => { },
  isShowCategoryForm: false,
  selectedCategory: null,
  closeCategoryForm: () => { },
  triggerDeleteCategory: () => { },
  closeDeleteCategoryDialog: () => { },
  proceedDeleteCategory: () => { },
  isShowCategoryConfirmDelete: false,
  isDeletingLink: false,
})

export const useHomePageContext = () => {
  return useContext(HomePageContext)
}

export default function HomePageProvider({ children }: { children: ReactNode }) {
  const [isShowLinkConfirmDelete, setIsShowLinkConfirmDelete] = useState(false);
  const [editableLink, setEditableLink] = useState<null | TLink>(null);
  const [isShowLinkForm, setIsShowLinkForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | TSimpleCategory>(null);
  const [isShowCategoryForm, setIsShowCategoryForm] = useState(false);
  const [isShowCategoryConfirmDelete, setIsShowCategoryConfirmDelete] = useState(false);
  const [delLinkId, setDelLinkId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutateAsync: deleteLink, isPending: isDeletingLink } = useMutation({
    mutationFn: () => {
      return Link.delete({ id: delLinkId as string })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [objectStores.CATEGORIES] });
    }
  });


  async function proceedDeleteLink() {
    // make api call to delete link
    await deleteLink();
    // close the link delete dialog
    closeDeleteLinkDialog();
  }

  function proceedDeleteCategory() {
    // make api call to delete category
    console.log("deleting category")
  }

  function openLinkForm(link?: TLink) {
    setEditableLink(
      link ?? null
    )
    setIsShowLinkForm(true)
  }

  function closeLinkForm() {
    setIsShowLinkForm(false);
  }

  function triggerDeleteLink(linkId: string) {
    setIsShowLinkConfirmDelete(true)
    setDelLinkId(linkId);
  }

  function closeDeleteLinkDialog() {
    setIsShowLinkConfirmDelete(false);
    setDelLinkId(null);
  }

  function openCategoryForm(category?: TSimpleCategory) {
    setSelectedCategory(category ?? null)
    setIsShowCategoryForm(true)
  }

  function closeCategoryForm() {
    setIsShowCategoryForm(false)
  }

  function triggerDeleteCategory(cat: TSimpleCategory) {
    setIsShowCategoryConfirmDelete(true)
    setSelectedCategory(cat)
  }

  function closeDeleteCategoryDialog() {
    setIsShowCategoryConfirmDelete(false)
    setSelectedCategory(null)
  }

  return (
    <HomePageContext.Provider value={{
      closeLinkForm,
      openLinkForm,
      isShowLinkForm,
      triggerDeleteLink,
      closeDeleteLinkDialog,
      proceedDeleteLink,
      isShowLinkConfirmDelete,
      editableLink,
      openCategoryForm,
      isShowCategoryForm,
      selectedCategory,
      closeCategoryForm,
      triggerDeleteCategory,
      closeDeleteCategoryDialog,
      proceedDeleteCategory,
      isShowCategoryConfirmDelete,
      isDeletingLink
    }}>
      {children}
    </HomePageContext.Provider>
  )


}
