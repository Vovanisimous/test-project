import React from "react";
import { ThemeProvider } from "@material-ui/core/styles/";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";
import { TestHeader } from "../components/TestHeader";
import { TestMain } from "../pages/TestMain";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Register} from "../pages/Register";
import {Test} from "../components/RegisterForm";
import {Socket} from "../pages/Socket";
import {transport} from "../Transport";
import {Login} from "../pages/Login";
import {AuthProvider} from "../context/auth";
import AuthRoute from "../util/AuthRoute";
import NotAuthRoute from "../util/NotAuthRoute";

transport.init("http://localhost:8080")

function App() {

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Router>
                    <CssBaseline />
                    <TestHeader />
                    <Switch>
                        <Route exact path={"/"} component={TestMain} />
                        <AuthRoute exact path={"/friendlist"} component={Register} />
                        <Route exact path={"/test"} component={Test} />
                        <NotAuthRoute exact path={"/socket"} component={Socket} />
                        <AuthRoute exact path={"/login"} component={Login} />
                    </Switch>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
