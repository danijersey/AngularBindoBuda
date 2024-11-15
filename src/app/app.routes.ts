import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MenuComponent } from './menu/menu.component';
import { AuthGuard } from './login/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },  // Ruta pública de login
    { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },  // Ruta protegida
    { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] },  // Ruta protegida
    { path: '**', redirectTo: '' }  // Redirige cualquier ruta no encontrada al login
  ];
