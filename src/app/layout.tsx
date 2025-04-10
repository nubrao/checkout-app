'use client';

import { Geist } from "next/font/google";
import { App } from 'antd';
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={geist.className}>
                <App>
                    {children}
                </App>
            </body>
        </html>
    );
}