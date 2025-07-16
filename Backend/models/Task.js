import mongoose from "mongoose"

const taskScheme = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    status: String,
    assignedTo: String,
    createdBy: String,
    createdOn:String,
    dueDate: String,
    priority: String,
    completed:Boolean,
    editing:Boolean,
})
export default mongoose.model('Task', taskScheme)