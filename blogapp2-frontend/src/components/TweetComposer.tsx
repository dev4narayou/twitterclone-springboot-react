import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BlogService } from "../services/blogservice";
import { useAuth } from "../contexts/AuthContext";

interface TweetComposerProps {
  onPostCreated?: () => void;
}

const TweetComposer = ({ onPostCreated }: TweetComposerProps) => {
  const [tweetText, setTweetText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevents the page from refreshing
    setError(null);

    if (tweetText.trim()) {
      try {
        // get the first two words of the tweet text, or the whole text if less than two words
        const words = tweetText.trim().split(/\s+/);
        const title = words.slice(0, 2).join(" ");
        await BlogService.createPost({
          title,
          content: tweetText,
          published: true, // make sure tweets are published immediately
        });
        // clear the input after posting
        setTweetText("");
        // refresh the feed to show the new post
        onPostCreated?.();
      } catch (error: any) {
        console.error("Failed to create post:", error);
        if (error.message && error.message.includes("Content must be at least 10 characters")) {
             setError("Post must be at least 10 characters long.");
        } else if (error.message && error.message.includes("Validation failed")) {
             // try to extract specific validation error if possible, otherwise generic
             setError("Validation failed. Please check your post length.");
        } else {
             setError("Failed to post. Please try again.");
        }
      }
    }
  };

  // if not authenticated, disable
  if (!isAuthenticated) {
    return (
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="text-gray-500 text-center py-8">
              Please log in to post tweets
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <FaUserCircle className="w-10 h-10 text-gray-500" />
          </div>
          <div className="flex-1">
            <textarea
              value={tweetText}
              onChange={(e) => {
                  setTweetText(e.target.value);
                  if (error) setError(null);
              }}
              placeholder="what's happening?"
              className="w-full bg-transparent border-none text-white text-xl resize-none min-h-[80px] py-3 font-sans placeholder:text-gray-500 focus:outline-none"
              maxLength={280} // twitter's character limit
            />

            {error && (
                <div className="text-red-500 text-sm mb-2">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-500 text-sm">
                {280 - tweetText.length} characters remaining
              </span>
              <button
                type="submit"
                className="bg-blue-500 text-white border-none rounded-full px-6 py-2 font-semibold cursor-pointer transition-colors hover:bg-blue-600 disabled:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!tweetText.trim()} // disable if no text
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
