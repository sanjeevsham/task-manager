import express from 'express';
import Task from '../models/Task.js'
const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  const formattedTasks = tasks.map(task => ({
    ...task.toObject(),
    id: task._id,
  }));
  res.json(formattedTasks);
});

// POST new task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  const saved = await task.save();
  res.status(201).json({ ...saved.toObject(), id: saved._id });
});

// PUT update task
router.put('/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ ...updated.toObject(), id: updated._id });
});

// DELETE task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
