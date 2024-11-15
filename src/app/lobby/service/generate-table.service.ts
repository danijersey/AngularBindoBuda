import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createTable, UserWinersInteface, ValidationDateInterface } from '../interface/create-table.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateTableService {

  constructor(
    private http:HttpClient
  ) { 

  }
  GenerateTable(): Observable<createTable[]> {
    return this.http.get<createTable[]>('http://localhost:3000/create-table');
  }

  ValidationDateTable(datos:ValidationDateInterface){
    return this.http.post('http://localhost:3000/create-table/verificar',datos);
  }

  GetWinerUsers(){
    return this.http.get<UserWinersInteface[]>('http://localhost:3000/create-table/lista')
  }
}