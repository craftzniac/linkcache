"use client"
import { useHomePageContext } from "../contexts/HomePageProvider"
import { TLink } from "../types"
import { CopyBtn, DeleteBtn, EditBtn } from "./buttons"

export default function Link({ title, url, id, category }: TLink) {
  const { triggerDeleteLink: triggerDelete, openLinkForm } = useHomePageContext()
  return (
    <a href={url} target="_blank" key={id} className="w-full group flex flex-col" >
      <div className="flex w-full flex-col">
        <h3 className={`text-xl flex w-full ${title ? "" : "italic"}`}>
          {title || "<No Title>"}
        </h3>
        <p className="text-blue-600/20 group-hover:text-blue-600 transition-colors text-base">{url}</p>
      </div>
      <div className="flex gap-1 w-full justify-between">
        <CopyBtn text={url} />
        <div className="flex gap-1">
          <EditBtn action={(e) => {
            e.preventDefault();
            openLinkForm({ title, url, id, category })
          }} />
          <DeleteBtn action={(e) => {
            e.preventDefault();
            triggerDelete(id);
          }} />
        </div>
      </div>
    </a>
  )
}
