import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('Todo component', () => {

  let todoComponent: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoListServiceStub: {
    getTodoById: (todoId: string) => Observable<Todo>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodoById: (todoId: string) => Observable.of([
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
      ].find(todo => todo._id === todoId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoComponent);
      todoComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve python by ID', () => {
    todoComponent.setId('python_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.owner).toBe('Python');
    expect(todoComponent.todo.body).toBe('snakes are not nice');
  });

  it('returns undefined for Rudolph', () => {
    todoComponent.setId('Rudolph');
    expect(todoComponent.todo).not.toBeDefined();
  });

});
