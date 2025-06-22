import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { TaskService } from '../task-manager.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  dashboardActive :boolean = false;
  userActive :boolean = false;
  taskActive :boolean = false;

  constructor(private router: Router,private taskService: TaskService) {
  }
  ngOnInit(): void {
    this.taskService.user$.subscribe(user => {
      let userdata = Array.isArray(user) ? user[0] : user;
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      const navEnd = event as NavigationEnd; 
      const currentUrl = navEnd.urlAfterRedirects;
      if (currentUrl.includes('adminDashboard')) {
        this.dashboardActive = true;
        this.taskActive = false;
        this.userActive = false;
      } else if (currentUrl.includes('taskList')) {
        this.dashboardActive = false;
        this.taskActive = true;
        this.userActive = false;
      } else if (currentUrl.includes('userPage')) {
        this.dashboardActive = false;
        this.taskActive = false;
        this.userActive = true;
      } else {
        this.dashboardActive = false;
        this.taskActive = false;
        this.userActive = false;
      }
    });
      if(userdata === null){
        this.dashboardActive = false;
      }
    })
  }
  menuClick(layoutType:string){
    if(layoutType === "dashboard"){
      this.router.navigate(['adminDashboard']);
      this.dashboardActive = true;
      this.userActive = false;
      this.taskActive = false;
    }
    if(layoutType === "user"){
      this.router.navigate(['userPage']);
      this.userActive = true;
      this.dashboardActive = false;
      this.taskActive = false;
    }
    if(layoutType === "task"){
      this.router.navigate(['taskList']);
      this.taskActive = true;
      this.userActive = false;
      this.dashboardActive = false;
    }
  }
}
