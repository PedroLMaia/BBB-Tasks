import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { TaskService } from 'src/app/task.service';


@Component({
  selector: 'app-new-categoria',
  templateUrl: './new-categoria.component.html',
  styleUrls: ['./new-categoria.component.scss']
})
export class NewCategoriaComponent implements OnInit {

  constructor(private taskServices: TaskService, private router: Router) { }

  ngOnInit(): void{
  }

  criarCategoria(title: string) {
    this.taskServices.criarCategoria(title).subscribe((categoria: Categoria) => {
      console.log(categoria);

      this.router.navigate(['/categorias', categoria._id])

      //Agora navegamos para /categorias/response._id
    });
  }
}
