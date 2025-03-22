"use client"
import { useState, createContext, ReactNode, useContext } from "react"
import { TLinkItem, TSimpleCategory } from "../types"

const HomePageContext = createContext<{
  closeLinkForm: () => void,
  openLinkForm: (link?: TLinkItem) => void
  isShowLinkForm: boolean,
  isShowLinkConfirmDelete: boolean,
  selectedLink: TLinkItem | null,
  triggerDeleteLink: (link: TLinkItem) => void,
  cancelDeleteLink: () => void,
  proceedDeleteLink: () => void
  openCategoryForm: (category?: TSimpleCategory) => void,
  isShowCategoryForm: boolean,
  selectedCategory: TSimpleCategory | null,
  closeCategoryForm: () => void,
  triggerDeleteCategory: (cat: TSimpleCategory) => void,
  cancelDeleteCategory: () => void,
  proceedDeleteCategory: () => void,
  isShowCategoryConfirmDelete: boolean,
}>({
  closeLinkForm: () => { },
  triggerDeleteLink: () => { },
  openLinkForm: () => { },
  isShowLinkForm: false,
  isShowLinkConfirmDelete: false,
  selectedLink: null,
  cancelDeleteLink: () => { },
  proceedDeleteLink: () => { },
  openCategoryForm: () => { },
  isShowCategoryForm: false,
  selectedCategory: null,
  closeCategoryForm: () => { },
  triggerDeleteCategory: () => { },
  cancelDeleteCategory: () => { },
  proceedDeleteCategory: () => { },
  isShowCategoryConfirmDelete: false,
})

export const useHomePageContext = () => {
  return useContext(HomePageContext)
}


export default function HomePageProvider({ children }: { children: ReactNode }) {
  const [isShowLinkConfirmDelete, setIsShowLinkConfirmDelete] = useState(false)
  const [selectedLink, setSelectedLink] = useState<null | TLinkItem>(null)
  const [isShowLinkForm, setIsShowLinkForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<null | TSimpleCategory>(null)
  const [isShowCategoryForm, setIsShowCategoryForm] = useState(false)
  const [isShowCategoryConfirmDelete, setIsShowCategoryConfirmDelete] = useState(false)

  function proceedDeleteLink() {
    // make api call to delete link
    console.log("deleting links")
  }

  function proceedDeleteCategory() {
    // make api call to delete category
    console.log("deleting category")
  }

  return (
    <HomePageContext.Provider value={{
      closeLinkForm: () => setIsShowLinkForm(false),
      openLinkForm: (link?: TLinkItem) => {
        setSelectedLink(
          link ?? null
        )
        setIsShowLinkForm(true)
      },
      isShowLinkForm,
      triggerDeleteLink: (link: TLinkItem) => {
        setIsShowLinkConfirmDelete(true)
        setSelectedLink(link)
      },
      cancelDeleteLink: () => {
        setIsShowLinkConfirmDelete(false)
        setSelectedLink(null)
      },
      proceedDeleteLink,
      isShowLinkConfirmDelete,
      selectedLink,
      openCategoryForm: (category?: TSimpleCategory) => {
        setSelectedCategory(category ?? null)
        setIsShowCategoryForm(true)
      },
      isShowCategoryForm,
      selectedCategory,
      closeCategoryForm: () => {
        setIsShowCategoryForm(false)
      },

      triggerDeleteCategory: (cat: TSimpleCategory) => {
        setIsShowCategoryConfirmDelete(true)
        setSelectedCategory(cat)
      },
      cancelDeleteCategory: () => {
        setIsShowCategoryConfirmDelete(false)
        setSelectedCategory(null)
      },
      proceedDeleteCategory,
      isShowCategoryConfirmDelete,
    }}>
      {children}
    </HomePageContext.Provider>
  )


}
