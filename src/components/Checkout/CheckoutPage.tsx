'use client';

import React, { useState } from 'react';
import { Form, Card, Row, Col, Input, Button, Checkbox, Typography, Radio, Space, App, Divider } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import PaymentMethodContent from '../PaymentMethod/PaymentMethodContent';
import type { FormValues, PaymentMethod, CheckoutData, CartItem } from '@/types/checkout';
import styles from './Checkout.module.css';
import { useRouter } from 'next/navigation';
import type { FormInstance } from 'antd';

const { Title, Text } = Typography;

interface CheckoutPageProps {
    checkoutData: CheckoutData | null;
    loading: boolean;
    onSubmit: (values: FormValues) => Promise<void>;
    form: FormInstance;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
    checkoutData,
    loading,
    onSubmit,
    form
}) => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod['type']>('credit');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
    const { message } = App.useApp();
    const [isNavigating, setIsNavigating] = useState(false);

    const calculateItemTotal = (item: CartItem): number => {
        return item.price * (item.quantity || 1);
    };

    const calculateSubtotal = (): number => {
        if (!checkoutData?.cartItems) return 0;
        return checkoutData.cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
    };

    const handleBackToStore = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL;

        if (!mainAppUrl) {
            console.error('Main app URL not configured');
            message.error('Unable to redirect to store. Please try again later.');
            return;
        }

        try {
            setIsNavigating(true);
            window.location.href = mainAppUrl;
        } catch (error) {
            console.error('Error redirecting to store:', error);
            message.error('Failed to redirect to store. Please try again.');
            setIsNavigating(false);
        }
    };

    return (
        <main className={styles.checkoutContainer} role="main">
            <Link
                href="#"
                className={`${styles.backLink} ${isNavigating ? styles.disabled : ''}`}
                onClick={handleBackToStore}
                aria-label="Return to main site"
                aria-disabled={isNavigating}
            >
                <LeftOutlined /> {isNavigating ? 'Redirecting...' : 'Back to store'}
            </Link>

            <Title level={1}>Checkout</Title>

            <Row gutter={[24, 24]} align="stretch">
                <Col xs={24} lg={16}>
                    <section aria-labelledby="billing-details-title">
                        <Card className={styles.card} title={
                            <Title level={2} id="billing-details-title">Billing Details</Title>
                        }
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onSubmit}
                                requiredMark="optional"
                                aria-label="Billing form"
                            >
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="name"
                                            label="Full Name"
                                            rules={[{ required: true, message: 'Please enter your name' }]}
                                        >
                                            <Input aria-label="Full name input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                { required: true, message: 'Please enter your email' },
                                                { type: 'email', message: 'Please enter a valid email' }
                                            ]}
                                        >
                                            <Input aria-label="Email input" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="phone"
                                            label="Phone"
                                            rules={[{ required: true, message: 'Please enter your phone number' }]}
                                        >
                                            <Input aria-label="Phone input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="address"
                                            label="Address"
                                            rules={[{ required: true, message: 'Please enter your address' }]}
                                        >
                                            <Input aria-label="Address input" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="city"
                                            label="City"
                                            rules={[{ required: true, message: 'Please enter your city' }]}
                                        >
                                            <Input aria-label="City input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="zipcode"
                                            label="ZIP Code"
                                            rules={[{ required: true, message: 'Please enter your ZIP code' }]}
                                        >
                                            <Input aria-label="ZIP code input" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className={styles.paymentMethod}>
                                    <Title level={3}>Payment Method</Title>
                                    <Radio.Group
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className={styles.paymentOptions}
                                    >
                                        <Space direction="vertical" className={styles.paymentList}>
                                            <Radio value="credit">
                                                Credit Card
                                                <div className={styles.paymentDescription}>
                                                    Pay securely using your credit card
                                                </div>
                                            </Radio>
                                            <Radio value="debit">
                                                Debit Card
                                                <div className={styles.paymentDescription}>
                                                    Pay using your debit card
                                                </div>
                                            </Radio>
                                            <Radio value="pix">
                                                PIX
                                                <div className={styles.paymentDescription}>
                                                    Pay instantly using PIX
                                                </div>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>

                                    <div className={styles.paymentContent}>
                                        <PaymentMethodContent method={paymentMethod} />
                                    </div>
                                </div>

                                <div className={styles.termsCheckbox}>
                                    <Checkbox
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    >
                                        I've read and accept the {' '}
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsTermsModalOpen(true);
                                            }}
                                            href="#"
                                        >
                                            terms & conditions
                                        </a>
                                    </Checkbox>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    block
                                    className={styles.orderSubmit}
                                    disabled={!termsAccepted || isProcessing}
                                    loading={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Place order'}
                                </Button>
                            </Form>
                        </Card>
                    </section>
                </Col>

                <Col xs={24} lg={8}>
                    <aside aria-labelledby="order-summary-title">
                        <Card className={styles.card}>
                            <Title level={2} id="order-summary-title">Order Summary</Title>
                            <div className={styles.orderSummary}>
                                <div className={styles.orderCol}>
                                    <Text strong>PRODUCT</Text>
                                    <Text strong>TOTAL</Text>
                                </div>

                                <div className={styles.orderProducts}>
                                    {checkoutData?.cartItems?.map((item) => (
                                        <div key={item.id} className={styles.orderCol}>
                                            <Text>
                                                {item.quantity || 0}x {item.title}
                                            </Text>
                                            <Text className={styles.itemPrice}>
                                                ${calculateItemTotal(item).toFixed(2)}
                                            </Text>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.orderCol}>
                                    <Text>Subtotal</Text>
                                    <Text>${calculateSubtotal().toFixed(2)}</Text>
                                </div>

                                <div className={styles.orderCol}>
                                    <Text>Shipping</Text>
                                    <Text strong>FREE</Text>
                                </div>

                                <div className={styles.orderCol}>
                                    <Text strong>TOTAL</Text>
                                    <Text strong className={styles.orderTotal}>
                                        ${calculateSubtotal().toFixed(2)}
                                    </Text>
                                </div>

                                <Divider />
                            </div>
                        </Card>
                    </aside>
                </Col>
            </Row>
        </main>
    );
};

export default CheckoutPage;