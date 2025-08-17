import { Router } from 'express';
import Todo from '../models/Todo.js';
import Name from '../models/Name.js';

const router = Router();

// ---- Todo endpoints ----
router.get('/todos', async (_req, res) => {
  const items = await Todo.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  const item = await Todo.create({ text });
  res.status(201).json(item);
});

router.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;
  const item = await Todo.findByIdAndUpdate(id, { text, done }, { new: true });
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
});

router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(204).end();
});

// ---- Name endpoints ----
router.get('/names', async (_req, res) => {
  const items = await Name.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/names', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const item = await Name.create({ name });
  res.status(201).json(item);
});

router.delete('/names/:id', async (req, res) => {
  const { id } = req.params;
  await Name.findByIdAndDelete(id);
  res.status(204).end();
});

export default router;
