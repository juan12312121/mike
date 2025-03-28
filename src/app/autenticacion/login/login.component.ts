import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de que está importado
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../core/service/autenticacion.service'; // Ajusta la ruta de tu servicio

@Component({
  selector: 'app-login',
  standalone: true,  // Componente standalone
  imports: [CommonModule, FormsModule, HttpClientModule],  // Asegúrate de que HttpClientModule esté aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isPasswordVisible: boolean = false;

  constructor(private autenticacionService: AutenticacionService, private router: Router) {}

  // Función que maneja el inicio de sesión
  login() {
    this.autenticacionService.login(this.email, this.password).subscribe(
      response => {
        this.autenticacionService.saveToken(response.token);  // Guarda el token
        const role = response.role;
        
        // Redirige según el rol del usuario
        if (role === 'jefe de grupo') {
          this.router.navigate(['/jefe-grupo']);
        } else if (role === 'checador') {
          this.router.navigate(['/checador']);
        } else if (role === 'jefe de carrera') {
          this.router.navigate(['/jefe-carrera']);
        } else {
          this.errorMessage = 'Rol no reconocido';
        }
      },
      error => {
        this.errorMessage = error.error.message || 'Credenciales incorrectas';
      }
    );
  }

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.isPasswordVisible ? 'text' : 'password';
  }
}
