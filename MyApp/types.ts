export type RootStackParamList = {
    Authors: undefined,
    BooksList: { author: string }
}

export interface PageData {
    page: number,
    per_page: number,
    total: number,
    total_pages: number
    data: AuthorData[]
    [extraProps: string]: any
}

export interface AuthorData {
    author: string,
    title?: string | null,
    story_title?: string | null,
    [extraProps: string]: any
}