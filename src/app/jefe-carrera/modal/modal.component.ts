import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../core/service/autenticacion.service';

@Component({
  selector: 'app-modal',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  open(checador: any) {
    throw new Error('Method not implemented.');
  }
  showModalJefe = false;
  showModalChecador = false;
  closingJefe = false;
  closingChecador = false;

  jefeName: string = '';
  jefeEmail: string = '';
  jefePassword: string = '';
  jefeCarrera: string = '';
  jefeGrupo: string = '';

  checador = {
    name: '',
    email: '',
    password: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  @Output() newJefeAdded = new EventEmitter<any>();
  @Output() newChecadorAdded = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AutenticacionService
  ) {}

  openModal(modalType: 'jefe' | 'checador'): void {
    if (modalType === 'jefe') {
      this.showModalJefe = true;
    } else {
      this.showModalChecador = true;
    }
    this.cdr.detectChanges();
  }

  closeModal(): void {
    if (this.showModalJefe) this.closingJefe = true;
    if (this.showModalChecador) this.closingChecador = true;
    
    setTimeout(() => {
      this.showModalJefe = false;
      this.showModalChecador = false;
      this.closingJefe = false;
      this.closingChecador = false;
      this.cdr.detectChanges();
    }, 300);
  }

  registerJefeGrupo(): void {
    if (!this.jefeName.trim() || !this.jefeEmail.trim() || !this.jefePassword.trim() || !this.jefeCarrera.trim() || !this.jefeGrupo.trim()) {
      this.errorMessage = 'Por favor, complete todos los campos para registrar un profesor.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    this.authService.register(
      this.jefeName.trim(),
      this.jefeEmail.trim(),
      this.jefePassword,
      'jefe de grupo',
      this.jefeCarrera.trim(),
      this.jefeGrupo.trim()
    ).subscribe({
      next: (res) => {
        const nuevoJefe = {
          name: this.jefeName,
          email: this.jefeEmail,
          carrera: this.jefeCarrera,
          grupo: this.jefeGrupo,
        };
        this.newJefeAdded.emit(nuevoJefe);
        this.successMessage = 'Profesor registrado exitosamente!';
        setTimeout(() => this.successMessage = '', 3000);
        this.resetJefeGrupoForm();
        this.closeModal();
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al registrar al profesor. Intente de nuevo más tarde.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  registerChecador(): void {
    if (!this.checador.name.trim() || !this.checador.email.trim() || !this.checador.password.trim()) {
      this.errorMessage = 'Por favor, complete todos los campos para registrar un checador.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    console.log('Registrando checador con datos:', this.checador);
    
    this.authService.register(
      this.checador.name.trim(),
      this.checador.email.trim(),
      this.checador.password,
      'checador'
    ).subscribe({
      next: (res) => {
        console.log('Respuesta del registro de checador:', res);
        const nuevoChecador = {
          name: this.checador.name,
          email: this.checador.email,
        };
        this.newChecadorAdded.emit(nuevoChecador);
        this.successMessage = 'Checador registrado exitosamente!';
        setTimeout(() => this.successMessage = '', 3000);
        this.resetChecadorForm();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al registrar checador:', err);
        if (err.status) {
          console.error(`Código de estado HTTP: ${err.status}`);
        }
        if (err.message) {
          console.error(`Mensaje de error: ${err.message}`);
        }
        this.errorMessage = 'Hubo un error al registrar al checador. Intente de nuevo más tarde.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
  
  
  private resetJefeGrupoForm(): void {
    this.jefeName = '';
    this.jefeEmail = '';
    this.jefePassword = '';
    this.jefeCarrera = '';
    this.jefeGrupo = '';
  }

  private resetChecadorForm(): void {
    this.checador.name = '';
    this.checador.email = '';
    this.checador.password = '';
  }
}
