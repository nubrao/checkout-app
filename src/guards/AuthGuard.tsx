import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';

interface AuthData {
    token: string;
    user: {
        id: number;
        email: string;
        username: string;
    };
    timestamp: number;
}

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        const validateAuth = () => {
            try {
                const authToken = localStorage.getItem('auth-token');
                const authData = localStorage.getItem('auth-data');

                if (!authToken || !authData) {
                    throw new Error('Not authenticated');
                }

                const parsedAuthData = JSON.parse(authData) as AuthData;
                const isExpired = Date.now() - parsedAuthData.timestamp > 24 * 60 * 60 * 1000;

                if (isExpired) {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('auth-data');
                    throw new Error('Session expired');
                }

                setIsAuthenticated(true);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
                message.error(errorMessage);
                window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/login`;
            }
        };

        validateAuth();
    }, [message]);

    if (!isAuthenticated) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};