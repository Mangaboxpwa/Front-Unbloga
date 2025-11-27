export interface ReviewsResponse {
    result: boolean,
    message: string,
    data?: Reviews[];
}
export interface Reviews {
    id: number,
    review: string,
    created_at: string,
    rating: number,
    is_favorite: boolean,
    manga_id:number,
    user_id: number,
}