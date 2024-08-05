const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api', // Ovo treba zamijeniti sa stazom koja odgovara vašim API pozivima
        createProxyMiddleware({
            target: 'http://localhost:8080', // Ovdje postavite ciljnu adresu vašeg backend servera
            changeOrigin: true,
        })
    );
};
