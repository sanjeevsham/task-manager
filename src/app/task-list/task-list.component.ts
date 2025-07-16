import { Component, OnInit, Inject, PLATFORM_ID,ChangeDetectionStrategy,TemplateRef,ViewEncapsulation } from '@angular/core';
import { Task } from '../task-manager.model';
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
  selector: 'app-task-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation:ViewEncapsulation.None,
})
export class TaskListComponent implements OnInit {
  formGroup: FormGroup;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: 'all' | 'completed' | 'inProgress' = 'all';
  private backupTask: Task | null = null;
  isEditMode = false;
  constructor(private fb: FormBuilder, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object,public dialog: MatDialog,) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      createdOn: [''],
      createdBy: ['', Validators.required],
      description: ['', Validators.required],
      status: ['To Do', Validators.required],
      assignedTo: ['', Validators.required],
      dueDate: [''],
      priority: ['']
    });
  }
  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }
  addTask() {
    if (this.formGroup.invalid) {
      alert('Enter all values')
      return;
    }
    if (this.isEditMode) {
      const newTask = this.formGroup.value
      this.updateTask(newTask)
    } else {
      const newTask: Task = {
        ...this.formGroup.value,
        completed: false,
        editing:false
      };  
      this.taskService.addTask(newTask).subscribe(() => {
        this.formGroup.reset();
        this.dialog.closeAll();
      });
    }
  }
  
  deleteTask(task: Task): void {
    if (task.id !== undefined){
      this.taskService.deleteTask(task.id);
    } 
  }
  // toggleTask(task: Task): void {
  //   this.taskService.toggleTask(task);
  // }
  updateTask(task: Task): void {
    this.isEditMode = false;
    task.id = this.backupTask?.id
    this.taskService.updateTask(task);
    this.dialog.closeAll()
  }
  setFilter(filter: 'all' | 'completed' | 'inProgress') {
    this.filter = filter;
    this.applyFilter();
  }
  applyFilter() {
    switch (this.filter) {
      case 'completed':
        this.filteredTasks = this.tasks.filter(t => t.status === 'Completed');
        break;
      case 'inProgress':
        this.filteredTasks = this.tasks.filter(t => t.status === 'In Progress');
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }
  openForm(templateRef: TemplateRef<any>, task?: Task) {
    if (task) {
      this.formGroup.patchValue(task);
      this.isEditMode = true;
    } else {
      this.formGroup.reset();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'cs-form-dialog';
    this.dialog.open(templateRef, dialogConfig);
  }
  onEdit(templateRef: TemplateRef<any>,task:Task) {
    this.backupTask = { ...task };
    task.editing = true;
    this.openForm(templateRef,task)
  }
}

