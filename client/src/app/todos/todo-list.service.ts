import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Todo} from './todo';
import {environment} from '../../environments/environment';


@Injectable()
export class TodoListService {
  readonly baseUrl: string = environment.API_URL + 'todos';
  private todoUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getTodos(todoCategory?: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoUrl);
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(this.todoUrl + '/' + id);
  }

  public filterTodos(todos: Todo[], searchOwner: string, searchStatus: boolean, searchCategory: string, searchBody: string): Todo[] {

    let filteredTodos = todos;

    // Filter by name
    if (searchOwner != null) {
      searchOwner = searchOwner.toLocaleLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
      });
    }

    if (searchStatus != null) {
      filteredTodos = filteredTodos.filter((todo: Todo) => {
        return todo.status === Boolean(searchStatus);
      });
    }

    if (searchBody != null) {
      searchBody = searchBody.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => {
        return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
      });
    }

    if (searchCategory != null) {
      searchCategory = searchCategory.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => {
        return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
      });
    }

    return filteredTodos;
  }

  /*
  //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
  //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
  getTodosByCategory(todoCategory?: string): Observable<Todo> {
      this.todoUrl = this.todoUrl + (!(todoCategory == null || todoCategory == "") ? "?category=" + todoCategory : "");
      console.log("The url is: " + this.todoUrl);
      return this.http.request(this.todoUrl).map(res => res.json());
  }
  */


  private parameterPresent(searchParam: string) {
    return this.todoUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.todoUrl.indexOf(searchParam);
    let end = 0;
    if (this.todoUrl.indexOf('&') !== -1) {
      end = this.todoUrl.indexOf('&', start) + 1;
    } else {
      end = this.todoUrl.indexOf('&', start);
    }
    this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end);
  }

  addNewTodo(newTodo: Todo): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new todo back
      // so we know how to find/access that todo again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new todo with the todo data as the body with specified headers.
    return this.http.post<string>(this.todoUrl + '/new', newTodo, httpOptions);
  }
}
