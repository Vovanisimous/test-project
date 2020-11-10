import React, {ReactPortal, useContext, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Field, FieldProps, Formik, useField, useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory} from "react-router";
import{AuthContext} from "../context/auth";

interface IValues {
    firstName: string;
    lastName: string;
    email: string;
}

const useStyles = makeStyles((theme) => ({
    formItem: {
        padding: theme.spacing(1),
    },
    gridItemContainer: {
        padding: theme.spacing(1),
    },
    inputField: {
        borderRadius: 4,
        height: 30,
    },
    buttonRoot: {
        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 80%)`,
    },
    buttonLabel: {
        color: "white",
    },
    error: {
        color: theme.palette.error.main,
    },
    inputLabel: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.h6.fontSize,
    },
    ulStyle: {
        color: "red",
        padding: 10,
        border: "solid",
        listStyle: "none"
    }
}));

const schema = Yup.object().shape({
    username: Yup.string()
        .required("Username is required")
        .max(15, "Must be 15 characters or less"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm your password!"),
});

export const RegisterForm = () => {
    const classes = useStyles();
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const context = useContext(AuthContext)

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: (values) => {
            addUser();
        },
        // validationSchema: schema,
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}) {
            context.login(userData)
            history.push('/')
        },
        onError(err){
            if(err.graphQLErrors[0].extensions) console.log(err.graphQLErrors[0].extensions.exception.errors)
            if(err.graphQLErrors[0].extensions) setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: formik.values,
    });

    return (
        <div style={{ flexGrow: 1, height: "100%" }}>
            <Grid container wrap={"nowrap"} justify={"center"} alignItems={"center"}>
                <Grid item>
                    {loading ? (
                        <CircularProgress color="secondary" style={{alignSelf: "center", marginTop: 300}}/>
                    ) : (
                        <form onSubmit={formik.handleSubmit} id={"formElem"}>
                            <Grid
                                classes={{ container: classes.gridItemContainer }}
                                container
                                item
                                direction="column"
                            >
                                <label htmlFor={"username"} className={classes.inputLabel}>
                                    Username:
                                </label>
                                <input
                                    id={"name"}
                                    type={"text"}
                                    {...formik.getFieldProps("username")}
                                    placeholder={"Enter your username"}
                                    className={classes.inputField}
                                />
                            </Grid>
                            <Grid
                                container
                                classes={{ container: classes.gridItemContainer }}
                                item
                                direction={"column"}
                            >
                                <label htmlFor={"email"} className={classes.inputLabel}>
                                    Email:
                                </label>
                                <input
                                    id={"email"}
                                    type={"email"}
                                    {...formik.getFieldProps("email")}
                                    className={classes.inputField}
                                    placeholder={"Enter your email"}
                                />
                                {/*{formik.errors.email && formik.touched.email ? (*/}
                                {/*    <div className={classes.error}>{formik.errors.email}</div>*/}
                                {/*) : null}*/}
                            </Grid>
                            <Grid
                                container
                                classes={{ container: classes.gridItemContainer }}
                                item
                                className={classes.formItem}
                                direction={"column"}
                            >
                                <label htmlFor="password" className={classes.inputLabel}>
                                    Password:
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...formik.getFieldProps("password")}
                                    className={classes.inputField}
                                    placeholder={"Enter your password"}
                                />
                                {/*{formik.errors.password && formik.touched.password ? (*/}
                                {/*    <div className={classes.error}>{formik.errors.password}</div>*/}
                                {/*) : null}*/}
                            </Grid>
                            <Grid
                                container
                                classes={{ container: classes.gridItemContainer }}
                                item
                                className={classes.formItem}
                                direction={"column"}
                            >
                                <label htmlFor="confirmPassword" className={classes.inputLabel}>
                                    Password confirmation:
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    {...formik.getFieldProps("confirmPassword")}
                                    className={classes.inputField}
                                    placeholder={"Confirm your password"}
                                />
                                {/*{formik.errors.confirmPassword && formik.touched.confirmPassword ? (*/}
                                {/*    <div className={classes.error}>*/}
                                {/*        {formik.errors.confirmPassword}*/}
                                {/*    </div>*/}
                                {/*) : null}*/}
                            </Grid>
                            <Grid
                                container
                                item
                                className={classes.formItem}
                                alignItems={"center"}
                                justify={"center"}
                            >
                                <Button
                                    classes={{
                                        root: classes.buttonRoot,
                                        label: classes.buttonLabel,
                                    }}
                                    type="submit"
                                    variant={"contained"}
                                >
                                    Register
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
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            _id
            email
            username
            createdAt
            token
        }
    }
`;

function TestField({ name }: { name: string }) {
    return (
        <Field name={name}>
            {(form: FieldProps) => (
                <>
                    <TextField {...form.field} />
                    {form.meta.error && <p style={{ color: "red" }}>{form.meta.error}</p>}
                </>
            )}
        </Field>
    );
}

export const Test = () => {
    const [value, setValue] = useState<any>({});

    const send = (data: any) => {
        setValue({
            firstName: "john",
            lastName: "doe",
            email: "sdas@dasd.da",
        });
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={value}
                enableReinitialize={true}
                render={(props) => (
                    <div style={{ marginTop: 100 }}>
                        <div>
                            <TestField name={"firstName"} />
                        </div>
                        <div>
                            <TestField name={"lastName"} />
                        </div>
                        <div>
                            <TestField name={"email"} />
                        </div>
                        <Button onClick={props.submitForm}>submit</Button>
                    </div>
                )}
            />
            <button onClick={send}>fill</button>
        </>
    );
};

interface ITextInputProps {
    label: string;
    name: string;
    id?: string;
    type: string;
    placeholder: string;
}

export const MyTextInput = ({ label, ...props }: ITextInputProps) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input className={"text-input"} {...field} {...props} />
            {meta.touched && meta.error ? <div className={"error"}>{meta.error}</div> : null}
        </>
    );
};
