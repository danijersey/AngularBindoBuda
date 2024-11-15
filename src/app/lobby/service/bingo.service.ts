// src/app/services/bingo.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BingoService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:3000'; 

  constructor(private router:Router) {
    this.socket = io(this.SERVER_URL);
  }

  // Método para unirse al juego
  joinGame(username: string) {
    this.socket.emit('joinGame', username);
  }

  // Método para emitir la extracción de una bola
  drawBall(ball: number) {
    this.socket.emit('drawBall', ball);
  }

  // Método para avisar cuando alguien canta Bingo
  announceWin(winner: string) {
    this.socket.emit('bingoWin', winner);
  }

  // Escuchar cuando una bola es extraída
  onBallDrawn(): Observable<number> {
    return new Observable((observer) => {
      this.socket.on('ballDrawn', (ball: number) => {
        observer.next(ball);
      });
    });
  }

  // Escuchar cuando alguien se une al juego
  onNewPlayer(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('newPlayer', (username: string) => {
        observer.next(username);
      });
    });
  }

  // msg cuando alguien gana el juego y redireccion
  
  onGameOver(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('gameOver', (winner: string) => {
        observer.next(winner);
        this.router.navigate(['/menu'])
      });
    });
  }
  //ingreso deñ usuaruio al servidor
  joinLobby(username: string) {
    this.socket.emit('joinLobby', username);
  }
  
  // Escuchar actualizaciones del lobby
  onLobbyUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('lobbyUpdate', (data) => {
        observer.next(data);
      });
    });
  }
  
  // Iniciar el juego (enviar evento al servidor)
  startGame() {
    this.socket.emit('startGame');
  }
  
  // Escuchar cuando el juego comienza
  onGameStart(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('gameStart', (data) => {
        observer.next(data);
      });
    });
  }
}
