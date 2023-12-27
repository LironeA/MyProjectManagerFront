import { Component } from '@angular/core';
import { Project, Todo } from '../models';
import { ProjectService } from '../project-service.service';
import { TodoListService } from '../todo-list-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent {
  projects: Project[] = [];
  todoList: Todo[] = [];
  selectedProject: Project | null = null;
  todoForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  constructor(private projectService: ProjectService, private todoListServiceService: TodoListService) { }
  
  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
    interval(10000)
    .pipe(
      startWith(0),
      switchMap(() => this.projectService.getProjects())
    )
    .subscribe(projects => {
      this.projects = projects;
    });

    interval(10000)
    .pipe(
      startWith(0),
      switchMap(() => this.todoListServiceService.getTodoList())
    )
    .subscribe(newTodos => {
      if (!this.selectedProject) {
        return;
      }
      newTodos = newTodos.filter(todo => todo.projectId === (this.selectedProject ? this.selectedProject.id : -1)).sort((a, b) => (a.order || 0) - (b.order || 0));
      this.todoList = this.highlightChangedTodos(this.todoList, newTodos);
    });
  }

  highlightChangedTodos(oldTodos: Todo[], newTodos: Todo[]): Todo[] {
    let highlightedTodos: Todo[] = [];
  
    for (let newTodo of newTodos) {
      let oldTodo = oldTodos.find(todo => todo.id === newTodo.id);
      if (oldTodo) {
        for (let key in newTodo) {
          if (key in oldTodo && newTodo[key as keyof Todo] !== oldTodo[key as keyof Todo]) {
            newTodo.highlight = true;
            setTimeout(() => {
              newTodo.highlight = false;
            }, 1000);
            break;
          }
        }
      }
      highlightedTodos.push(newTodo);
    }
    return highlightedTodos;
  }

  onProjectSelected(project: Project) {
    this.selectedProject = project;
    this.todoListServiceService.getTodoList().subscribe(todoList => {
      
      this.todoList = todoList.filter(todoList => todoList.projectId === project.id).sort((a, b) => (a.order || 0) - (b.order || 0));
      console.log(this.todoList);
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = {
        id: 0,
        projectId: this.selectedProject?.id || 0,
        name: this.todoForm.value.name || '',
        description: '',
        isComplete: false,
        highlight: false
      };
      this.todoListServiceService.createTodo (newTodo).subscribe(todo => {
        this.todoList.push(todo);
        this.todoForm.reset();
      });
    }

  }

  deleteTodo(todo: Todo): void {
    this.todoListServiceService.deleteTodo(todo.id).subscribe(() => {
      const index = this.todoList.indexOf(todo);
      if (index > -1) {
        this.todoList.splice(index, 1);
      }
    });
  }

  updateIsComplete(event: Event, todo: Todo): void {
    todo.isComplete = (event.target as HTMLInputElement).checked;
    this.todoListServiceService.updateTodo(todo).subscribe();
    console.log(todo);
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.todoList, event.previousIndex, event.currentIndex);
    this.todoList.forEach((todo, index) => {
      todo.order = index;
      this.todoListServiceService.updateTodo(todo).subscribe();
    });
  }

  deleteProject(project: Project): void {
    this.projectService.deleteProject(project.id).subscribe(() => {
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.selectedProject = null;
    });
  }
}
