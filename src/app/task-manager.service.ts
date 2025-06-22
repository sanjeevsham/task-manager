import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task,User } from './task-manager.model';
import { Router  } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrlTask = 'http://localhost:3000/tasks';
  private apiUrlTheame = 'http://localhost:3000/theame';
  private apilogedUser = 'http://localhost:3000/logedinUserInfo'
  private apiUrlUsers = 'http://localhost:3000/users'
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private logedUserSubject = new BehaviorSubject<User | null>(null);
  private darkThemeSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User[]>([])
  darkTheme$ = this.darkThemeSubject.asObservable();
  tasks$ = this.tasksSubject.asObservable();
  logeduser$ = this.logedUserSubject.asObservable();
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient,private router: Router) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrlTask).subscribe(responce => {
      this.tasksSubject.next(responce);
    });
    this.http.get<User[]>(this.apiUrlUsers).subscribe(responce => {
      this.userSubject.next(responce);
    });
    this.http.get<{ darkTheme: boolean }>(this.apiUrlTheame).subscribe(data => {
      this.darkThemeSubject.next(data.darkTheme);
    });
    this.http.get<User>(this.apilogedUser).subscribe(user =>{
      this.logedUserSubject.next(user)
    })
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrlTask, task).pipe(
      tap(newTask => {
        this.tasksSubject.next([...this.tasksSubject.value, newTask]);
      })
    );
  }
  addUser(user: User):Observable<User>{
    return this.http.post<User>(this.apiUrlUsers,user).pipe(
      tap(newUser =>{
        this.userSubject.next([...this.userSubject.value,newUser])
      })
    )
  }
  deleteTask(taskId: number): void {
    this.http.delete(`${this.apiUrlTask}/${taskId}`).subscribe(() => {
      const updated = this.tasksSubject.value.filter(t => t.id !== taskId);
      this.tasksSubject.next(updated);
    });
  }
  deleteUser(userId: number): void {
    this.http.delete(`${this.apiUrlUsers}/${userId}`).subscribe(() => {
      const updated = this.userSubject.value.filter(t => t.id !== userId);
      this.userSubject.next(updated);
    });
  }
  // toggleTask(task: Task): void {
  //   const updated = { ...task, completed: !task.completed };
  //   this.updateTask(updated);
  // }

  updateTask(task: Task): void {
    if (!task.id) return;
    this.http.put<Task>(`${this.apiUrlTask}/${task.id}`, task).subscribe(updatedTask => {
      const newList = this.tasksSubject.value.map(t => t.id === updatedTask.id ? updatedTask : t);
      this.tasksSubject.next(newList);
    });
  }
  updateUser(user: User): void {
    if (!user.id) return;
    this.http.put<User>(`${this.apiUrlUsers}/${user.id}`, user).subscribe(updatedUser => {
      const newList = this.userSubject.value.map(t => t.id === updatedUser.id ? updatedUser : t);
      this.userSubject.next(newList);
    });
  }
  toggleTheme(current: boolean): void {
    const updated = { darkTheme: !current };
    this.http.put<{ darkTheme: boolean }>(this.apiUrlTheame, updated).pipe(
      tap(data => this.darkThemeSubject.next(data.darkTheme))
    ).subscribe();
  }
  addLogedUser(user :User): Observable<User>{
    return this.http.post<User>(this.apilogedUser, user).pipe(
      tap(newUser => {
        this.logedUserSubject.next(newUser);
      })
    );
  }
  deleteLogedUser(userid:number){
      this.http.delete(`${this.apilogedUser}/${userid}`).subscribe(()=>{
      this.logedUserSubject.next(null);
      this.router.navigate([''])
    })
  }
}
