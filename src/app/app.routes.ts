import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TaskListComponent } from './task-list/task-list.component';
import { UserComponent } from './user/user.component';
export const routes: Routes = [
    { path:'', component:LoginPageComponent},
    { path:'adminDashboard',component:AdminDashboardComponent},
    { path:'taskList',component:TaskListComponent},
    { path:'userPage',component:UserComponent}
];
