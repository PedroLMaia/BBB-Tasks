import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-singup-page',
  templateUrl: './singup-page.component.html',
  styleUrls: ['./singup-page.component.scss']
})
export class SingupPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSingupButtonClicked(email: string, password: string) {
    this.authService.singup(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200){
        this.router.navigate(['/categorias'])
      }
      console.log(res);
      console.log('Cadastrado com sucesso e logado!');

    })
  }
}
