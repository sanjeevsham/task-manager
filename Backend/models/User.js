import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id:String,
    username:String,
    password:String,
    type:String,
    avatarUrl: String,
    email:String,
    desigination:String,
    managed:String,
    editing:Boolean,
});

export default mongoose.model('User', userSchema);
