import {ILoginUser, IUser} from "./user";

export interface IContext {
    user: IUser | null;
    login: (userData: ILoginUser) => void;
    logout: () => void
}