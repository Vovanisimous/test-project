import React, { createContext, useReducer } from "react";
import {ILoginUser, IUser} from "../entity/user";
import {IContext} from "../entity/app";
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

if(localStorage.getItem("token")){
    const decodedToken: any = jwtDecode(localStorage.getItem("token") as string)

    if (decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem("token")
    }else {
        initialState.user= decodedToken
    }
}

const AuthContext = createContext<IContext>({
    user: null,
    login: (userData: ILoginUser) => {},
    logout: () => {},
});

function authReducer(state: any, action: { type: any; payload?: any }) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}

function AuthProvider(props: any) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData: IUser) {
        localStorage.setItem("token", userData.token)
        dispatch({
            type: "LOGIN",
            payload: userData,
        });
    }

    function logout() {
        localStorage.removeItem("token")
        dispatch({ type: "LOGOUT" });
    }

    return (
        <AuthContext.Provider
            value={{user: state.user, login, logout}}
            {...props}
        />
    )
}

export{AuthContext, AuthProvider}
