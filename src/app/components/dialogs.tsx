"use client"
import { useHomePageContext } from "../contexts/HomePageProvider"
import { CategoryForm, LinkForm } from "./forms"

export function ConfirmCategoryDeleteDialog() {
  const { closeDeleteCategoryDialog, proceedDeleteCategory, isDeletingCategory } = useHomePageContext()
  return <ConfirmDeleteDialog isDeleting={isDeletingCategory} close={closeDeleteCategoryDialog} proceed={proceedDeleteCategory} msg="Permanently delete this category?" />
}

export function ConfirmLinkDeleteDialog() {
  const { closeDeleteLinkDialog, proceedDeleteLink, isDeletingLink } = useHomePageContext()
  return <ConfirmDeleteDialog isDeleting={isDeletingLink} close={closeDeleteLinkDialog} proceed={proceedDeleteLink} msg="Are you sure you want this link deleted?" />
}

function ConfirmDeleteDialog({ msg, close, proceed, isDeleting = false }: { msg: string, close: () => void, proceed: () => void, isDeleting?: boolean }) {
  return (
    <div className="fixed inset-0 bg-white/70 flex flex-col justify-center items-center p-2 overflow-auto">
      <div className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow gap-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Confirm Delete</h3>
          <p className="opacity-90">{msg}</p>
        </div>
        <div className="flex justify-end gap-1 text-sm mt-2">
          <button type="button" className="rounded px-2 py-1 text-red-400" onClick={proceed}>{isDeleting ? "Deleting..." : "Delete"}</button>
          <button type="button" className="rounded px-2 py-1 text-white bg-blue-900/70 hover:bg-blue-900/90 transition-colors" onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  )
}


export function RenderDialogs() {
  const {
    isShowLinkForm,
    isShowLinkConfirmDelete,
    isShowCategoryForm,
    isShowCategoryConfirmDelete,
  } = useHomePageContext()
  return (
    <>
      {
        isShowLinkForm && <LinkForm />
      }
      {
        isShowLinkConfirmDelete && <ConfirmLinkDeleteDialog />
      }
      {
        isShowCategoryForm && <CategoryForm />
      }
      {
        isShowCategoryConfirmDelete && <ConfirmCategoryDeleteDialog />
      }
    </>
  )
}
