import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  taskId!: string;
  categoriaId!: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params['taskId']
        this.categoriaId = params['categoriaId']
      }
    )
  }
  updateTask(title: string, data: string) {
    this.taskService.updateTask(this.categoriaId, this.taskId, title, data).subscribe(() => {
      this.router.navigate(['/categorias', this.categoriaId]);
    })
  }

}
