"use client"
import { TCategory } from "../types"
import { useHomePageContext } from "../contexts/HomePageProvider"
import Link from "./Link"

export default function Category(cat: TCategory) {
  const { openCategoryForm, triggerDeleteCategory: triggerDelete } = useHomePageContext()
  return (
    <article key={cat.id} className="w-full">
      <header className="w-full flex gap-2 items-center">
        <h2 className="text-lg font-medium">{cat.title}</h2>
        <div className="flex items-center">
          <button type="button" className="hover:bg-gray-100 px-2 py-1 rounded text-sm" onClick={() => openCategoryForm({ title: cat.title, id: cat.id })}>Edit</button>
          <button type="button" className="hover:bg-red-100 text-red-400 px-2 py-1 rounded text-sm" onClick={() => triggerDelete({ id: cat.id, title: cat.title })}>Del</button>
        </div>
      </header>
      <ul className="flex flex-col gap-3 w-full">
        {cat.children.map(link => (
          <li key={link.id}><Link {...link} /></li>
        ))}
      </ul>
    </article>
  )
}
