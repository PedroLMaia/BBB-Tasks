import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private TaskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  categoriaId: string = "";


  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        //console.log(params);
        this.categoriaId = params['categoriaId'];
        //console.log(this.categoriaId);
      }
    )
  }

  criarTask(title: string, date: string ) {
    this.TaskService.criarTask(title,date, this.categoriaId).subscribe((newTask: Task) => {
      console.log(newTask);
      this.router.navigate(['../'], { relativeTo: this.route })
    })
  }

}
