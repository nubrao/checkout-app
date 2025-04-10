'use client';

import React, { useEffect } from 'react';
import { App } from 'antd';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';

const HomePage = () => {
    const router = useRouter();
    const { message } = App.useApp();

    useEffect(() => {
        const validateAndRedirect = async () => {
            try {
                const checkoutData = localStorage.getItem('checkout-data');

                if (!checkoutData) {
                    throw new Error('No checkout data found');
                }

                const parsedData = JSON.parse(checkoutData);

                // Validate cart items
                if (!parsedData.cartItems || !Array.isArray(parsedData.cartItems) || parsedData.cartItems.length === 0) {
                    throw new Error('Cart is empty');
                }

                const isExpired = Date.now() - parsedData.timestamp > 30 * 60 * 1000;

                if (isExpired) {
                    localStorage.removeItem('checkout-data');
                    throw new Error('Checkout session expired');
                }

                // Use router.push instead of replace to allow navigation
                router.push('/checkout');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Invalid checkout data';
                console.error('Checkout error:', errorMessage);

                // Delay the redirect slightly to ensure the error message is shown
                setTimeout(() => {
                    window.location.href = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000';
                }, 1500);
            }
        };

        validateAndRedirect();
    }, [router, message]);

    return <LoadingScreen />;
};

export default HomePage;