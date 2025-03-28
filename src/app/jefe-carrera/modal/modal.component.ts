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
  // Variables para controlar la visibilidad de cada modal
  showModalJefe = false;
  showModalChecador = false;
  
  // Variables para animación de cierre
  closingJefe = false;
  closingChecador = false;

  // Variables para el formulario de registro de jefe de grupo
  jefeName: string = '';
  jefeEmail: string = '';
  jefePassword: string = '';
  jefeCarrera: string = '';
  jefeGrupo: string = '';

  @Output() newJefeAdded = new EventEmitter<any>(); // Emisor para enviar el nuevo jefe de grupo al componente principal

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AutenticacionService
  ) {}

  // Método para abrir el modal según el tipo
  openModal(modalType: 'jefe' | 'checador'): void {
    console.log('openModal llamado con:', modalType);
    if (modalType === 'jefe') {
      this.showModalJefe = true;
    } else {
      this.showModalChecador = true;
    }
    this.cdr.detectChanges();
    console.log('showModalJefe:', this.showModalJefe, 'showModalChecador:', this.showModalChecador);
  }

  // Método para cerrar todos los modales con animación
  closeModal(): void {
    console.log('closeModal llamado');
    
    if (this.showModalJefe) this.closingJefe = true;
    if (this.showModalChecador) this.closingChecador = true;
    
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      this.showModalJefe = false;
      this.showModalChecador = false;
      this.closingJefe = false;
      this.closingChecador = false;
      this.cdr.detectChanges();
    }, 300);
    
    console.log('Cerrando modales con animación');
  }

  // Método para registrar al jefe de grupo
  registerJefeGrupo(): void {
    // Validar que todos los campos estén completos
    if (!this.jefeName.trim() || !this.jefeEmail.trim() || !this.jefePassword.trim() || !this.jefeCarrera.trim() || !this.jefeGrupo.trim()) {
      console.warn('Todos los campos son obligatorios para registrar un jefe de grupo.');
      alert('Por favor, complete todos los campos.'); // Alerta simple
      return;
    }
  
    // Llamada al servicio para registrar el usuario con rol "jefe de grupo"
    this.authService.register(
      this.jefeName.trim(),
      this.jefeEmail.trim(),
      this.jefePassword,
      'jefe de grupo',
      this.jefeCarrera.trim(),
      this.jefeGrupo.trim()
    ).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        this.resetJefeGrupoForm();
        this.closeModal();
        
        // Aquí se agrega el nuevo jefe de grupo a la lista en el componente principal
        const nuevoJefe = {
          name: this.jefeName,
          email: this.jefeEmail,
          carrera: this.jefeCarrera,
          grupo: this.jefeGrupo,
          // Añadir otros datos que el API haya retornado si es necesario
        };
        
        // Pasar el nuevo jefe de grupo al componente principal
        this.newJefeAdded.emit(nuevoJefe);
        
        // Mostrar una alerta de éxito
        alert('Jefe de grupo registrado exitosamente!');
      },
      error: (err) => {
        console.error('Error al registrar al jefe de grupo:', err);
        alert('Hubo un error al registrar al jefe de grupo. Intente de nuevo más tarde.'); // Alerta de error
      }
    });
  }
  

  // Método para limpiar los campos del formulario de jefe de grupo
  private resetJefeGrupoForm(): void {
    this.jefeName = '';
    this.jefeEmail = '';
    this.jefePassword = '';
    this.jefeCarrera = '';
    this.jefeGrupo = '';
  }
}
