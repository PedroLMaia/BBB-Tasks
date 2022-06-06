import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// CALENDAR
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewCategoriaComponent } from './pages/new-categoria/new-categoria.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SingupPageComponent } from './pages/singup-page/singup-page.component';
import { EditCategoriaComponent } from './pages/edit-categoria/edit-categoria.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewCategoriaComponent,
    NewTaskComponent,
    LoginPageComponent,
    HomePageComponent,
    SingupPageComponent,
    EditCategoriaComponent,
    CalendarComponent,
    EditTaskComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
