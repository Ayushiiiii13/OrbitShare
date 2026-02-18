import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Set up axios interceptor for tokens
    useEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        return () => api.interceptors.request.eject(interceptor);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const { token, user: userData } = res.data;

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);

            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed. Please check your credentials."
            };
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/api/auth/register', userData);
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message);
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed."
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (profileData) => {
        try {
            console.log("Attempting profile update with:", profileData);
            const res = await api.put('/api/auth/profile', profileData);
            console.log("Profile update response:", res.data);
            const { user: updatedUser } = res.data;

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return { success: true };
        } catch (error) {
            console.error("Profile update failed!");
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update profile."
            };
        }
    };

    const refreshUser = async () => {
        try {
            const res = await api.get('/api/auth/profile');
            const { user: updatedUser } = res.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Failed to refresh user data:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, refreshUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
