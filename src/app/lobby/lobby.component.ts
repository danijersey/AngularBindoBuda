import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerateTableService } from './service/generate-table.service';
import {  ValidationDateInterface } from './interface/create-table.interface';
import { CommonModule } from '@angular/common';
import { BingoService } from './service/bingo.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {
  token: string | null = null;
  username: string | null = null;
  numeroAleatorio: number = 0;  // Esta propiedad se actualizará cada 5 segundos.
  intervalId: any;

  largo=0
  obtenerTabla:any[]=[]
  largotabla:any[]=[]

  disabletabla=false
  datos: ValidationDateInterface = {} as ValidationDateInterface;
  mensaje:string=''
  mostrarMensaje: boolean = false;
  numerosSeleccionados:number[]=[]

  currentBall: number | null = null;
  
  players: string[] = [];
  balls: number[] = [];
  winner: string | null = null;
  constructor(private route: ActivatedRoute,private GenerateTableService:GenerateTableService
    ,private bingoService: BingoService,private router:Router
  ) {}
  
 
  
 
  ngOnInit(): void {
    // Obtener el parámetro de consulta 'token'
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.GenerateTable();
    this.bingoService.onGameOver().subscribe((winner) => {
      this.winner = winner;
      alert(`${winner} ha ganado el juego`);
    });
  
    this.bingoService.onBallDrawn().subscribe((ball) => {
      this.balls.push(ball);
    });

    // Escucha nuevos jugadores que se unan
    this.bingoService.onNewPlayer().subscribe((username) => {
      this.players.push(username);
    });

    // Escucha si alguien gana el juego
    this.bingoService.onGameOver().subscribe((winner) => {
      this.winner = winner;
      alert(`${winner} ha ganado el juego`);
      // Puedes redirigir al menú principal o realizar otras acciones aquí
    });
    this.bingoService.onBallDrawn().subscribe((ball) => {
      this.currentBall = ball; // Actualiza el número en la variable
    });
}

async GenerateTable(){
 await this.GenerateTableService.GenerateTable().subscribe({
    next:(response)=>{
      console.log('datos recibidos',response)
      this.obtenerTabla=response
      this.largotabla=response[0][0]
    },
    error:(err)=>{
      console.log('error',err)
    },
    complete:()=>{
      console.log('completado')
      this.disabletabla=true;
    }
  })
}

mostrarnumero(seleccion:number){
  this.numerosSeleccionados.push(seleccion)
  console.log(this.numerosSeleccionados)
  
}
//enviar datos al backend para verificar el bingo//
Bingo(){
  console.log('Bingo',this.numerosSeleccionados)
  this.datos = {
    data: this.obtenerTabla,              
    array: this.numerosSeleccionados,
    username:this.username     
  };
  this.GenerateTableService.ValidationDateTable(this.datos).subscribe({
    next:(response)=>{
      console.log('funciono?',response)
      if (response === false) {
        
        this.mensaje = '¡No completaste ningun Metodo!';
        this.mostrarMensaje = true; 
        this.router.navigate(['/menu'])
      }
      else{

        this.mensaje = `¡FELICIDADES GANASTE ${this.username} !`;
        this.mostrarMensaje = true;
        this.router.navigate(['/menu'])
      }
    },
    error:(err)=>{
      console.log('nose logro por', err)
    },
    complete:()=>{
      console.log('se logro')
    }
  })
}

ngOnDestroy(): void {
  // Limpiar el intervalo cuando el componente sea destruido.
  clearInterval(this.intervalId);
}

isButtonClicked = false;
onButtonClick(): void {
  this.isButtonClicked = !this.isButtonClicked; // Cambiar color btn
}



/////////////////////////websocket

joinGame(username: string) {
  this.bingoService.joinGame(username);
}

// Método para extraer una bola
drawBall() {
  const ball = Math.floor(Math.random() * 75) + 1; // Genera un número aleatorio para la bola
  this.bingoService.drawBall(ball);
}

// Método para anunciar al ganador
announceWin() {
  const winner = 'Jugador'; // Cambia esto con la lógica para determinar el ganador
  this.bingoService.announceWin(winner);
  this.router.navigate(['/menu'])
}

}
