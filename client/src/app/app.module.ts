import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './users/user.component';
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {TodoComponent} from './todos/todo.component';
import {TodoListService} from './todos/todo-list.service';
import {TodoListComponent} from './todos/todo-list.component';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';
import {AddTodoComponent} from './todos/add-todo.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserComponent,
    TodoListComponent,
    TodoComponent,
    AddUserComponent,
    AddTodoComponent
  ],
  providers: [
    UserListService,
    TodoListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddUserComponent,
    AddTodoComponent,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
