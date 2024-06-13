require('dotenv').config()
// Import the express module
const express = require('express');
const { readdirSync } = require('fs');
const { join } = require('path');
// Create an Express application
const app = express();

app.use(express.static(join(process.cwd(), 'web')))

const pages = readdirSync(join(process.cwd(), 'web', 'pages'))
for (const page of pages) {
    const pageName = page.split('.')[0]
    app.get(`/${pageName}`, (req, res) => res.sendFile(join(process.cwd(), 'web', 'pages', `${page}`)))
}

const apis = readdirSync('api')
for (const api of apis) {
    const apiRoute = api.split('.')[0]
    app.get(`/api/${apiRoute}`, require(join(process.cwd(), 'api', `${apiRoute}`)))
}

const redirects = require(join(process.cwd(), 'json', 'redirects.json'));
for (const { name, url } of redirects) {
    app.get(name, (req, res) => res.redirect(url))
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});