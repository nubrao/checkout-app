'use client';

import { useEffect, useState } from 'react';
import { App } from 'antd';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { message } = App.useApp();
    const router = useRouter();

    useEffect(() => {
        const validateAuth = () => {
            try {
                setTimeout(() => {
                    const authToken = localStorage.getItem('auth-token');
                    const userInfo = localStorage.getItem('user-info');
                    console.log('Auth Check:', { hasToken: !!authToken, hasData: !!userInfo });

                    if (!authToken || !userInfo) {
                        window.location.href = `${process.env.NEXT_PUBLIC_PROXY_URL}/login`;
                        throw new Error('Authentication required');
                    }

                    setIsAuthenticated(true);
                    setIsValidating(false);
                }, 2000);
            } catch (error) {
                console.error('Auth Error:', error);
                message.error('Please login to continue');
                window.location.replace(process.env.NEXT_PUBLIC_MAIN_APP_URL);
            }
        };

        validateAuth();
    }, [message]);

    if (isValidating) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};