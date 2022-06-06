import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';
import { Categoria } from 'src/app/models/categoria.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  categorias: Categoria[] = [];
  tasks: Task[] = [];

  selectedCategoriaId!: string;

  constructor(private taskServices: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        if (params['categoriaId']) {
          this.selectedCategoriaId = params['categoriaId'];
          // console.log(params);
          this.taskServices.getTasks(params['categoriaId']).subscribe((tasks: any) => {
            this.tasks = tasks;
          })
        }else{
          this.tasks = undefined!;
        }
      }

    )

    this.taskServices.getCategorias().subscribe((categorias: any) => {
      return this.categorias = categorias;
    })

  }

  clickNaTask(task: Task) {
    this.taskServices.taskCompleta(task).subscribe(() => {
      console.log("Completado com sucesso!!")
      task.completada = !task.completada;
    })
  }

  onDeleteCategoriaClick(){
    this.taskServices.deleteCategoria(this.selectedCategoriaId).subscribe((res: any) => {
      this.router.navigate(['/categorias'])
      console.log(res)
    })
  }
  onDeleteTaskClick(task: Task){
    if (task._id) {
      const id = task._id
      this.taskServices.deleteTask(this.selectedCategoriaId, id).subscribe((res: any) => {
        this.tasks = this.tasks.filter(val => val._id !== id);
        console.log(res)
      })   
    }
   
  }
  logout() {
    this.authService.logout()
   }

}
//console.log(categorias)


























// import { Component, OnInit } from '@angular/core';
// import { TaskService } from 'src/app/task.service';
// import { ActivatedRoute, Params, Router } from '@angular/router';
// import { Task } from 'src/app/models/task.model';
// import { Categoria } from 'src/app/models/categoria.model'

// @Component({
//   selector: 'app-task-view',
//   templateUrl: './task-view.component.html',
//   styleUrls: ['./task-view.component.scss']
// })
// export class TaskViewComponent implements OnInit {

//   categorias: Categoria[] | undefined;
//   tasks: Task[] | undefined;

//   selectedCategoriaId: string | undefined;

//   constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

//   ngOnInit() {
//     this.route.params.subscribe(
//       (params: Params) => {
//         if (params['categoriaId']) {
//           this.selectedCategoriaId = params['categoriaId'];
//           this.taskService.getTasks(params['categoriaId']).subscribe((tasks: any) => {
//             this.tasks = tasks;
//           })
//         } else {
//           this.tasks = undefined;
//         }
//       }
//     )

//     this.taskService.getCategorias().subscribe((categorias: any) => {
//       this.categorias = categorias;
//     })

//   }
// }