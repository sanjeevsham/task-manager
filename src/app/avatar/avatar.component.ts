import { Component, ViewEncapsulation,Inject, PLATFORM_ID } from '@angular/core';
import { User } from '../task-manager.model';
import { TaskService } from '../task-manager.service';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports:[CommonModule,OverlayModule,FormsModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AvatarComponent  {
  user: User  | null =  null
  public userPopup :boolean = false
  darkTheme: boolean = false;
  isUserActive :boolean = false;
  constructor(private taskService:TaskService, @Inject(PLATFORM_ID) private platformId: Object,private router: Router) {}

  ngOnInit(): void {
    this.taskService.logeduser$.subscribe(user => {
      let userdata = Array.isArray(user) ? user[0] : user;
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
        const navEnd = event as NavigationEnd; 
        const currentUrl = navEnd.urlAfterRedirects;
        if (currentUrl.includes('adminDashboard') || currentUrl.includes('taskList') || currentUrl.includes('userPage')) {
          this.isUserActive = true;
        }else{
          this.isUserActive = false;
          this.userPopup = false;
        }
      })
      if(userdata?.username){
        this.user = userdata;
      }
      if(userdata === null){
        this.user = userdata;
      }
    });
    this.taskService.darkTheme$.subscribe(value => {
      this.darkTheme = value;
      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.toggle('dark-theme', this.darkTheme);
      }
    });
  }
  getInitials(name: string): string {
    if(!name) return '?'
    return name?.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  getBackgroundColor(name: string): string {
    if (!name) return '#ccc'; 
    const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#2ecc71'];
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name?.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors?.length);
    return colors[index];
  }  
  signOut(user:any){
    this.taskService.deleteLogedUser(user.id)
  }
  toggleTheme(): void {
    this.taskService.toggleTheme(this.darkTheme);
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-theme', !this.darkTheme);
    }
  }
}
