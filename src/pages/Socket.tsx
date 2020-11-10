import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import { transport } from "../Transport";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import moment from "moment";
import { isString, mapValues, set } from "lodash";
import axios from "axios";
import SendIcon from '@material-ui/icons/Send';
import {AuthContext} from "../context/auth";

interface IMessage {
    _id: string;
    images: string[];
    username: string;
    message: string;
    date: string;
}

const useStyles = makeStyles((theme) => ({
    mainGridRoot: {
        margin: "80px 0px 10px 0px",
        [theme.breakpoints.down("xs")]: {
            margin: "60px 0px 0px 0px",
        },
    },
    paperGridRoot: {
        width: "50vw",
        height: "50vh",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            height: "50vh",
        },
    },
    paperRoot: {
        height: "100%",
        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 80%)`,
        padding: 30,
        [theme.breakpoints.down("xs")]: {
            height: "100%",
            background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 80%)`,
            padding: "10px 10px 25px 10px",
        },
    },
    ulStyles: {
        color: "blue",
        fontWeight: theme.typography.fontWeightBold,
        listStyle: "none",
        padding: "0px 30px",
        [theme.breakpoints.down("xs")]: {
            color: "blue",
            fontWeight: theme.typography.fontWeightBold,
            listStyle: "none",
            padding: "0px 10px",
        },
    },
    liStyles: {
        overflow: "hidden",
    },
    textFieldRoot: {
        width: "100%",
    },
    inputGrid: {
        marginTop: 20,
        padding: 10,
        width: "50%",
        textAlign: "center",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "black",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            padding: 5,
            marginTop: 5,
            textAlign: "center",
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 4,
        },
    },
    buttonRoot: {
        margin: "0px 0px 0px 10px",
        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 80%)`,
    },
    buttonLabel: {
        color: "white",
    },
    messageStyles: {
        color: "white",
        fontWeight: theme.typography.fontWeightRegular,
        margin: "10px 0px",
        padding: 10,
        background: theme.palette.secondary.main,
        borderRadius: 10,
        width: "fit-content",
    },
    someoneIsTypingStyles: {
        color: "white",
        fontWeight: theme.typography.fontWeightMedium,
        marginTop: 5,
    },
    dateStyles: {
        color: theme.palette.secondary.main,
        fontWeight: theme.typography.fontWeightRegular,
    },
    errorStyles: {
        color: theme.palette.error.main,
        fontWeight: theme.typography.fontWeightBold,
    },
    uploadImagesStyles: {
        maxWidth: "100%",
        display: "block",
        height: 50,
        borderRadius: 4,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        margin: "0px 10px",
        cursor: "pointer",
    },
    messageImagesStyles: {
        maxWidth: "100%",
        height: 100,
        borderRadius: 4,
        display: "block",
        borderStyle: "solid",
        borderWidth: 1,
        margin: 5,
    },
    uploadedImagesContainerRoot: {
        margin: "10px 0px",
    },
}));

const formatToFormData = (params: {}): FormData => {
    const formData = new FormData();
    mapValues(params, (value: string | File, key: any) => {
        const isFile = !isString(value) && (value as {}) instanceof File;
        if (!isFile && !isString(value)) {
            return formData.append(key, JSON.stringify(value));
        }
        formData.append(key, value);
    });
    return formData;
};

interface IFile {
    url: string;
    file: File;
}

export const Socket = () => {
    const classes = useStyles();
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);
    const [counter, setCounter] = useState(0);
    const [messages, setMessages] = useState<IMessage[]>( []);
    const [typing, setTyping] = useState(false);
    const [typingUser, setTypingUser] = useState("");
    const [error, setError] = useState(false);
    const [removeImagesButton, setRemoveImagesButton] = useState(false);
    let interval: number;
    const context = useContext(AuthContext);
    const socket = io("http://localhost:8080", {
        transports: ["websocket"],
        reconnection: true,
        autoConnect: false,
    });
    const onSendMessage = () => {
        if (message !== "") {
            const params = {
                user: context.user,
                message,
                date: moment().toISOString(),
            };
            files.map((item, index) => set(params, `file${index + 1}`, item.file));
            axios.post("http://localhost:8080/messages", formatToFormData(params)).then(() => {
                setMessage("");
                setFiles([]);
            });
        } else setError(true);
    };

    const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList) {
            return;
        }
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i);
            if (!file) {
                return;
            }
            const url = URL.createObjectURL(file);
            files.push({ url, file });
        }
        setFiles([...files]);
        setRemoveImagesButton(true);
    };

    const onRemoveImage = (index: number) => {
        files.splice(index, 1);
        setFiles([...files]);
        if (files.length === 0) {
            setRemoveImagesButton(false);
            setFiles([]);
        }
    };

    const onRemoveImages = () => {
        setFiles([]);
        setRemoveImagesButton(false);
    };

    socket.on("connect", () => {
        console.log(`Connection: ${socket.connected}`);
    });

    socket.on('connect_error', () => {
        console.log(`Connection: ${socket.connected}`)
        setTimeout(() => {
            socket.connect();
        }, 2000);
    });

    socket.on('disconnect', () => {
        console.log(`Connection: ${socket.connected}`)
        setTimeout(() => {
            socket.connect();
        }, 500);
    });

    socket.on("/messages", () => {
        console.log("Getting messages");
        transport.get<IMessage[]>("/messages").then((response) => {
            setMessages(response);
        });
    });
    socket.on("typing", (data: { name: string }) => {
        console.log("Getting typing");
        setTypingUser(data.name);
        setTyping(true);
    });
    socket.on("stoppedTyping", () => {
        console.log("Getting stoppedTyping");
        setTypingUser("");
        setTyping(false);
    });

    useEffect(() => {
        console.log("Hello");
        socket.connect();
        transport.get<IMessage[]>("messages").then((response) => {
            setMessages(response);
        });
    }, []);

    useEffect(() => {
        console.log(counter);
        if (counter === 1) {
            socket.connect()
            console.log("send event typing");
            socket.emit("typing", {
                name: context.user,
            });
        }
        if (counter === 0) {
            socket.connect()
            console.log("send event stoppedTyping");
            socket.emit("stoppedTyping");
        }
    }, [counter]);

    function KeyDOWN() {
        if (message.length === 150) {
            setCounter(0);
            return
        }
        if (counter < 2) setCounter(counter + 1);
        // while (interval--) {
            window.clearTimeout(interval);
        // }
    }

    function keyUP() {
        if (message.length === 150) {
            setCounter(0);
            return
        }
        if (!interval) {
            interval = window.setTimeout(function () {
                setCounter(0);
            }, 3000);
        }


    }

    return (
        <div style={{ marginTop: 64 }}>
            <Grid
                container
                wrap={"nowrap"}
                justify={"center"}
                alignItems={"center"}
                direction={"column"}
                classes={{ root: classes.mainGridRoot }}
            >
                <Grid classes={{ root: classes.paperGridRoot }}>
                    <Paper classes={{ root: classes.paperRoot }}>
                        <Paper style={{ height: "100%", overflowY: "scroll" }}>
                            <ul className={classes.ulStyles}>
                                {messages.map((object, index) => (
                                    <li key={index} className={classes.liStyles}>
                                        {object.username}{" "}
                                        <span className={classes.dateStyles}>
                                            ({moment(object.date).calendar()})
                                        </span>
                                        :{" "}
                                        <div className={classes.messageStyles}>
                                            {object.message}
                                        </div>
                                        <Grid item container>
                                            {object.images &&
                                                object.images.map((item, index) => (
                                                    <img
                                                        className={classes.messageImagesStyles}
                                                        src={item}
                                                        alt=""
                                                        key={index}
                                                    />
                                                ))}
                                        </Grid>
                                    </li>
                                ))}
                            </ul>
                        </Paper>
                        {typing && (
                            <div className={classes.someoneIsTypingStyles}>
                                {typingUser ? typingUser : "Someone"} is typing...
                            </div>
                        )}
                    </Paper>
                </Grid>
                <Grid item classes={{ root: classes.inputGrid }}>
                    <Grid item>
                        <TextField
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setError(false);
                            }}
                            classes={{ root: classes.textFieldRoot }}
                            multiline={true}
                            placeholder={"Type your message"}
                            rows={2}
                            inputProps={{ maxLength: 150 }}
                            variant={"outlined"}
                            value={message}
                            style={{ marginTop: 10 }}
                            required
                            onKeyDown={KeyDOWN}
                            onKeyUp={keyUP}
                        >
                            {message}
                        </TextField>
                        {error && (
                            <div className={classes.errorStyles}>
                                You have to write your name and a message!
                            </div>
                        )}
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            justify={"center"}
                            classes={{ root: classes.uploadedImagesContainerRoot }}
                        >
                            {files.map((item, index) => (
                                <img
                                    key={index}
                                    src={item.url}
                                    className={classes.uploadImagesStyles}
                                    alt={""}
                                    onClick={(e) => {
                                        onRemoveImage(index);
                                    }}
                                />
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item style={{ textAlign: "end" }}>
                        {removeImagesButton && (
                            <Button
                                color={"secondary"}
                                variant={"contained"}
                                component={"span"}
                                style={{ color: "white", marginLeft: 10 }}
                                onClick={onRemoveImages}
                            >
                                Remove images
                            </Button>
                        )}
                        <label htmlFor={"upload"}>
                            <input
                                id={"upload"}
                                type={"file"}
                                name={"picture"}
                                accept={"image/*"}
                                style={{ display: "none" }}
                                multiple
                                onChange={onChangeFile}
                            />
                            <img id={"upload"} alt={""} />
                            <Button
                                color={"secondary"}
                                variant={"contained"}
                                component={"span"}
                                style={{ color: "white", marginLeft: 10 }}
                            >
                                Upload image
                            </Button>
                        </label>
                        <Button
                            onClick={onSendMessage}
                            variant={"contained"}
                            classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}
                        >
                            <SendIcon/>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
