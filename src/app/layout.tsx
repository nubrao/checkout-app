'use client';

import { Geist } from "next/font/google";
import { App, ConfigProvider } from 'antd';
import { ThemeProvider } from 'next-themes';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import styles from '@/app/checkout/Checkout.module.css';
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <App>{children}</App>
        </StyledComponentsRegistry>
    );
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={geist.className}>
                <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
                    <RootLayoutContent>
                        {children}
                    </RootLayoutContent>
                </ThemeProvider>
            </body>
        </html>
    );
}