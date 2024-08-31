require('dotenv').config()
const express = require('express');
const { readdirSync } = require('fs');
const { join } = require('path');
const app = express();
const fetch = require('node-fetch');

app.use(express.json());
app.use(express.static(join(process.cwd(), 'web')))

// MongoDB Data API configuration
const url = 'https://data.mongodb-api.com/app/data-tincyab/endpoint/data/v1/action';
const apiKey = process.env.MONGODB_API_KEY;
const database = 'M4sk';
const collection = 'Economy';

if (!apiKey) {
    throw new Error('MONGODB_API_KEY is not set');
}

// Helper function to send a request to the MongoDB Data API
async function _request(method, bodyParams) {
    const response = await fetch(`${url}/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
        },
        body: JSON.stringify(bodyParams),
    });
    return await response.json();
}

// Set a key-value pair
app.post('/api/economy/set', async (req, res) => {
    if (req.headers.password !== process.env.MONGO_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const { key, value } = req.body;
        const existingDoc = await _request('findOne', {
            dataSource: 'Cluster0',
            database,
            collection,
            filter: { key },
        });

        let result;
        if (existingDoc.document) {
            result = await _request('updateOne', {
                dataSource: 'Cluster0',
                database,
                collection,
                filter: { key },
                update: { $set: { value } },
            });
        } else {
            result = await _request('insertOne', {
                dataSource: 'Cluster0',
                database,
                collection,
                document: { key, value },
            });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a value by key
app.get('/api/economy/get', async (req, res) => {
    if (req.headers.password !== process.env.MONGO_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const result = await _request('findOne', {
            dataSource: 'Cluster0',
            database,
            collection,
            filter: { key: req.query.key || false },
        });
        res.json(result.document ? result.document.value : null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all values
app.get('/api/economy/getAll', async (req, res) => {
    if (req.headers.password !== process.env.MONGO_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const result = await _request('find', {
            dataSource: 'Cluster0',
            database,
            collection,
            filter: {},
        });
        res.json(result.documents ? result.documents.map(doc => doc.value) : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a document by key
app.delete('/api/economy/delete', async (req, res) => {
    if (req.headers.password !== process.env.MONGO_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const result = await _request('deleteOne', {
            dataSource: 'Cluster0',
            database,
            collection,
            filter: { key: req.query.key || false },
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete all documents
app.delete('/api/economy/deleteAll', async (req, res) => {
    if (req.headers.password !== process.env.MONGO_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const result = await _request('deleteMany', {
            dataSource: 'Cluster0',
            database,
            collection,
            filter: {},
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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