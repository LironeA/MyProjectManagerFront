import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project, Todo } from './models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  private apiUrl = 'https://localhost:44370/api/TodoesAPI';

  constructor(private http: HttpClient) { }

  getTodoList(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }
  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(Todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, Todo);
  }

  updateTodo(Todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${Todo.id}`, Todo);
  }

  deleteTodo(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.apiUrl}/${id}`);
  }
}
