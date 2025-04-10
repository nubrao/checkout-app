export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    description?: string;
    category?: string;
}

export interface CheckoutData {
    cartItems: CartItem[];
    total: number;
    timestamp: number;
}

export type PaymentMethod = {
    type: 'credit' | 'debit' | 'pix';
    details?: {
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
        cardName?: string;
    };
};

export interface FormValues {
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