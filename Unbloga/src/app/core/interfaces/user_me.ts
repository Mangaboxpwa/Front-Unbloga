import { Reviews } from "./Reviews";
import { User } from "./Users";

export interface UserMeResponse {
    result: boolean,
    message: string,
    data?: UserMe;
}
export interface UserMe {
    id: number,
    avatar_url: string,
    email: string,
    name: string,
    is_following:boolean,
    reviews:Reviews[],
    following:User[],
    followers:User[],
}