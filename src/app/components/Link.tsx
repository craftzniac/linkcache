"use client"
import { useHomePageContext } from "../contexts/HomePageProvider"
import { TLink } from "../types"

export default function Link({ title, url, id, category }: TLink) {
  const { triggerDeleteLink: triggerDelete, openLinkForm } = useHomePageContext()

  return (
    <div key={id} className="w-full group flex flex-col">
      <div className="flex w-full justify-between gap-1 items-center">
        <h3 className={`${title ? "" : "italic"}`}>
          <a href={url} target="_blank"> {title || "<No Title>"} </a>
        </h3>
        <div className="flex gap-1 text-sm">
          <button type="button" className="hover:bg-gray-100 px-2 py-1 rounded" onClick={() => openLinkForm({ title, url, id, category })}>Edit</button>
          <button type="button" className="text-red-400 px-2 py-1 hover:bg-red-100 rounded" onClick={() => triggerDelete(id)}>Del</button>
        </div>
      </div>
      <a href={url} target="_blank" className="text-blue-600/50 group-hover:text-blue-600 transition-colors text-sm">{url}</a>
    </div>
  )
}
