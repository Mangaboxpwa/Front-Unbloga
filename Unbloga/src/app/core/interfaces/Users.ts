export interface UsersResponse {
    result: boolean,
    message: string,
    data?: User;
}
export interface User {
    id: number,
    avatar_url: string,
    email: string,
    name: string,
}