require('dotenv').config()
// Import the express module
const express = require('express');
const { readdirSync } = require('fs');

// Create an Express application
const app = express();

app.use(express.static(`${process.cwd()}/web`))

const pages = readdirSync('web/pages')
for (const page of pages) {
    const pageName = page.split('.')[0]
    app.get(`/${pageName}`, (req, res) => res.sendFile(`${process.cwd()}/web/pages/${page}`))
}

const apis = readdirSync('api')
for (const api of apis) {
    const apiRoute = api.split('.')[0]
    app.get(`/api/${apiRoute}`, require(`${process.cwd()}/api/${apiRoute}`))
}

    const redirects = require('./json/redirects.json')
for (const { name, url } of redirects) {
    app.get(name, (req, res) => res.redirect(url))
}

// Start the server and listen on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
