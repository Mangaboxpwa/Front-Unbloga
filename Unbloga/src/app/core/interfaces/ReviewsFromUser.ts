import { Manga } from "./Manga";
import { User } from "./Users";

export interface ReviewsFromUserResponse {
    result: boolean,
    message: string,
    data?: ReviewsFromUser[];
}
export interface ReviewsFromUser {
    id: number,
    review: string,
    created_at: string,
    rating: number,
    is_favorite: boolean,
    manga_id:number,
    user_id: number,
    manga:Manga,
    users:User
}