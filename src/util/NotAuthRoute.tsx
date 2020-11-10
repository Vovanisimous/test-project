import React, {useContext} from "react";
import {Route, Redirect} from 'react-router-dom'

import {AuthContext} from "../context/auth";

const  NotAuthRoute = ({component: Component, ...rest}: any) => {
    const {user} = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? <Component {...props}/> : <Redirect to={"/"} />
            }
        />
    )
}

export default NotAuthRoute