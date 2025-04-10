declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_MAIN_APP_URL: string;
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}

export { };