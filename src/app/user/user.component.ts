import { Component, OnInit, Inject, PLATFORM_ID,ChangeDetectionStrategy,TemplateRef,ViewEncapsulation } from '@angular/core';
import { User } from '../task-manager.model';
import { CommonModule } from '@angular/common';
import { FormGroup,FormBuilder,FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { TaskService } from '../task-manager.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation:ViewEncapsulation.None,
})
export class UserComponent {
  formGroup: FormGroup;
  users: User[] = [];
  private backupUser: User | null = null;
  isEditMode = false;
  constructor(private fb: FormBuilder, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object,public dialog: MatDialog,) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      type: ['', Validators.required],
      email: ['', Validators.required],
      desigination: ['', Validators.required],
      managed: [''],
    });
  }
  ngOnInit(): void {
    this.taskService.user$.subscribe(user => {
      this.users = user;
    });
  }
  addUser() {
    if (this.formGroup.invalid) {
      alert('Enter all values')
      return;
    }
    if (this.isEditMode) {
      const newTask = this.formGroup.value
      this.updateTask(newTask)
    } else {
      const newUser: User = {
        ...this.formGroup.value,
        completed: false,
        editing:false
      };  
      this.taskService.addUser(newUser).subscribe((savedUser) => {
        this.formGroup.reset();
        this.dialog.closeAll();
      });
    }
  }
  
  deleteUser(user: User): void {
    if (user.id !== undefined){
      this.taskService.deleteUser(user.id);
    } 
  }
  updateTask(user: User): void {
    this.isEditMode = false;
    user.id = this.backupUser?.id
    this.taskService.updateUser(user);
    this.dialog.closeAll()
  }
  openForm(templateRef: TemplateRef<any>, user?: User) {
    if (user) {
      this.formGroup.patchValue(user);
      this.isEditMode = true;
    } else {
      this.formGroup.reset();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'cs-form-dialog';
    this.dialog.open(templateRef, dialogConfig);
  }
  onEdit(templateRef: TemplateRef<any>,user:User) {
    this.backupUser = { ...user };
    user.editing = true;
    this.openForm(templateRef,user)
  }
}
