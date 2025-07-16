import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import loggedUserRoutes from './routes/loggedUserRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://sanjeevvanisri2000:Zy0cXCkOee4mnFqv@cluster0.bwavqrh.mongodb.net/Task_Management_DB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/logedinUserInfo', loggedUserRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
