import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Card } from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from '@material-ui/icons/Comment'
import moment from 'moment'

export interface PostCardProps {
    postData: {
        postBody: {
            imageUrl: string;
            imageTitle: string;
            postTitle: string;
            postText: string;
        };
        username: string;
        createdAt: string;
        likeCount: number;
        commentCount: number;
    };
}

const useStyles = makeStyles((theme) => ({
    cardRoot: {
        margin: theme.spacing(3),
        width: "100%",
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
    },
    media: {
        height: 140,
    },
    title: {
        color: theme.palette.primary.main,
    },
    iconButtonRoot: {
      padding: 7
    },
    likeCountStyle: {
        marginLeft: 5,
        height: 25
    }
}));

export const PostCard = (props: PostCardProps) => {
    const { postBody, username, createdAt, likeCount, commentCount } = props.postData;
    const classes = useStyles();

    return (
        <Card className={classes.cardRoot}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        U
                    </Avatar>
                }
                title={username}
                subheader={moment(createdAt).fromNow(true)}
            />
            <CardMedia
                className={classes.media}
                image={postBody.imageUrl}
                title={postBody.imageTitle}
            />
            <CardContent style={{ height: "fit-content" }}>
                <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                    {postBody.postTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {postBody.postText}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton classes={{root: classes.iconButtonRoot}}>
                    <FavoriteIcon />
                    <span className={classes.likeCountStyle}>{likeCount}</span>
                </IconButton>
                <IconButton classes={{root: classes.iconButtonRoot}}>
                    <CommentIcon style={{marginTop: 5}}/>
                    <span className={classes.likeCountStyle}>{commentCount}</span>
                </IconButton>
            </CardActions>
        </Card>
    );
};
