import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserService } from "../services/userservice";
import { BlogService } from "../services/blogservice";
import type { User, BlogPost } from "../types/index";
import type { Tweet } from "../types/Tweet";
import TweetCard from "../components/TweetCard";
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt, FaLink } from "react-icons/fa";

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // determine which user to show
  // if userId param exists, use it. otherwise use current user's id
  const idToFetch = userId ? parseInt(userId) : currentUser?.id;

  useEffect(() => {
    if (!idToFetch) {
        // if no id available (e.g. not logged in and trying to view own profile), redirect to login
        if (!userId) {
            navigate("/login");
        }
        return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch user profile and posts in parallel
        const [userResponse, postsResponse] = await Promise.all([
          UserService.getUserProfile(idToFetch),
          BlogService.getPostsByUser(idToFetch)
        ]);

        setProfileUser(userResponse);
        setPosts(postsResponse.content);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Failed to load profile. User may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idToFetch, navigate, userId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading profile...</div>;
  }

  if (error || !profileUser) {
    return <div className="p-8 text-center text-red-400">{error || "User not found"}</div>;
  }

  return (
    <div>
      {/* Header / Cover Image Area */}
      <div className="h-48 bg-gray-800 relative">
        {/* You could add a real cover image here if available */}
        <div className="absolute -bottom-16 left-4">
            <div className="p-1 bg-black rounded-full">
                {profileUser.profilePictureUrl ? (
                    <img
                        src={profileUser.profilePictureUrl}
                        alt={profileUser.username}
                        className="w-32 h-32 rounded-full object-cover border-4 border-black"
                    />
                ) : (
                    <FaUserCircle className="w-32 h-32 text-gray-600 bg-black rounded-full border-4 border-black" />
                )}
            </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-20 pb-4 border-b border-gray-700">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-white">{profileUser.displayName || profileUser.username}</h1>
                <p className="text-gray-500">@{profileUser.username}</p>
            </div>
            {/* Edit Profile Button (only if viewing own profile) */}
            {currentUser?.id === profileUser.id && (
                <button className="px-4 py-1.5 border border-gray-600 rounded-full text-white font-bold hover:bg-gray-900 transition-colors">
                    Edit profile
                </button>
            )}
        </div>

        {profileUser.bio && (
            <p className="mt-4 text-white">{profileUser.bio}</p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 text-gray-500 text-sm">
            {profileUser.location && (
                <div className="flex items-center gap-1">
                    <FaMapMarkerAlt />
                    <span>{profileUser.location}</span>
                </div>
            )}
            {profileUser.website && (
                <div className="flex items-center gap-1">
                    <FaLink />
                    <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {profileUser.website.replace(/^https?:\/\//, '')}
                    </a>
                </div>
            )}
            <div className="flex items-center gap-1">
                <FaCalendarAlt />
                <span>Joined {new Date(profileUser.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <div className="flex-1 hover:bg-gray-900 transition-colors cursor-pointer">
            <div className="py-4 text-center font-bold text-white border-b-4 border-blue-500">
                Posts
            </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div>
        {posts.length > 0 ? (
            posts.map((post) => {
                // Convert BlogPost to Tweet type for TweetCard
                // This logic is duplicated from Feed.tsx - ideally should be a utility
                const authorName = post.author?.username || "Unknown Author";
                const postId = post.id?.toString() || Math.random().toString();
                const originalTimestamp = post.createdAt
                  ? typeof post.createdAt === "string"
                    ? post.createdAt
                    : new Date(post.createdAt).toISOString()
                  : new Date().toISOString();

                // Simple relative time formatter
                const getRelativeTime = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const now = new Date();
                    const diff = (now.getTime() - date.getTime()) / 1000; // seconds
                    if (diff < 60) return `${Math.floor(diff)}s`;
                    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
                    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
                    return `${Math.floor(diff / 86400)}d`;
                };

                const tweet: Tweet = {
                  id: postId,
                  userId: post.author.id,
                  username: authorName,
                  handle: `@${authorName.toLowerCase().replace(/\s+/g, "")}`,
                  content: post.excerpt || post.title || "No content available",
                  timestamp: getRelativeTime(originalTimestamp),
                  fullTimestamp: new Date(originalTimestamp).toLocaleString(),
                  likes: 0,
                  retweets: 0,
                  replies: 0,
                  views: post.viewCount || 0,
                };

                return <TweetCard key={postId} tweet={tweet} />;
            })
        ) : (
            <div className="p-8 text-center text-gray-500">
                No posts yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
