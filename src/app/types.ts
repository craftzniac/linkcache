export type TLinkItem = {
    title: string,
    url: string,
    id?: string,
    category: string
}

export type TCategory = {
    title: string,
    id: string,
    children: TLinkItem[]
}

export type TError = {
    error: string
}

export type TSimpleCategory = Omit<TCategory, "children">
