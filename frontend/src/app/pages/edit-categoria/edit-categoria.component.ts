import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-categoria',
  templateUrl: './edit-categoria.component.html',
  styleUrls: ['./edit-categoria.component.scss']
})
export class EditCategoriaComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  categoriaId!: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.categoriaId = params['categoriaId']
      }
    )
  }
  updateCategoria(title: string) {
    this.taskService.updateCategoria(this.categoriaId, title).subscribe(() => {
      this.router.navigate(['/categorias', this.categoriaId]);
    })
  }
}
