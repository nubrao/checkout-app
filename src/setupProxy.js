const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/checkout',
        createProxyMiddleware({
            target: 'http://localhost:3000',
            changeOrigin: true,
            pathRewrite: {
                '^/checkout': '',
            },
            ws: true,
            onError: (err, req, res) => {
                console.log('Proxy Error:', err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain',
                });
                res.end('Something went wrong with the proxy.');
            },
        })
    );
};