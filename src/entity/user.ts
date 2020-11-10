export interface IUser {
    username: string;
    email: string;
    _id: string;
    createdAt: string;
    token: string;
}

export interface ILoginUser {
    username: string,
    password: string
}