"use client"

import { ExportBtn } from "./buttons"

export default function Header() {
  return (
    <header className="font-bold flex w-full p-2 text-lg items-center">
      <h1 className="text-start w-full">Linkcache</h1>
      <div className="flex">
        <ExportBtn />
        {
          // <ImportBtn action={() => { }} />
        }
      </div>
    </header>
  )
}
