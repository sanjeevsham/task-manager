import mongoose from 'mongoose';

const loggedUserSchema  = new mongoose.Schema({
    id:String,
    username:String,
    password:String,
    type:String,
    avatarUrl: String,
    email:String,
    desigination:String,
    managed:String,
    avatarUrl:String
});
const LoggedUser = mongoose.models.LoggedUser || mongoose.model('LoggedUser', loggedUserSchema);

export default LoggedUser;
