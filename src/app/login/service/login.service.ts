import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetTokenInterface, LoginInterface } from '../interface/login.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private tokenKey = 'auth_token'; // Clave para almacenar el token

  constructor(private http: HttpClient) {}

  // Método para enviar los datos del usuario al backend
  SendUser(Datos: LoginInterface): Observable<GetTokenInterface> {
    return this.http.post<GetTokenInterface>('http://localhost:3000/login-auth/login', Datos);
  }

  // Método para guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken(); // Si hay token, está autenticado
  }

  // Método para cerrar sesión (eliminar token)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
