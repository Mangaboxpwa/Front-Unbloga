export interface AuthorsResponse {
    result: boolean,
    message: string,
    data?: Authors[];
}

export interface Authors {
    id: number,
    name: string,
}