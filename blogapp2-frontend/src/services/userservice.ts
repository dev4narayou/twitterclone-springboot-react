import { apiRequest } from "./api";
import type { User } from "../types/index";

export const UserService = {
    async getUserProfile(userId: number): Promise<User> {
        return await apiRequest<User>(`/users/${userId}`);
    }
}
