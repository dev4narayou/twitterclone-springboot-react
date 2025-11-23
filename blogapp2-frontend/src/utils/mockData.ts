import type { Tweet } from '../types/Tweet';

// mock data - this is fake data to help us build the ui
// in a real app, this would come from an api or database
export const MOCK_TWEETS: Tweet[] = [
    {
        id: '1',
        userId: 101,
        username: 'John Doe',
        handle: '@johndoe',
        content: 'Just setting up my Twitter clone! 🚀 #coding #react',
        timestamp: '2h',
        fullTimestamp: '10:30 AM · Nov 15, 2023',
        likes: 15,
        retweets: 4,
        replies: 2,
        views: 1205,
    },
    {
        id: '2',
        userId: 102,
        username: 'Jane Smith',
        handle: '@janesmith',
        content: 'Loving the new features in Next.js 14. Server actions are a game changer! 💻',
        timestamp: '4h',
        fullTimestamp: '8:15 AM · Nov 15, 2023',
        likes: 42,
        retweets: 12,
        replies: 5,
        views: 3400,
    },
    {
        id: '3',
        userId: 103,
        username: 'Tech Insider',
        handle: '@techinsider',
        content: 'Breaking: AI models are getting faster and more efficient. Here is what you need to know. 🤖',
        timestamp: '6h',
        fullTimestamp: '6:00 AM · Nov 15, 2023',
        likes: 156,
        retweets: 89,
        replies: 24,
        views: 15000,
    },
    {
        id: '4',
        userId: 104,
        username: 'Nature Lover',
        handle: '@nature_photo',
        content: 'Beautiful sunset today! 🌅',
        timestamp: '1d',
        fullTimestamp: '6:45 PM · Nov 14, 2023',
        likes: 89,
        retweets: 15,
        replies: 8,
        views: 5600,
    }
];
