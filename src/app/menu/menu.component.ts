import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenerateTableService } from '../lobby/service/generate-table.service';
import { UserWinersInteface } from '../lobby/interface/create-table.interface';
import { BingoService } from '../lobby/service/bingo.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  constructor(private router:Router,private route: ActivatedRoute,
   private GenerateTableService:GenerateTableService,
   private BingoService:BingoService
  ){}
  token: string | null = null;
  username: string | null = null;
  countdown: number = 30; 
  players: string[] = [];
  usuariosGanadores:any[]=[]
  gameStarted: boolean = false;
  lobbyMessage: string = '';

  ngOnInit(): void {
  this.token = this.route.snapshot.queryParamMap.get('token');
  this.username = this.route.snapshot.queryParamMap.get('username');
  this.GetWinerUsers()
  this.BingoService.onNewPlayer().subscribe((username) => {
    this.players.push(username);
    if (this.players.length >= 3) {
      this.startGame();
    }
  });

  }
  StartGame() {
    this.lobbyMessage = 'Esperando jugadores...';
    this.startCountdown(); // Comienza la cuenta regresiva
    this.BingoService.joinLobby(this.username || ''); // Envía el nombre de usuario al servidor para unirse al lobby
  }
  
  GetWinerUsers(){
    this.GenerateTableService.GetWinerUsers().subscribe({
      next:(response)=>{
        this.usuariosGanadores=response;
      }
    })
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.countdown > 0 && !this.gameStarted) {
        this.countdown--;
      } else {
        clearInterval(interval);
        if (!this.gameStarted) {
          this.lobbyMessage = 'El tiempo se agotó, comenzando el juego con los jugadores disponibles...';
          this.startGame(); // Inicia el juego si no hay 3 jugadores
          this.router.navigate(['/lobby'], { queryParams: { token: this.token, username: this.username } });
        }
      }
    }, 1000);
  }
  
  // Método para iniciar el juego cuando haya suficientes jugadores
  startGame() {
    this.gameStarted = true;
    this.lobbyMessage = 'El juego ha comenzado';
    this.BingoService.startGame();  
    this.router.navigate(['/lobby'], { queryParams: { token: this.token, username: this.username } });
  }
}
