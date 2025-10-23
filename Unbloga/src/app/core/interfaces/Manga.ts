import { Authors } from "./Authors";

export interface MangaResponse {
    result: boolean,
    message: string,
    data?: Manga;
}

export interface Manga {
    id: number,
    title: string,
    publication_date: string,
    description: string,
    cover_url: string,
    rating_count: number,
    authors: Authors[]
}