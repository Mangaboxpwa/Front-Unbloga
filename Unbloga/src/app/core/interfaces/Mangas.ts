export interface MangasResponse {
	result: boolean,
	message: string,
	data?: Mangas[];
}

export interface Mangas {
	id: number,
	title: string,
    pubication_date: string,
    description: string,
	cover_url: string,
	rating_count: number
}