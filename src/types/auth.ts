import { CartItem } from "./checkout";

export interface AuthUser {
    id: number;
    email: string;
    username: string;
    name?: {
        firstname: string;
        lastname: string;
    };
}

export interface AuthData {
    token: string;
    user: AuthUser;
    timestamp: number;
}

export interface CheckoutData {
    cartItems: CartItem[];
    total: number;
    timestamp: number;
    authToken: string;
    authData: string;
}