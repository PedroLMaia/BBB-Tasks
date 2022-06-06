import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(private webReqServices: WebRequestService) { }

  getCategorias(){
    return this.webReqServices.get('categorias');
  }

  criarCategoria(title: string) {
    //Queremos mandar uma requisicao para criar uma lista
    return this.webReqServices.post('categorias',{ title });
  }

  updateCategoria(id: string, title: string) {
    //Queremos mandar uma requisicao para criar uma lista
    return this.webReqServices.patch(`categorias/${id}`,{ title });
  }

  updateTask(categoriaId: string,  taskId: string, title: string, data: string) {
    //Queremos mandar uma requisicao para criar uma lista
    return this.webReqServices.patch(`categorias/${categoriaId}/tasks/${taskId}`,{ title, data });
  }

  deleteCategoria(id: string){
    return this.webReqServices.delete(`categorias/${id}`);

  }

  deleteTask(categoriaId: string, taskId: string){
    return this.webReqServices.delete(`categorias/${categoriaId}/tasks/${taskId}`);

  }

  getTasks(categoriaId: string){
    return this.webReqServices.get(`categorias/${categoriaId}/tasks`)
  }

  getAllByUsuarioId(usuarioId: string){
    return this.webReqServices.get(`user/${usuarioId}/tasks`)
  }

  criarTask(title: string,date: string, categoriaId: string) {
    //Queremos mandar uma requisicao para criar uma task
    return this.webReqServices.post(`categorias/${categoriaId}/tasks`,{ title, data: date });
  }

  taskCompleta(task: Task){
    return this.webReqServices.patch(`categorias/${task._categoriaId}/tasks/${task._id}`, {
      completada: !task.completada
    })
  }

}
