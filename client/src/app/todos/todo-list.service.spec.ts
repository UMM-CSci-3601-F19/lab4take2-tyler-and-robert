import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {
      _id: 'java_id',
      owner: 'Java',
      status: false,
      category: 'Code',
      body: 'Java is very fun to learn'
    },
    {
      _id: 'python_id',
      owner: 'Python',
      status: false,
      category: 'Snake',
      body: 'snakes are not nice'
    },
    {
      _id: 'cee_id',
      owner: 'Cee',
      status: true,
      category: 'Letter',
      body: 'this is an a and b conversation, cee your way out of it.'
    }
  ];
  const mTodos: Todo[] = testTodos.filter(todo =>
    todo.category.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the todoListService to meaningfully test category filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let todoListService: TodoListService;
  let currentlyImpossibleToGenerateSearchTodoUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the todos we get from this call to getTodos()
    // should be our set of test todos. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoListService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodos(todoCategory) adds appropriate param string to called URL', () => {
    todoListService.getTodos('m').subscribe(
      todos => expect(todos).toEqual(mTodos)
    );

    const req = httpTestingController.expectOne(todoListService.baseUrl + '?category=m&');
    expect(req.request.method).toEqual('GET');
    req.flush(mTodos);
  });

  it('filterByCategory(todoCategory) deals appropriately with a URL that already had a category', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?category=f&something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByCategory('m');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&category=m&');
  });

  it('filterByCategory(todoCategory) deals appropriately with a URL that already had some filtering, but no category', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByCategory('m');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&category=m&');
  });

  it('filterByCategory(todoCategory) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?category=&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByCategory('');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '');
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('todo list filters by owner', () => {
    expect(testTodos.length).toBe(3);
    let todoOwner = 'a';
    expect(todoListService.filterTodos(testTodos, todoOwner, null, null, null).length).toBe(1);
  });

  it('todo list filters by status', () => {
    expect(testTodos.length).toBe(3);
    let todoStatus = false;
    expect(todoListService.filterTodos(testTodos, null, todoStatus, null, null).length).toBe(2);
  });

  it('todo list filters by owner and status', () => {
    expect(testTodos.length).toBe(3);
    let todoStatus = true;
    let todoOwner = 'e';
    expect(todoListService.filterTodos(testTodos, todoOwner, todoStatus, null, null).length).toBe(1);
  });

  it('contains a todo owner named \'Chris\'', () => {
    expect(testTodos.some((todo: Todo) => todo.owner === 'Cee')).toBe(true);
  });

  it('contain a todo owner named \'Jamie\'', () => {
    expect(testTodos.some((todo: Todo) => todo.owner === 'Python')).toBe(true);
  });

  it('doesn\'t contain a todo owner named \'Santa\'', () => {
    expect(testTodos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
  });

  it('has two todos that are false', () => {
    expect(testTodos.filter((todo: Todo) => todo.status === false).length).toBe(2);
  });

  it('contains all the todos', () => {
    expect(testTodos.length).toBe(3);
  });

  it('adding a todo calls api/todos/new', () => {
    const jesse_id = 'jesse_id';
    const newTodo: Todo = {
      _id: '',
      owner: 'Jesse',
      status: true,
      category: 'Smithsonian',
      body: 'museums are cool'
    };

    todoListService.addNewTodo(newTodo).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = todoListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });


});
