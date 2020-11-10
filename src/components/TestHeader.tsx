import React, { useContext, useState } from "react";
import { AppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from "@material-ui/icons/Menu";
import { TestDrawer } from "./TestDrawer";
import { AccountCircle } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {AuthContext} from "../context/auth";

const useStyle = makeStyles((theme) => ({
    appBarRoot: {
        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 80%)`,
    },
    menuIconRoot: {
        color: theme.palette.primary.main,
    },
    avatarDivStyles: {
        display: "flex",
        alignItems: "center",
        marginLeft: "auto"
    }
}));

export const TestHeader = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const classes = useStyle();
    const context = useContext(AuthContext);

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        context.logout()
        setAnchorEl(null);
    }

    return (
        <div>
            <AppBar classes={{ root: classes.appBarRoot }} position={"fixed"}>
                <Toolbar>
                    <IconButton edge={"start"} onClick={toggleDrawer}>
                        <MenuIcon fontSize={"large"} classes={{ root: classes.menuIconRoot }} />
                    </IconButton>
                    {context.user && (
                        <div className={classes.avatarDivStyles}>
                            <div>{context.user?.username}</div>
                            <IconButton onClick={handleMenu}>
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={logout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <TestDrawer open={openDrawer} onClose={toggleDrawer} />
        </div>
    );
};
