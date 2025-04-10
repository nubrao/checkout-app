/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer, dev }) => {
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

        if (dev) {
            config.watchOptions = {
                ignored: ['**/node_modules', '**/.next']
            };
        }

        return config;
    },

    assetPrefix: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080/checkout',

    output: 'standalone',

    images: {
        domains: ['fakestoreapi.com'],
    },
};

export default nextConfig;
