import { type TextBlockType } from "@myTypes/globalTypes";
import { api } from "./axios";
import useSocketStore from "@stores/socketStore";
import useAuthStore from "@stores/authStore";

async function runCode(block: TextBlockType): Promise<void> {
    console.log(
        "Running code with input:",
        (useSocketStore.getState() as { socketId: string }).socketId
    );
    try {
        if (!(useSocketStore.getState() as { socketId: string }).socketId) {
            throw new Error("WebSocket not connected");
        }
        await api.post("/api/run", block);
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error running code");
    }
}

// ─── Auth APIs ───────────────────────────────────────────────────

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id?: string;
        name: string;
        email: string;
    };
}
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

async function registerUser(data: RegisterPayload): Promise<AuthResponse> {
    try {
        const response = await api.post("/api/register", data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Registration failed"
        );
    }
}

async function loginUser(data: LoginPayload): Promise<LoginResponse> {
    try {
        const response = await api.post("/api/login", data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Login failed"
        );
    }
}
async function refreshToken() {
    try {
        const resopnse = await api.post("/api/refresh", {
                refreshToken: localStorage.getItem("refreshToken")
        })
        const authStore = useAuthStore.getState()
        const { accessToken, refreshToken } = resopnse.data
        authStore.setAccessToken(accessToken)
        authStore.setRefreshToken(refreshToken)
    } catch (error) {
        throw new Error("Failed to refresh token");
    }
}
export { runCode, registerUser, loginUser, refreshToken };
export type { RegisterPayload, LoginPayload, AuthResponse };