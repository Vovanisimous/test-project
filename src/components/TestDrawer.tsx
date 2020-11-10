import React, {useContext} from "react";
import { List, ListItem, ListItemIcon } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import Drawer from "@material-ui/core/Drawer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Divider from "@material-ui/core/Divider";
import {useHistory} from "react-router";
import {AuthContext} from "../context/auth";

interface IProps {
    open: boolean;

    onClose(): void;
}

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    listItemRoot: {
        "&:hover": {
            background: theme.palette.secondary.main,
        },
    },
}));

export const TestDrawer = (props: IProps) => {
    const classes = useStyles();
    const context = useContext(AuthContext)
    const history = useHistory()

    const push = () => {
        if (context.user) {
            history.push("/socket")
        }else {
            history.push("/login")
        }
        props.onClose()
    }

    const pushMain = () => {
        history.push("/")
        props.onClose()
    }

    const list = () => (
        <div className={classes.list} role="presentation">
            {!context.user && (
                <div>
                    <List>
                        <ListItem
                            button
                            component="a"
                            key={"login"}
                            classes={{ root: classes.listItemRoot }}
                            href="/login"
                        >
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Login"} />
                        </ListItem>
                        <ListItem
                            button
                            component="a"
                            key={"register"}
                            classes={{ root: classes.listItemRoot }}
                            href="/friendlist"
                        >
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Register"} />
                        </ListItem>
                    </List>
                    <Divider />
                </div>
            )}
            <List>
                <ListItem
                    button
                    component="a"
                    key={"main"}
                    classes={{ root: classes.listItemRoot }}
                    onClick={pushMain}
                >
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Main"} />
                </ListItem>
                <ListItem
                    button
                    key={"chat"}
                    classes={{ root: classes.listItemRoot }}
                    onClick={push}
                >
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Chat"} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Drawer anchor={"left"} open={props.open} onClose={props.onClose}>
            {list()}
        </Drawer>
    );
};
