import React from "react";
import { PostCard } from "../components/PostCard";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { IPost } from "../entity/post";

const useStyles = makeStyles((theme) => ({}));

export const TestMain = () => {
    const { loading, data } = useQuery<IPost>(FETCH_POSTS_QUERY);

    return (
        <Grid
            container
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            style={{ paddingTop: 64, height: "100vh" }}
        >
            <Grid item style={{ width: "50%" }}>
                {loading ? (
                    <h1>Loading posts...</h1>
                ) : (
                    data?.getPosts.map((post) => {
                        const data = {
                            postBody: post.body,
                            username: post.username,
                            createdAt: post.createdAt,
                            likeCount: post.likeCount,
                            commentCount: post.commentCount
                        };
                        return <PostCard postData={data} key={post.id} />;
                    })
                )}
            </Grid>
        </Grid>
    );
};

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body {
                imageUrl
                imageTitle
                postTitle
                postText
            }
            createdAt
            username
            userId
            likeCount
            commentCount
            comments {
                id
                createdAt
                username
                userId
                body
            }
            likes {
                id
                createdAt
                username
                userId
            }
        }
    }
`;
