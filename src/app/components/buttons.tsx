"use client"
import { MouseEventHandler, useState } from "react"
import { IconCopy, IconEdit, IconTrash, IconX } from "../assets/icons"
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


export function CopyBtn({ text }: { text: string }) {
  const [showIsCopiedMsg, setIsCopiedMsg] = useState(false);
  async function alertCopied() {
    setIsCopiedMsg(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsCopiedMsg(false);
        resolve(null);
      }, 1000);
    })
  }
  return (
    <button type="button" className="hover:bg-gray-100 p-2 rounded" onClick={async (e) => {
      e.preventDefault();
      // copy the url to the clipboard
      try {
        await window.navigator.clipboard.writeText(text);
        alertCopied();
      } catch {
        alert("Oops, couldn't access clipboard");
      }
    }}>
      {showIsCopiedMsg ? (
        <p className="text-green-700 text-sm">copied!</p>
      ) : (
        <IconCopy />
      )}
    </button>
  )
}

export function DeleteBtn({ action }: { action: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button type="button" className="hover:bg-red-100 text-red-400 p-2 rounded text-sm" onClick={action}>
      <IconTrash />
    </button>
  )
}

export function EditBtn({ action }: { action: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button type="button" className="hover:bg-gray-100 p-2 rounded" onClick={action}>
      <IconEdit />
    </button>
  )
}

export function CloseBtn({ action }: { action: () => void }) {
  return (
    <div className="flex justify-end w-full">
      <button type="button" className="justify-self-end text-xl p-3 hover:bg-gray-100 transition-colors duration-300 rounded-full" onClick={action}>
        <IconX />
      </button>
    </div>
  )
}
