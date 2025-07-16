import express from 'express';
import Theme from '../models/Theme.js';
const router = express.Router();

// GET current theme
router.get('/', async (req, res) => {
  const theme = await Theme.findOne();
  if (!theme) {
    const newTheme = new Theme({ darkTheme: false });
    await newTheme.save();
    return res.json({ darkTheme: false });
  }
  res.json({ darkTheme: theme.darkTheme });
});

// PUT update theme
router.put('/', async (req, res) => {
  let theme = await Theme.findOne();
  if (!theme) {
    theme = new Theme(req.body);
  } else {
    theme.darkTheme = req.body.darkTheme;
  }
  await theme.save();
  res.json({ darkTheme: theme.darkTheme });
});

export default router;
