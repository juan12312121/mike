import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  deleteChecador(checadorId: number) {
    throw new Error('Method not implemented.');
  }

  private loginUrl = 'http://localhost:3000/api/auth/login';    // URL del backend para login
  private registerUrl = 'http://localhost:3000/api/auth/register'; // URL del backend para registro
  private jefesGrupoUrl = 'http://localhost:3000/api/auth/jefes-grupo'; // URL del backend para obtener todos los jefes de grupo
  private checadoresUrl = 'http://localhost:3000/api/auth/checadores';

  constructor(private http: HttpClient, private router: Router) { }

  // Función para hacer login
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(this.loginUrl, body).pipe(
      tap((response: { token: string; }) => {
        if (response && response.token) {
          this.saveToken(response.token); // Guarda el token en localStorage
        }
      })
    );
  }

  // Función para almacenar el token en el localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Función para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Función para crear los headers con el token de autorización
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      console.log("📢 Token enviado en headers:", token);
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('⚠️ No se encontró un token en localStorage');
    }
    console.log("Headers construidos:", headers);
    return headers;
  }

  // Función para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  // Función para cerrar sesión (eliminar token)
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Función para obtener el rol del usuario desde el token (si está autenticado)
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.parseJwt(token);
      return payload ? payload.role : null;
    }
    return null;
  }

  // Función para obtener el nombre del usuario desde el token
  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.parseJwt(token);
      console.log('Payload decodificado:', payload);
      return payload ? payload.name : null;
    }
    return null;
  }

  // Función para parsear el JWT y obtener el payload
  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  // Función para registrar un usuario.
  // Si el rol es "jefe de grupo", se incluirá el campo carrera.
  register(name: string, email: string, password: string, role: string, carrera?: string, grupo?: string): Observable<any> {
    const body: any = { name, email, password, role };
    if (role === "jefe de grupo") {
      if (carrera) {
        body.carrera = carrera;
      }
      if (grupo) {
        body.grupo = grupo;
      }
    }
    return this.http.post<any>(this.registerUrl, body);
  }

  // Función para obtener todos los usuarios con el rol 'jefe de grupo'
  getJefesGrupo(): Observable<any> {
    return this.http.get<any>(this.jefesGrupoUrl, { headers: this.getHeaders() });
  }

  // Función para obtener los checadores (requiere token de autorización)
  getChecadores(): Observable<any> {
    return this.http.get<any>(this.checadoresUrl, { headers: this.getHeaders() });
  }
}
