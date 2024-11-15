import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { GetTokenInterface, LoginInterface } from './interface/login.interface';
import { LoginService } from './service/login.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private LoginService:LoginService,private router:Router
  ){}
  username:string=''
  Password:string=''
  Datos: LoginInterface = {} as LoginInterface;
  DatosRetornados:GetTokenInterface = {} as GetTokenInterface;
  token:string=''
  errorMessage: string = '';
  ngOnInit() {
  
  }
  SendUser() {
    this.Datos = { UserName: this.username, Password: this.Password };
    // Llamar al servicio de login para autenticar al usuario
    this.LoginService.SendUser(this.Datos).subscribe({
      next: (response) => {
        this.DatosRetornados = response;
        
        if (this.DatosRetornados && this.DatosRetornados.Token) {
          this.token = this.DatosRetornados.Token;
          console.log('Token recibido:', this.token);
          
          // Guardamos el token en localStorage
          this.LoginService.setToken(this.token);

          // Redirigimos al usuario a la página principal o menú
          this.router.navigate(['/menu'], {
            queryParams: { token: this.token, username: this.username }
          });
        } else {
          this.errorMessage = 'Error al autenticar el usuario.';
        }
      },
      error: (err) => {
        console.error('Error en la solicitud de login:', err);
        this.errorMessage = 'Credenciales incorrectas .';
      },
      complete: () => {
        console.log('Solicitud de ingreso completada');
      }
    });
  }
}
