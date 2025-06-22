import { Component,OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { TaskService } from '../task-manager.service';
import { Task, User } from '../task-manager.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
  public totalTasks: Task[] = [];
  taskAccepted:any = []
  public totalUser :any =  []
  constructor(private router: Router,private taskService: TaskService) {
  }
  ngOnInit(): void {
    this.taskService.tasks$.subscribe((task) => {
      this.totalTasks = task; 
      this.taskAccepted = this.totalTasks.filter(task => task.status === 'In Progress')
      
    })
    this.taskService.user$.subscribe((user)=>{
      this.totalUser = user;
    })
  }
}
