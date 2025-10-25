import axios from "axios";
import { BASE_URL } from "../config";

/**
 * Authentication Service (Functional)
 * 
 * Provides helper functions for verifying JWT, fetching user data,
 * refreshing sessions, and making authenticated API requests.
 */

export interface UserInfo {
    id: string;
    walletAddress: string;
    connectionMethod: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
}

export interface VerifyJWTResponse {
    success: boolean;
    user: UserInfo;
    message: string;
}

/**
 * Verify Web3Auth JWT with backend
 */
export async function verifyJWT(idToken: string): Promise<VerifyJWTResponse> {
    try {
        const { data } = await axios.post(`${BASE_URL}/auth/verify-jwt`, { idToken });
        return data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

/**
 * Get current user information
 */
export async function getCurrentUser(idToken: string): Promise<UserInfo> {
    try {
        const { data } = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${idToken}` },
        });
        return data.user;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

/**
 * Refresh user session
 */
export async function refreshSession(idToken: string): Promise<{ success: boolean; message: string }> {
    try {
        const { data } = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${idToken}` } }
        );
        return data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

/**
 * Make authenticated API call with JWT token
 */
export async function authenticatedRequest<T>(
    endpoint: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        data?: any;
        headers?: Record<string, string>;
    } = {},
    idToken: string
): Promise<T> {
    try {
        const { data } = await axios({
            url: `${BASE_URL}${endpoint}`,
            method: options.method || "GET",
            data: options.data || {},
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
        return data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

/**
 * Centralized Axios error handler
 */
function handleAxiosError(error: any): never {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || "Request failed";
        console.error("❌ Axios Error:", message);
        throw new Error(message);
    }
    throw error;
}
