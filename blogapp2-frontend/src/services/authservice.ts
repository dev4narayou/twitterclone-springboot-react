import { apiRequest } from "./api";

interface UserResponse {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    tokenType: string;
    id: number;
    username: string;
    email: string;
}

interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
}

export const AuthService = {
    // login user
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return await apiRequest<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    },

    // register new user
    async register(userData: RegisterRequest): Promise<UserResponse> {
        return await apiRequest<UserResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    // logout user
    logout(): void {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
    },

    // check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem("authToken");
        return token !== null && token !== "undefined" && token !== "null" && token.trim() !== "";
    },

    // get current user from local storage
    getCurrentUser(): { id: number; username: string; email?: string } | null {
        const userStr = localStorage.getItem("user");
        if (!userStr || userStr === "undefined" || userStr === "null") {
            return null;
        }
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            // Clear invalid data
            localStorage.removeItem("user");
            return null;
        }
    },

    // get auth token
    getToken(): string | null {
        const token = localStorage.getItem("authToken");
        if (!token || token === "undefined" || token === "null") {
            return null;
        }
        return token;
    },

    // clear any corrupted localStorage data
    clearCorruptedData(): void {
        const token = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");

        if (token === "undefined" || token === "null") {
            localStorage.removeItem("authToken");
        }

        if (userStr === "undefined" || userStr === "null") {
            localStorage.removeItem("user");
        }
    },
};

export type { LoginRequest, LoginResponse, RegisterRequest };
