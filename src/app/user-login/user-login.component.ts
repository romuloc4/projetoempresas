import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  mensagem_sucesso: string = '';
  mensagem_erro: string = '';

  //inicialização por injeção de dependencia
  constructor(
    private httpClient: HttpClient
  ){}

  ngOnInit(): void{
  }

  formLogin = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email]),
    senha : new FormControl('', [Validators.required])
  });

  get form() : any{
    return this.formLogin.controls;
  }

  onSubmit() : void {

    this.limparMensagens();

     this.httpClient.post(environment.apiUrl + "/login", this.formLogin.value)
        .subscribe(
          (data: any) => {
            this.mensagem_sucesso = data.message;
            this.formLogin.reset();

            //salvando na localstorage
            localStorage.setItem('AUTH_USER', JSON.stringify(data));
          },
          e => {

            switch (e.status) {
              case 401:
                this.mensagem_erro = e.error.message;
                break;

              default:
                this.mensagem_erro = "Ocorreu um erro ao autenticar o usuário, tente nocamente.";
                break;
            }
          }
        );

  }

  limparMensagens(): void {
    this.mensagem_sucesso = '';
    this.mensagem_erro = '';

  }

}
