import React, {useContext, useEffect, useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import {useMutation} from "@apollo/client";
import {useHistory} from "react-router";
import gql from "graphql-tag";
import {AuthContext} from "../context/auth";

const useStyles = makeStyles((theme) => ({
    mainGridRoot: {
        height: "100%",
        marginTop: 64
    },
    labelStyles: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.h6.fontSize,
    },
    textFieldRoot: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    buttonRoot: {
        margin: theme.spacing(1),
        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 80%)`,
        color: "white",
    },
    ulStyle: {
        color: "red",
        padding: 10,
        border: "solid",
        listStyle: "none"
    },
    error: {
        color: theme.palette.error.main,
    },
}));

const schema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().required("Password is required"),
});

export const Login = () => {
    const classes = useStyles();
    const history = useHistory();
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: () => {
            loginUser();
        }
    });

    const [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}) {
            context.login(userData)
            history.push("/")
        },
        onError(err) {
            if(err.graphQLErrors[0].extensions) console.log(err.graphQLErrors[0].extensions.exception.errors)
            if(err.graphQLErrors[0].extensions) setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: formik.values,
    })


    return (
        <Grid
            container
            wrap={"nowrap"}
            justify={"center"}
            alignItems={"center"}
            alignContent={"center"}
            classes={{ root: classes.mainGridRoot }}
        >
            <Grid item>
                <form onSubmit={formik.handleSubmit} id={"formElement"}>
                    <Grid item container justify={"center"} direction={"column"}>
                        <label htmlFor={"email"} className={classes.labelStyles}>
                            Username
                        </label>
                        <TextField
                            id={"username"}
                            type={"text"}
                            {...formik.getFieldProps("username")}
                            placeholder={"Enter your username"}
                            variant={"outlined"}
                            size={"small"}
                            classes={{ root: classes.textFieldRoot }}
                        />
                    </Grid>
                    <Grid item container justify={"center"} direction={"column"}>
                        <label htmlFor={"password"} className={classes.labelStyles}>
                            Password
                        </label>
                        <TextField
                            id={"password"}
                            type={"password"}
                            {...formik.getFieldProps("password")}
                            placeholder={"Enter your password"}
                            variant={"outlined"}
                            size={"small"}
                            classes={{ root: classes.textFieldRoot }}
                        />
                    </Grid>
                    <Grid item container justify={"center"} alignItems={"center"}>
                        <Button
                            variant={"contained"}
                            type="submit"
                            classes={{ root: classes.buttonRoot }}
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid>
                        {Object.keys(errors).length > 0 && (
                            <div>
                                <ul className={classes.ulStyle}>
                                    {Object.values(errors).map((value: any, index) => (
                                        <li key={index}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
            username: $username
            password: $password 
        ) {
            _id
            email
            username
            createdAt
            token
        }
    }
`
