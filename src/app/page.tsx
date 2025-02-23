"use client"
import { useState, createContext, useContext, ChangeEvent, FormEvent } from "react";

const categories = [
  {
    id: "390393023j2232j",
    title: "Software engineering blogs",
    children: [
      {
        title: "Aaron francis",
        url: "https://aaronfrancis.com/?content=all&type=article#content",
        id: "20923k2lj2lk3j2l23",
      },
      {
        title: "Justine Tunney",
        url: "https://justine.lol",
        id: "09we09u2093u029fu2f",
      },
      {
        title: "Tiger abrodi - the saiyan growth",
        url: "https://www.saiyangrowthletter.com",
        id: "-9ijijlk2n20909u323",
      },
      {
        title: "UX collective",
        url: "https://uxdesign.cc",
        id: "3i2j3nn3l09aaidfafs",
      },
    ]
  },
  {
    id: "09292932093uj2223",
    title: "UI design inspiration websites",
    children: [
      {
        title: "",
        url: "https://nabauer.com",
        id: "029jilknflakdfasodfa",
      },
      {
        title: "Pretty folio",
        url: "https://www.prettyfolio.com",
        id: "kkndfa09f0w9jfaldfaj",
      },
      {
        title: "Tiger abrodi - the saiyan growth",
        url: "https://www.helenazhang.com",
        id: "9e0wefwe20909u323",
      },
    ]
  }
]

const HomePageContext = createContext<{
  closeLinkForm: () => void,
  triggerDeleteLink: () => void,
}>({ closeLinkForm: () => { }, triggerDeleteLink: () => { } })

const useHomePageContext = () => {
  return useContext(HomePageContext)
}

export default function Home() {
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [isOpenLinkDelete, setIsOpenLinkDelete] = useState(false)
  return (
    <HomePageContext.Provider value={{ closeLinkForm: () => setShowLinkForm(false), triggerDeleteLink: () => setIsOpenLinkDelete(true) }}>
      <main className="flex p-2 justify-center overflow-y-auto mb-10">
        {
          showLinkForm && <LinkForm />
        }
        {
          isOpenLinkDelete && <ConfirmLinkDeleteDialog />
        }
        <div className="flex flex-col max-w-[30rem] w-full">
          <div className="flex w-full justify-end">
            <button
              onClick={() => setShowLinkForm(true)}
              type="button"
              className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">
              add link
            </button>
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
    </HomePageContext.Provider>
  );
}

type TLinkItem = {
  title: string,
  url: string,
  id: string
}

function LinkItem({ title, url, id }: TLinkItem) {
  const { triggerDeleteLink: triggerDelete } = useHomePageContext()
  return (
    <div key={id} className="w-full group flex flex-col">
      <div className="flex w-full justify-between gap-1 items-center">
        <h3 className={`${title ? "" : "italic"}`}>
          <a href={url} target="_blank"> {title || "<No Title>"} </a>
        </h3>
        <div className="flex gap-1 text-sm">
          <button type="button" className="hover:bg-gray-100 px-2 py-1 rounded">Edit</button>
          <button type="button" className="text-red-400 px-2 py-1 hover:bg-red-100 rounded" >Del</button>
        </div>
      </div>
      <a href={url} target="_blank" className="text-blue-600/50 group-hover:text-blue-600 transition-colors text-sm">{url}</a>
    </div>
  )
}

function ConfirmLinkDeleteDialog({ title, description }: { title: string, description: string }) {
  return (
    <div className="fixed inset-0 bg-white/50 flex flex-col justify-center p-2 overflow-auto">
      <form className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow" onSubmit={handleSubmit}>
        <h3>Confirm Delete Link</h3>
        <p>Do you wish to proceed to deleting this link?</p>
        <div className="flex justify-end gap-1 text-sm">
          <button type="button" className="rounded px-2 py-1 text-red-400">Delete</button>
          <button type="button" className="rounded px-2 py-1">Cancel</button>
        </div>
      </form>
    </div>
  )
}


function LinkForm({ initialLinkData }: { initialLinkData?: TLinkItem }) {
  const [state, setState] = useState<Omit<typeof initialLinkData, "id">>(initialLinkData || {
    title: "", url: ""
  })
  const { closeLinkForm } = useHomePageContext()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  const errorMsg = ""
  return (
    <div className="fixed inset-0 bg-white/50 flex flex-col justify-center p-2 overflow-auto">
      <div className="flex justify-end w-full">
        <button type="button" className="justify-self-end text-xl p-4" onClick={closeLinkForm}>close</button>
      </div>

      <div className="w-full h-full justify-center items-center flex border-gray-300">
        <form className="flex flex-col max-w-[20rem] w-full bg-gray-100 rounded p-4 shadow" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-lg font-medium text-center">Add Link</legend>
            <div className="flex flex-col gap-2">
              <label htmlFor="url" className="font-medium">URL</label>
              <input id="url" type="text" placeholder="https://example.com" className="p-1 rounded" />
              <p className="text-red-300">{errorMsg}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="title" className="font-medium">Title</label>
              <input id="title" type="text" placeholder="A css color generator" className="p-1 rounded" />
              <p className="text-red-300">{errorMsg}</p>
            </div>
            <button className="rounded bg-blue-900/70 hover:bg-blue-900/90 transition-colors px-2 py-1 text-white">submit</button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
