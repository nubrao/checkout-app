'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Radio, Space, Checkbox, Divider, Row, Col, App } from 'antd';
import { useRouter } from 'next/navigation';
import type { CheckoutData, PaymentMethod } from '../../types/checkout';
import styles from '../checkout/Checkout.module.css';
import TermsModal from '../../components/TermsModal/TermsModal';
import { CartItem } from '../../types/checkout';
import { AuthGuard } from '@/guards/AuthGuard';

const { Title, Text } = Typography;

interface FormValues {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipcode: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardName?: string;
}

const PaymentMethodContent: React.FC<{ method: PaymentMethod['type'] }> = ({ method }) => {
    switch (method) {
        case 'credit':
        case 'debit':
            return (
                <div className={styles.cardFields}>
                    <Form.Item
                        name="cardNumber"
                        rules={[{ required: true, message: 'Card number is required' }]}
                    >
                        <Input
                            placeholder="Card Number"
                            maxLength={16}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="expiryDate"
                                rules={[{ required: true, message: 'Expiry date is required' }]}
                            >
                                <Input
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="cvv"
                                rules={[{ required: true, message: 'CVV is required' }]}
                            >
                                <Input
                                    placeholder="CVV"
                                    maxLength={4}
                                    type="password"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="cardName"
                        rules={[{ required: true, message: 'Name on card is required' }]}
                    >
                        <Input placeholder="Name on Card" />
                    </Form.Item>
                </div>
            );
        case 'pix':
            return (
                <div className={styles.pixInfo}>
                    <div className={styles.pixQRCode}>
                        <div className={styles.qrCodePlaceholder}>
                            QR Code will be generated after confirmation
                        </div>
                    </div>
                    <Text type="secondary">
                        Scan the QR code or copy the PIX key to complete your payment
                    </Text>
                </div>
            );
        default:
            return null;
    }
};

const CheckoutPage: React.FC = () => {
    const router = useRouter();
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod['type']>('credit');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

    useEffect(() => {
        const savedCheckoutData = localStorage.getItem('checkout-data');

        if (!savedCheckoutData) {
            message.error('No checkout data found');
            window.location.href = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000';
            return;
        }

        try {
            const parsedData = JSON.parse(savedCheckoutData) as CheckoutData;

            // Validate cart items
            if (!parsedData.cartItems?.length) {
                throw new Error('Cart is empty');
            }

            if (Date.now() - parsedData.timestamp > 30 * 60 * 1000) {
                localStorage.removeItem('checkout-data');
                throw new Error('Checkout session expired');
            }

            setCheckoutData(parsedData);
        } catch (error) {
            console.error('Invalid checkout data:', error);
            localStorage.removeItem('checkout-data');
            message.error('Invalid checkout data');
            window.location.href = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000';
        }
    }, [message]);

    const calculateItemTotal = (item: CartItem): number => {
        return (parseFloat(String(item.price)) || 0) * (parseInt(String(item.quantity)) || 0);
    };

    const calculateSubtotal = (): number => {
        if (!checkoutData?.cartItems?.length) return 0;
        return checkoutData.cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    const handleSubmit = async (values: FormValues) => {
        if (!termsAccepted) {
            message.error('Please accept the terms and conditions');
            return;
        }

        try {
            setIsProcessing(true);
            const loadingMessage = message.loading('Processing your order...', 0);

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear checkout data
            localStorage.removeItem('checkout-data');

            loadingMessage();
            message.success('Order placed successfully! Thank you for your purchase.');

            // Redirect back to main app
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

    return (
        <AuthGuard>
            <main className={styles.checkoutPage}>
                <Title level={1}>Checkout</Title>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <section aria-label="Billing Information">
                            <Card title={<Title level={2} className={styles.cardTitle}>Billing Details</Title>}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
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
                                </Form>
                            </Card>
                        </section>
                    </Col>

                    <Col xs={24} lg={8}>
                        <aside aria-label="Order Summary">
                            <Card title={<Title level={2} className={styles.cardTitle}>Order Summary</Title>}>
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
                                        block
                                        onClick={() => form.submit()}
                                        className={styles.orderSubmit}
                                        disabled={!termsAccepted || isProcessing}
                                        loading={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : 'Place order'}
                                    </Button>
                                </div>
                            </Card>
                        </aside>
                    </Col>
                </Row>

                <TermsModal
                    open={isTermsModalOpen}
                    onClose={() => setIsTermsModalOpen(false)}
                />
            </main>
        </AuthGuard>
    );
};

export default CheckoutPage;