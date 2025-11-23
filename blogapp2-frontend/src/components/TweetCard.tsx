import { Link } from "react-router-dom";
import type { Tweet } from "../types/Tweet";
import { FaRegComment, FaRetweet, FaRegHeart, FaUserCircle } from "react-icons/fa";

// this is called a "props interface" - it defines what data this component expects
interface TweetCardProps {
  tweet: Tweet; // we expect to receive a tweet object
}

// this is a functional component that takes props as input
const TweetCard = ({ tweet }: TweetCardProps) => {
  return (
    <div className="p-4 border-b border-gray-700 hover:bg-gray-900/50 cursor-pointer transition-colors">
      {/* user info section */}
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <FaUserCircle className="w-10 h-10 text-gray-500" />
        </div>
        <div className="flex-1">
          {/* user info line */}
          <div className="flex items-center gap-1 mb-1">
            <Link
              to={`/profile/${tweet.userId}`}
              className="font-bold text-white hover:underline"
              onClick={(e: React.MouseEvent) => e.stopPropagation()} // prevent triggering the card click
            >
              {tweet.username}
            </Link>
            <Link
              to={`/profile/${tweet.userId}`}
              className="text-gray-500 hover:text-gray-400"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {tweet.handle}
            </Link>
            <span className="text-gray-500">·</span>
            <span
              className="text-gray-500 hover:underline"
              title={tweet.fullTimestamp}
            >
              {tweet.timestamp}
            </span>
          </div>

          {/* tweet content */}
          <div className="mb-3">
            <p className="text-[15px] leading-tight break-words text-white">
              {tweet.content}
            </p>
          </div>

          {/* action buttons */}
          <div className="flex justify-between items-center max-w-md">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-transparent text-gray-400 rounded-lg border border-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <FaRegComment size={16} />
              <span className="text-sm font-medium">{tweet.replies}</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-transparent text-gray-400 rounded-lg border border-gray-700 hover:border-green-500 hover:text-green-500 transition-colors">
              <FaRetweet size={16} />
              <span className="text-sm font-medium">{tweet.retweets}</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-transparent text-gray-400 rounded-lg border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
              <FaRegHeart size={16} />
              <span className="text-sm font-medium">{tweet.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
