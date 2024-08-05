const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require("dotenv").config();

// Kreirajte glavnu aplikaciju express
const app = express();

// Serve static files from the React app
var cors = require('cors')
app.use(cors())

const { PORT } = process.env;
const { HOST } = process.env;
const { API_BASE_URL } = process.env;

app.use(
    "/api",
    createProxyMiddleware({
        target: API_BASE_URL,
        changeOrigin: true,
    })
);
app.use(express.static(path.join(__dirname, 'build')))

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});

app.get("*", async (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    }
);