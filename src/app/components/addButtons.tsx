"use client"
import { useHomePageContext } from "../contexts/HomePageProvider"
export function AddLinkBtn() {
  const { openLinkForm } = useHomePageContext()
  return (
    <button
      onClick={() => openLinkForm()}
      type="button"
      className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">
      add link
    </button>
  )
}

export function AddCategoryBtn({ isPrimary = false }: { isPrimary?: boolean }) {
  const { openCategoryForm } = useHomePageContext()
  return (
    <button
      onClick={() => openCategoryForm()}
      type="button"
      className={`rounded  transition-colors px-2 py-1 ${isPrimary ? "bg-blue-900/70 hover:bg-blue-900/90 text-white" : "border-gray-900/10 hover:border-gray-900/50 text-blue-950 border-2"}`}>
      add category
    </button>
  )
}

