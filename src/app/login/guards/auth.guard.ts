// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService:LoginService, private router: Router) {}

  // Método para proteger rutas
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está autenticado
    if (this.loginService.isAuthenticated()) {
      // Si el usuario está autenticado, permitir el acceso
      return true;
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/']);
      return false;
    }
  }
}
