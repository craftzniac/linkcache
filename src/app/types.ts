export type TLink = {
    title: string,
    url: string,
    id: string,
    category: string
}

export type TNewLink = Omit<TLink, "id">

export type TCategory = {
    title: string,
    id: string,
    children: TLink[]
}

export type TError = {
    error: string
}

export type TSimpleCategory = Omit<TCategory, "children">
