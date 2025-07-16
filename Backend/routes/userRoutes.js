import express from 'express';
import User from '../models/User.js';
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users.map(u => ({ ...u.toObject(), id: u._id })));
});

// POST a new user
router.post('/', async (req, res) => {
  const user = new User(req.body);
  const saved = await user.save();
  res.status(201).json({ ...saved.toObject(), id: saved._id });
});

// PUT update user
router.put('/:id', async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ ...updated.toObject(), id: updated._id });
});

// DELETE user
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
