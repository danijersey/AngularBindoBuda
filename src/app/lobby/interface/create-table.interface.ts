
export interface createTable {
    [row: number]: (number | null)[];
  }
  export interface ValidationDateInterface {
    data: any[][];   // Matriz de números
    array: number[];    // Arreglo de números seleccionados
    username: string | null;
  }
  export interface UserWinersInteface{
    id:number;
    username:string;
  }