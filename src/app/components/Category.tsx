"use client"
import { TCategory } from "../types"
import { useHomePageContext } from "../contexts/HomePageProvider"
import Link from "./Link"
import { DeleteBtn, EditBtn } from "./buttons"

export default function Category(cat: TCategory) {
  const { openCategoryForm, triggerDeleteCategory: triggerDelete } = useHomePageContext()
  return (
    <article key={cat.id} className="w-full">
      <header className="w-full flex gap-2 items-center">
        <h2 className="text-xl font-medium">{cat.title}</h2>
        <div className="flex items-center">
          <EditBtn action={() => openCategoryForm({ title: cat.title, id: cat.id })} />
          <DeleteBtn action={() => triggerDelete({ id: cat.id, title: cat.title })} />
        </div>
      </header>
      <ul className="flex flex-col gap-6 w-full">
        {cat.children.map(link => (
          <li key={link.id}><Link {...link} /></li>
        ))}
      </ul>
    </article>
  )
}
