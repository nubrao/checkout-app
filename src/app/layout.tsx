'use client';

import React, { Suspense } from 'react';
import { Geist } from "next/font/google";
import { App, ConfigProvider } from 'antd';
import { ThemeProvider } from 'next-themes';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 8,
                    }
                }}
            >
                <App>
                    <Suspense fallback={<LoadingScreen />}>
                        {children}
                    </Suspense>
                </App>
            </ConfigProvider>
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
                <ThemeProvider attribute="data-theme" defaultTheme="system">
                    <RootLayoutContent>
                        {children}
                    </RootLayoutContent>
                </ThemeProvider>
            </body>
        </html>
    );
}