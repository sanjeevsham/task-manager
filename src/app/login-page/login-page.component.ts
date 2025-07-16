import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup,FormBuilder,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router  } from '@angular/router';
import { User } from '../task-manager.model';
import { TaskService } from '../task-manager.service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  formGroup: FormGroup;
  private apiUrlUsers = 'http://localhost:3000/api/users'
  constructor(private fb: FormBuilder,private http: HttpClient,private router: Router,private taskService: TaskService) {
      this.formGroup = this.fb.group({
        username: [''],
        password: ['']
      });
  }
  
  login(){
    const username = this.formGroup.value.username.trim()
    const password = this.formGroup.value.password.trim()
    if(!password || !username){
      alert("username or password cannot be empty")
      return;
    }
    const credentials: User = {
      username,
      password,
      email: '',
      desigination: '',
      managed: ''
    }
    this.userCheck(credentials)
  }
  userCheck(credentials :User){
    console.log(credentials)
    this.http.get<User[]>(this.apiUrlUsers).subscribe(users => {
      const matchedUser = users.find(user =>
        user.username === credentials.username &&
        user.password === credentials.password &&
        user.type === 'Admin'
      );
      if (matchedUser) {
        this.router.navigate(['/adminDashboard']);
        this.taskService.addLogedUser(matchedUser).subscribe();
      } else {
        alert("UserInfo not matched");
      }
    });
  }
}
