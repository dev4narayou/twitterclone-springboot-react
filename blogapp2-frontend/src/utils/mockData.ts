import type { Tweet } from '../types/Tweet';

// mock data - this is fake data to help us build the ui
// in a real app, this would come from an api or database
export const mockTweets: Tweet[] = [
    {
        id: '1',
        username: 'John Doe',
        handle: '@johndoe',
        content: 'just built my first react component! 🚀 #coding #react',
        timestamp: '2h',
        fullTimestamp: '2 hours ago',
        likes: 12,
        retweets: 3,
        replies: 5,
        views: 1100,
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: '2',
        username: 'Jane Smith',
        handle: '@janesmith',
        content: 'beautiful sunset today! sometimes you just need to stop and appreciate the little things in life ✨',
        timestamp: '4h',
        fullTimestamp: '4 hours ago',
        likes: 28,
        retweets: 7,
        replies: 12,
        views: 10000,
        avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
        id: '3',
        username: 'Tech Guru',
        handle: '@techguru',
        content: 'hot take: typescript makes javascript development so much better. the type safety alone is worth the learning curve',
        timestamp: '6h',
        fullTimestamp: '6 hours ago',
        likes: 45,
        retweets: 15,
        replies: 23,
        views: 616000,
        avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
        id: '4',
        username: 'Coffee Lover',
        handle: '@coffeelover',
        content: 'third cup of coffee today... is that too much? asking for a friend ☕️',
        timestamp: '8h',
        fullTimestamp: '8 hours ago',
        likes: 67,
        retweets: 12,
        replies: 34,
        views: 317,
        avatar: 'https://i.pravatar.cc/150?img=4'
    }
];
