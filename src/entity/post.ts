export interface IPost {
    getPosts: {
        id: string;
        body: {
            imageUrl: string;
            imageTitle: string;
            postTitle: string;
            postText: string;
        };
        username: string;
        userId: string;
        createdAt: string;
        comments: {
            body: string;
            username: string;
            userId: string;
            createdAt: string;
        }[];
        likes: {
            username: string;
            userId: string;
            createdAt: string;
        }[];
        likeCount: number;
        commentCount: number;
    }[];
}
