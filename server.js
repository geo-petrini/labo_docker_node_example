const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static('public'));

async function init() {
  await db.connect();
  await db.seedIfEmpty();

  app.get('/api/items', async (req, res) => res.json(await db.getAll()));

  app.post('/api/items', async (req, res) => {
    const item = await db.create(req.body.title || '', req.body.note || '');
    res.status(201).json(item);
  });

  app.get('/api/items/:id', async (req, res) => {
    const item = await db.get(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'non trovato' });
  });

  app.put('/api/items/:id', async (req, res) => {
    const item = await db.update(req.params.id, req.body.title || '', req.body.note || '');
    item ? res.json(item) : res.status(404).json({ error: 'non trovato' });
  });

  app.delete('/api/items/:id', async (req, res) => {
    await db.remove(req.params.id);
    res.json({ ok: true });
  });

  app.listen(3000, () => console.log('app in ascolto sulla porta 3000'));
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});