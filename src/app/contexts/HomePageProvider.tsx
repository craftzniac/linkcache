import { useState, createContext, ReactNode, useContext, useEffect } from "react"
import { TLinkItem, TCategory } from "../types"

type TSimpleCategory = Omit<TCategory, "children">

const HomePageContext = createContext<{
  closeLinkForm: () => void,
  triggerDeleteLink: (link: TLinkItem) => void,
  openLinkForm: (link?: TLinkItem) => void
  isShowLinkForm: boolean,
  isShowLinkConfirmDelete: boolean,
  selectedLink: TLinkItem | null,
  cancelDeleteLink: () => void,
  proceedDeleteLink: () => void
  openCategoryForm: (category?: TSimpleCategory) => void,
  isShowCategoryForm: boolean,
  selectedCategory: TSimpleCategory | null,
  closeCategoryForm: () => void,
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

  function proceedDeleteLink() {
    // make api call to delete link
    console.log("deleting links")
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
      }
    }}>
      {children}
    </HomePageContext.Provider>
  )


}
