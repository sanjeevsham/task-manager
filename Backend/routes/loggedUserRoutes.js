import express from 'express';
import LoggedUser from '../models/LoggedUser.js';
const router = express.Router();

// GET current logged in user
router.get('/', async (req, res) => {
  const user = await LoggedUser.findOne();
  res.json(user ? { ...user.toObject(), id: user._id } : null);
});

// POST new logged in user
router.post('/', async (req, res) => {
  await LoggedUser.deleteMany(); // Only one user should be logged in
  const user = new LoggedUser(req.body);
  const saved = await user.save();
  res.status(201).json({ ...saved.toObject(), id: saved._id });
});

// DELETE logged in user
router.delete('/:id', async (req, res) => {
  await LoggedUser.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
