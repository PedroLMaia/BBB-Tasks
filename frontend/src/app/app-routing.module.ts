import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCategoriaComponent } from './pages/new-categoria/new-categoria.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SingupPageComponent } from './pages/singup-page/singup-page.component';
import { EditCategoriaComponent } from './pages/edit-categoria/edit-categoria.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

const routes: Routes = [
  // {path:'', redirectTo: '/categorias/628e8881ce85e7c026033ae1', pathMatch:'full'},

  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'registrar', component: SingupPageComponent },
  { path: 'nova-categoria', component: NewCategoriaComponent },
  { path: 'edit-categoria/:categoriaId', component: EditCategoriaComponent },
  { path: 'categorias', component: TaskViewComponent },
  { path: 'categorias/:categoriaId', component: TaskViewComponent },
  { path: 'categorias/:categoriaId/nova-task', component: NewTaskComponent },
  { path: 'categorias/:categoriaId/edit-task/:taskId', component: EditTaskComponent },
  { path: 'calendario', component: CalendarComponent },




  // {path:'', redirectTo: '/categorias/628e8881ce85e7c026033ae1', pathMatch:'full'},





  // { path: '', redirectTo: '/categorias/', pathMatch: 'full' }, ok
  // { path: 'nova-categoria', component: NewCategoriaComponent }, ok
  // { path: 'categorias', redirectTo: '/categorias/', pathMatch: 'full' }, //component: TaskViewComponent
  // { path: 'categorias/:categoriaId', component: TaskViewComponent },
  // { path: 'categorias/:categoriaId/nova-task', component: NewTaskComponent },
  // { path: 'login', component: LoginPageComponent },
  // { path: 'home', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
