import { useState, createContext, ReactNode, useContext } from "react"
import { TLinkItem } from "../types"


const HomePageContext = createContext<{
  closeLinkForm: () => void,
  triggerDeleteLink: (link: TLinkItem) => void,
  openLinkForm: (link?: TLinkItem) => void
  isShowLinkForm: boolean,
  isShowLinkConfirmDelete: boolean,
  selectedLink: TLinkItem | null,
  cancelDeleteLink: () => void,
  proceedDeleteLink: () => void
}>({
  closeLinkForm: () => { },
  triggerDeleteLink: () => { },
  openLinkForm: () => { },
  isShowLinkForm: false,
  isShowLinkConfirmDelete: false,
  selectedLink: null,
  cancelDeleteLink: () => { },
  proceedDeleteLink: () => { },
})

export const useHomePageContext = () => {
  return useContext(HomePageContext)
}


export default function HomePageProvider({ children }: { children: ReactNode }) {
  const [isShowLinkConfirmDelete, setIsShowLinkConfirmDelete] = useState(false)
  const [selectedLink, setSelectedLink] = useState<null | TLinkItem>(null)
  const [isShowLinkForm, setIsShowLinkForm] = useState(false)

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
    }}>
      {children}
    </HomePageContext.Provider>
  )


}
