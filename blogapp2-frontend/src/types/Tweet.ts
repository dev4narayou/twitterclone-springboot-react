// define the structure of a tweet object
// this is called a "type definition" in typescript
export interface Tweet {
    id: string;           // unique identifier for each tweet
    username: string;     // the user who posted it
    handle: string;       // the @handle (like @john_doe)
    content: string;      // the actual tweet text
    timestamp: string;    // when it was posted (relative time like "8h")
    fullTimestamp: string; // full timestamp for hover tooltip
    likes: number;        // number of likes
    retweets: number;     // number of retweets
    replies: number;      // number of replies
    views: number;        // number of views
    avatar: string;       // user's profile picture url
}
