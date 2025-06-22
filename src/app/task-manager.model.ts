export interface User {
    id?:number
    username:string,
    password:string,
    type?:string,
    avatarUrl?: string;
    email:string,
    desigination:string,
    managed:string,
    editing?:boolean;
}
export interface Task {
    id?: number;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Completed';
    assignedTo: string;
    createdBy: string;
    createdOn?:string;
    dueDate?: string;
    priority?: 'Low' | 'Medium' | 'High';
    completed:boolean;
    editing?:boolean;
}