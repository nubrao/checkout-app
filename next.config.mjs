/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
        };

        if (!isServer) {
            config.infrastructureLogging = {
                level: 'error'
            };
        }

        return config;
    },

    assetPrefix: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080/checkout',

    images: {
        domains: ['fakestoreapi.com'],
    }
};

export default nextConfig;
