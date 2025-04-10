'use client';

import React, { useEffect, useState } from 'react';
import { App } from 'antd';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';

const HomePage = () => {
    const router = useRouter();
    const { message } = App.useApp();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const validateAndRedirect = async () => {
            if (isRedirecting) return;

            try {
                setIsRedirecting(true);

                const response = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/shared/data`, {
                    credentials: 'include'
                });

                const sharedData = await response.json();

                if (!sharedData?.cart) {
                    throw new Error('No checkout data found');
                }

                localStorage.setItem('checkout-data', JSON.stringify(sharedData.cart));

                router.push('/checkout/checkout');
            } catch (error) {
                console.error('Validation Error:', error);
                const errorMessage = error instanceof Error ? error.message : 'Invalid checkout data';
                message.error(errorMessage);
                window.location.href = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:8080';
            }
        };

        validateAndRedirect();
    }, [message, isRedirecting]);

    return <LoadingScreen />;
};

export default HomePage;