import React, {useContext} from "react";
import { Button } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useHistory} from "react-router";
import {AuthContext} from "../context/auth";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '24px',
        background: theme.palette.secondary.main,
        borderRadius: 10,
        padding: "20px 20px",
        color: theme.palette.primary.main,
        "&:hover": {
            background: "red",
            color: 'white',
        },
    },
    label: {
        fontSize: 43,
        textTransform: "capitalize",

    },
}));


export const TestButton = () => {
    const classes = useStyles();
    const context = useContext(AuthContext)
    const history = useHistory()

    const push = () => {
        if (context.user) {
            history.push("/socket")
        }else {
            history.push("/login")
        }
    }

    return (
        <Button
            variant={"text"}
            classes={{ root: classes.root, label: classes.label }}
            onClick={push}
        >
            Join our Chat!
        </Button>
    );
};
