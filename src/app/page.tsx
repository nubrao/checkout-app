'use client';

import React, { useEffect, useState } from 'react';
import { App, Form } from 'antd';
import { AuthGuard } from '@/guards/AuthGuard';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import CheckoutPage from '@/components/Checkout/CheckoutPage';
import type { FormValues, CheckoutData } from '@/types/checkout';

const HomePage: React.FC = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/shared/data`, {
                    credentials: 'include'
                });

                const sharedData = await response.json();

                if (!sharedData?.cart) {
                    throw new Error('No checkout data found');
                }

                setCheckoutData(sharedData.cart);

                const userInfo = localStorage.getItem('user-info');
                if (userInfo) {
                    const userData = JSON.parse(userInfo);
                    form.setFieldsValue({
                        name: `${userData.name.firstname} ${userData.name.lastname}`,
                        email: userData.email,
                        phone: userData.phone,
                        address: `${userData.address.number} ${userData.address.street}`,
                        city: userData.address.city,
                        zipcode: userData.address.zipcode
                    });
                }
            } catch (error) {
                console.error('Error fetching checkout data:', error);
                message.error('Failed to load checkout data');
                window.location.href = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:8080';
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [form, message]);

    const handleSubmit = async (values: FormValues) => {
        if (!termsAccepted) {
            message.error('Please accept the terms and conditions');
            return;
        }

        try {
            setIsProcessing(true);
            const loadingMessage = message.loading('Processing your order...', 0);

            await new Promise(resolve => setTimeout(resolve, 2000));
            localStorage.removeItem('checkout-data');

            loadingMessage();
            message.success('Order placed successfully! Thank you for your purchase.');

            setTimeout(() => {
                window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/account`;
            }, 1000);
        } catch (error) {
            console.error('Error processing order:', error);
            message.error('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <AuthGuard>
            <CheckoutPage
                checkoutData={checkoutData}
                loading={loading}
                onSubmit={handleSubmit}
                form={form}
            />
        </AuthGuard>
    );
};

export default HomePage;