'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
    id: number;
    email: string;
    username: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    validateAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const validateAuth = () => {
        try {
            const token = localStorage.getItem('auth-token');
            const userInfo = localStorage.getItem('user-info');

            if (!token || !userInfo) {
                return false;
            }

            const parsedData = JSON.parse(userInfo);
            const isExpired = Date.now() - parsedData.timestamp > 24 * 60 * 60 * 1000;

            if (isExpired) {
                localStorage.removeItem('auth-token');
                localStorage.removeItem('user-info');
                return false;
            }

            setUser(parsedData.user);
            return true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        validateAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            validateAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;