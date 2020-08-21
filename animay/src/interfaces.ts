
export interface mediaObject {
    title: {english: string},
    coverImage: {large: string}
}

export interface mediaCollection {
    media: mediaObject[]
}

export interface pageObject {
    Page: mediaCollection
}

export interface searchVars {
    search: string
}

export interface SearchInputProps {
    searchQuery: string,
    setsearchQuery: any //2 lazy
}

export interface SearchViewProps {
    data: pageObject
}