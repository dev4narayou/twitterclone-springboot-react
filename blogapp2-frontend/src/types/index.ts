

export interface User {
    id: number;
    username: string; // fixed to match backend field name
    displayName?: string;
    bio?: string;
    website?: string;
    location?: string;
    joinedAt: string;
    postCount?: number;
    email?: string; // optional since it's not always returned in responses
    profilePictureUrl?: string;
}

export interface BlogPost {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    author: User;
    createdAt: string;
    updatedAt?: string;
    published?: boolean;
    tags?: string[];
    coverImageUrl?: string;
    viewCount: number;
    commentCount: number;
}

// dto
export interface CreatePostRequest {
    title: string,
    content: string;
    excerpt?: string;
    tags?: string[];
    published?: boolean;
    coverImageUrl?: string;
}

// error types for better error handling
export class BlogServiceError extends Error {
    public statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'BlogServiceError';
        this.statusCode = statusCode;
    }
}

export class AuthenticationError extends BlogServiceError {
    constructor(message = "authentication required") {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends BlogServiceError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export interface PaginatedResponse<T> {
    content: T[]; // backend uses 'content' not 'data'
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
