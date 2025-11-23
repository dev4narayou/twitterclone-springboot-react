import { useState, useEffect } from "react";
import TweetCard from "./TweetCard";
import TweetComposer from "./TweetComposer";
import { BlogService } from "../services/blogservice";
import type { BlogPost } from "../types/index";
import type { Tweet } from "../types/Tweet";

// utility function to format timestamps as relative time
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInMilliseconds = now.getTime() - postTime.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? "1m" : `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    // for older posts, show the date
    return postTime.toLocaleDateString();
  }
};

const Feed = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BlogService.getAllPosts(1, 20);
      setPosts(response.content);
    } catch (err) {
      console.error("failed to fetch posts:", err);
      setError("failed to load posts. please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black">
      <div className="px-4 py-3 border-b border-gray-700 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-white">Home</h1>
      </div>

      <TweetComposer onPostCreated={fetchPosts} />

      <div className="h-2 bg-gray-900 border-b border-gray-700"></div>

      <div>
        {loading && (
          <div className="p-8 text-center text-gray-400">loading posts...</div>
        )}

        {error && <div className="p-8 text-center text-red-400">{error}</div>}

        {!loading && !error && posts.length > 0 && (
          <>
            {posts.map((post) => {
              const authorName = post.author?.username || "unknown author";
              const postId = post.id?.toString() || Math.random().toString();
              const originalTimestamp = post.createdAt
                ? typeof post.createdAt === "string"
                  ? post.createdAt
                  : new Date(post.createdAt).toISOString()
                : new Date().toISOString();
              const relativeTime = formatRelativeTime(originalTimestamp);
              const fullTimestamp = new Date(
                originalTimestamp
              ).toLocaleString();

              const tweet: Tweet = {
                id: postId,
                userId: post.author.id,
                username: authorName,
                handle: `@${authorName.toLowerCase().replace(/\s+/g, "")}`,
                content: post.excerpt || post.title || "no content available",
                timestamp: relativeTime,
                fullTimestamp: fullTimestamp,
                likes: 0,
                retweets: 0,
                replies: 0,
                views: post.viewCount || Math.floor(Math.random() * 1000) + 100,
              };

              return <TweetCard key={postId} tweet={tweet} />;
            })}
          </>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="p-8 text-center text-gray-400">no posts found</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
