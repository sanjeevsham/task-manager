import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
    darkTheme: Boolean,
});
  
export default mongoose.model('Theme', themeSchema);