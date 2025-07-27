import { apiRequest } from "./api";
import type {
    PaginatedResponse,
    BlogPost
} from "../types/index";
import { AuthService } from "./authservice";
import { AuthenticationError, ValidationError, BlogServiceError } from "../types/index";
import type { CreatePostRequest } from "../types/index";

export const BlogService = {
    // note to self: this is an object literal with methods
    // shorthand syntax for defining methods in an object is used
    // this is called a service object / namespace object pattern
    // easy to import e.g `import { BlogService } from '../services/blogservice';`

    // get all blogs
    async getAllPosts(page = 1, limit = 10): Promise<PaginatedResponse<BlogPost>> {
        // spring data jpa pages are 0-indexed, so subtract 1 from frontend page number
        const springPage = page - 1;
        return await apiRequest<PaginatedResponse<BlogPost>>(
            `/posts?page=${springPage}&size=${limit}`
        );
    },

    // create new blog post
    async createPost(postData: CreatePostRequest): Promise<BlogPost> {
        // auth check
        if (!AuthService.isAuthenticated()) {
            throw new AuthenticationError("you must be logged in to create a post");
        }

        // validation
        if (!postData.title?.trim()) {
            throw new ValidationError("post title is required");
        }
        if (!postData.content?.trim()) {
            throw new ValidationError("post content is required");
        }
        if (postData.title.length > 255) {
            throw new ValidationError("title must be 255 characters or less");
        }

        try {
            // prepare the request data
            const createRequest: CreatePostRequest = {
                title: postData.title.trim(),
                content: postData.content.trim(),
                excerpt: postData.excerpt?.trim() || postData.content.substring(0, 300).trim(),
                tags: postData.tags || [],
                published: postData.published ?? false, // default to draft
                coverImageUrl: postData.coverImageUrl
            };

            return await apiRequest<BlogPost>("/posts", {
                method: "POST",
                body: JSON.stringify(createRequest),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                // handle specific api errors
                if (error.message.includes('401')) {
                    throw new AuthenticationError("session expired, please log in again");
                }
                if (error.message.includes('400')) {
                    throw new ValidationError(`invalid post data: ${error.message}`);
                }
                if (error.message.includes('403')) {
                    throw new BlogServiceError("insufficient permissions", 403);
                }
            }

            throw new BlogServiceError(
                `failed to create post: ${error instanceof Error ? error.message : 'unknown error'}`
            );
        }
    },

}