'use client';

import React from 'react';
import { Form, Input, Typography } from 'antd';
import type { PaymentMethod } from '@/types/checkout';
import styles from './PaymentMethod.module.css';

const { Text } = Typography;

interface PaymentMethodContentProps {
    method: PaymentMethod['type'];
}

const PaymentMethodContent: React.FC<PaymentMethodContentProps> = ({ method }) => {
    if (method === 'pix') {
        return (
            <div className={styles.pixInfo}>
                <div className={styles.qrCodePlaceholder}>
                    QR Code will be generated after order confirmation
                </div>
                <Text type="secondary">
                    After confirming your order, a PIX QR Code will be generated for payment
                </Text>
            </div>
        );
    }

    return (
        <div className={styles.cardFields}>
            <Form.Item
                name="cardNumber"
                label="Card Number"
                rules={[{ required: true, message: 'Please enter card number' }]}
            >
                <Input placeholder="1234 5678 9012 3456" maxLength={19} />
            </Form.Item>

            <Form.Item
                name="cardName"
                label="Name on Card"
                rules={[{ required: true, message: 'Please enter name on card' }]}
            >
                <Input placeholder="JOHN DOE" />
            </Form.Item>

            <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[{ required: true, message: 'Please enter expiry date' }]}
            >
                <Input placeholder="MM/YY" maxLength={5} />
            </Form.Item>

            <Form.Item
                name="cvv"
                label="CVV"
                rules={[{ required: true, message: 'Please enter CVV' }]}
            >
                <Input placeholder="123" maxLength={4} />
            </Form.Item>
        </div>
    );
};

export default PaymentMethodContent;