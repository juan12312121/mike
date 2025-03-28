import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacionService } from './autenticacion.service'; // Asegúrate de importar tu AutenticacionService

export interface Materia {
  id?: number;
  nombre: string;
  codigo: string;
  carrera_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private apiUrl = 'http://localhost:3000/api'; // URL de la API

  constructor(private http: HttpClient, private authService: AutenticacionService) { }

  // Función para obtener los headers con el token
  private getHeaders(): HttpHeaders {
    return this.authService.getHeaders();  // Usamos el método getHeaders() de AutenticacionService
  }

  // Obtener todas las Materias
  getAllMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));  // Usamos catchError para manejar errores
  }

  // Obtener una Materia por ID
  getMateriaById(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/materias/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Crear una nueva Materia
  createMateria(materia: Materia): Observable<any> {
    return this.http.post(`${this.apiUrl}/materias`, materia, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // En MateriasService
updateMateria(materia: Materia): Observable<any> {
  if (!materia.id) {
    throw new Error("El id de la materia es requerido para actualizar");
  }
  return this.http.put(`${this.apiUrl}/materias/${materia.id}`, materia, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}



  // Función para manejar errores HTTP
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error(error.message || 'Error en la solicitud HTTP'));
  }
}
