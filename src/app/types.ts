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
