import { Component, OnInit,Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet,RouterLink,RouterLinkActive } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { TaskService } from './task-manager.service';
import { isPlatformBrowser } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';
import { MenuComponent } from './menu/menu.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,LoginPageComponent,AvatarComponent,MenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  darkTheme: boolean = false;
  constructor(private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object) {
  }
  ngOnInit(): void {
    this.taskService.darkTheme$.subscribe(value => {
      this.darkTheme = value;
      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.toggle('dark-theme', this.darkTheme);
      }
    });
  }
  // toggleTheme(): void {
  //   this.taskService.toggleTheme(this.darkTheme);
  //   if (isPlatformBrowser(this.platformId)) {
  //     document.body.classList.toggle('dark-theme', !this.darkTheme);
  //   }
  // }
}
