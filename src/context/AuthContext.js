import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser : JSON.parse(localStorage.getItem("user")) || null,
    // token: JSON.parse(localStorage.getItem("access_token")) || null,
    token: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state,dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.currentUser))
        localStorage.setItem("access_token", state.token);
    }, [state.currentUser, state.token]);
    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, token: state.token, dispatch }} >
            {children}
        </AuthContext.Provider>
    );
}