import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import ViteExpress from "vite-express";

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/osv', async (req, res) => {
  try {
    const response = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching vulnerability data' });
  }
});

const server = app.listen(3001, () => console.log('Proxy running on http://localhost:3001'));

ViteExpress.bind(app, server);
