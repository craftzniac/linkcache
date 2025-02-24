"use client"
import { FormEvent } from "react";
import { TLinkItem } from "./types";
import { categories } from "./mockData";
import LinkForm from "./components/LinkForm";
import HomePageProvider, { useHomePageContext } from "./contexts/HomePageProvider";


export default function Home() {
  return (
    <HomePageProvider>
      <main className="flex p-2 justify-center overflow-y-auto mb-10">
        <RenderDialogs />
        <div className="flex flex-col max-w-[30rem] w-full">
          <div className="flex w-full justify-end">
            <AddLinkBtn />
          </div>
          <div className="flex flex-col gap-8 w-full">
            {
              categories.map(cat => (
                <article key={cat.id} className="w-full">
                  <h2 className="text-lg font-medium">{cat.title}</h2>
                  <ul className="flex flex-col gap-3 w-full">
                    {cat.children.map(link => (
                      <li key={link.id}><LinkItem {...link} /></li>
                    ))}
                  </ul>
                </article>
              ))
            }
          </div>
        </div>
      </main>
    </HomePageProvider>
  );
}

function RenderDialogs() {
  const { isShowLinkForm, isShowLinkConfirmDelete } = useHomePageContext()
  return (
    <>
      {
        isShowLinkForm && <LinkForm />
      }
      {
        isShowLinkConfirmDelete && <ConfirmLinkDeleteDialog />
      }
    </>
  )
}

function AddLinkBtn() {
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


function LinkItem({ title, url, id, category }: TLinkItem) {
  const { triggerDeleteLink: triggerDelete, openLinkForm } = useHomePageContext()

  return (
    <div key={id} className="w-full group flex flex-col">
      <div className="flex w-full justify-between gap-1 items-center">
        <h3 className={`${title ? "" : "italic"}`}>
          <a href={url} target="_blank"> {title || "<No Title>"} </a>
        </h3>
        <div className="flex gap-1 text-sm">
          <button type="button" className="hover:bg-gray-100 px-2 py-1 rounded" onClick={() => openLinkForm({ title, url, id, category })}>Edit</button>
          <button type="button" className="text-red-400 px-2 py-1 hover:bg-red-100 rounded" onClick={() => triggerDelete({ title, url, id, category })}>Del</button>
        </div>
      </div>
      <a href={url} target="_blank" className="text-blue-600/50 group-hover:text-blue-600 transition-colors text-sm">{url}</a>
    </div>
  )
}

function ConfirmLinkDeleteDialog() {
  const { selectedLink, cancelDeleteLink, proceedDeleteLink } = useHomePageContext()
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }
  return (
    <div className="fixed inset-0 bg-white/70 flex flex-col justify-center items-center p-2 overflow-auto">
      <form className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow gap-2" onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium">Confirm Delete</h3>
        <div className="flex flex-col w-full">
          <p className="opacity-90">Do you wish to delete the link?</p>
          <a href={selectedLink?.url} target="_blank" className="text-blue-600/70 hover:text-blue-600 transition-colors text-sm line-clamp-1">{selectedLink?.url}</a>
        </div>
        <div className="flex justify-end gap-1 text-sm">
          <button type="button" className="rounded px-2 py-1 text-red-400" onClick={proceedDeleteLink}>Delete</button>
          <button type="button" className="rounded px-2 py-1" onClick={cancelDeleteLink}>Cancel</button>
        </div>
      </form>
    </div>
  )
}


