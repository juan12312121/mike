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
  // Flags para mostrar modales y transiciones
  showModalJefe = false;
  showModalChecador = false;
  closingJefe = false;
  closingChecador = false;
  
  // Modo edición
  editMode = false;
  editModeChecador = false;
  
  // Propiedades para jefe de grupo
  jefeId: number | null = null;
  jefeName: string = '';
  jefeEmail: string = '';
  jefePassword: string = '';
  jefeCarrera: string = '';
  jefeGrupo: string = '';
  
  // Propiedades para checador
  checador: { id?: number; name: string; email: string; password: string } = {
    name: '',
    email: '',
    password: ''
  };
  
  // Mensajes para alertas
  successMessage: string = '';
  errorMessage: string = '';
  
  // Propiedades para mostrar alerta global
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  
  @Output() newJefeAdded = new EventEmitter<any>();
  @Output() newChecadorAdded = new EventEmitter<any>();
  @Output() jefeUpdated = new EventEmitter<any>();
  @Output() jefeDeleted = new EventEmitter<number>();
  
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
  
  // Método para mostrar alerta global
  showGlobalAlert(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
      this.cdr.detectChanges();
    }, 5000);
    
    this.cdr.detectChanges();
  }
  
  // Cerrar alerta global manualmente
  closeAlert(): void {
    this.showAlert = false;
  }
  
 registerJefeGrupo(): void {
  console.log("Iniciando registro de jefe de grupo...");
  console.log("Datos ingresados:", {
    name: this.jefeName,
    email: this.jefeEmail,
    password: this.jefePassword,
    carrera: this.jefeCarrera,
    grupo: this.jefeGrupo
  });

  if (this.jefeName && this.jefeEmail && this.jefePassword && this.jefeCarrera && this.jefeGrupo) {
    this.authService.register(
      this.jefeName.trim(),
      this.jefeEmail.trim(),
      this.jefePassword,
      'jefe de grupo',
      this.jefeCarrera.trim(),
      this.jefeGrupo.trim()
    ).subscribe({
      next: (res) => {
        console.log("Respuesta exitosa del servidor:", res);

        const nuevoJefe = {
          id: res.id,
          name: this.jefeName,
          email: this.jefeEmail,
          carrera: this.jefeCarrera,
          grupo: this.jefeGrupo
        };
        this.newJefeAdded.emit(nuevoJefe);

        this.showGlobalAlert('Jefe de grupo agregado correctamente', 'success');
        this.successMessage = 'Jefe registrado exitosamente!';
        this.clearMessages();
        this.resetJefeGrupoForm();
        this.closeModal();
      },
      error: (err) => {
        console.error("Error en el registro:", err);
        this.errorMessage = 'Hubo un error al registrar al jefe. Intente de nuevo más tarde.';
        this.showGlobalAlert('Error al agregar jefe de grupo', 'error');
        this.clearMessages();
      }
    });
  } else {
    console.warn("Faltan datos en el formulario.");
    this.errorMessage = 'Por favor, complete todos los campos.';
    this.clearMessages();
  }
}

  
  updateJefeGrupo(): void {
    if (this.jefeName && this.jefeEmail && this.jefeCarrera && this.jefeGrupo && this.jefeId !== null) {
      this.authService.updateUser(this.jefeId, {
        name: this.jefeName.trim(),
        email: this.jefeEmail.trim(),
        carrera: this.jefeCarrera.trim(),
        grupo: this.jefeGrupo.trim()
      }).subscribe({
        next: (res) => {
          const jefeActualizado = {
            id: this.jefeId,
            name: this.jefeName,
            email: this.jefeEmail,
            carrera: this.jefeCarrera,
            grupo: this.jefeGrupo
          };
          this.jefeUpdated.emit(jefeActualizado);
          
          // Mostrar alerta global
          this.showGlobalAlert('Jefe de grupo actualizado correctamente', 'success');
          
          this.successMessage = 'Jefe actualizado exitosamente!';
          this.clearMessages();
          this.resetJefeGrupoForm();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Hubo un error al actualizar el jefe. Intente de nuevo más tarde.';
          
          // Mostrar alerta global de error
          this.showGlobalAlert('Error al actualizar jefe de grupo', 'error');
          
          this.clearMessages();
        }
      });
    } else {
      this.errorMessage = 'Por favor complete todos los campos y asegúrese de tener un ID válido.';
      this.clearMessages();
    }
  }
  
  deleteJefeGrupo(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este jefe de grupo?')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.jefeDeleted.emit(id);
          
          // Mostrar alerta global
          this.showGlobalAlert('Jefe de grupo eliminado correctamente', 'success');
        },
        error: (err) => {
          // Mostrar alerta global de error
          this.showGlobalAlert('Error al eliminar jefe de grupo', 'error');
        }
      });
    }
  }
  
  registerChecador(): void {
    if (this.checador.name && this.checador.email && this.checador.password) {
      this.authService.register(
        this.checador.name.trim(),
        this.checador.email.trim(),
        this.checador.password,
        'checador'
      ).subscribe({
        next: (res) => {
          const nuevoChecador = {
            id: res.id,
            name: this.checador.name,
            email: this.checador.email
          };
          this.newChecadorAdded.emit(nuevoChecador);
          
          // Mostrar alerta global
          this.showGlobalAlert('Checador agregado correctamente', 'success');
          
          this.successMessage = 'Checador registrado exitosamente!';
          this.clearMessages();
          this.resetChecadorForm();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Hubo un error al registrar al checador. Intente de nuevo más tarde.';
          
          // Mostrar alerta global de error
          this.showGlobalAlert('Error al agregar checador', 'error');
          
          this.clearMessages();
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos.';
      this.clearMessages();
    }
  }
  
  updateChecador(): void {
    if (this.checador.name && this.checador.email && this.checador.id) {
      this.authService.updateUser(this.checador.id, {
        name: this.checador.name.trim(),
        email: this.checador.email.trim()
      }).subscribe({
        next: (res) => {
          // Mostrar alerta global
          this.showGlobalAlert('Checador actualizado correctamente', 'success');
          
          this.successMessage = 'Checador actualizado exitosamente!';
          this.clearMessages();
          this.resetChecadorForm();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Hubo un error al actualizar el checador. Intente de nuevo más tarde.';
          
          // Mostrar alerta global de error
          this.showGlobalAlert('Error al actualizar checador', 'error');
          
          this.clearMessages();
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos.';
      this.clearMessages();
    }
  }
  
  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
  
  private resetJefeGrupoForm(): void {
    this.jefeName = '';
    this.jefeEmail = '';
    this.jefePassword = '';
    this.jefeCarrera = '';
    this.jefeGrupo = '';
    this.editMode = false;
    this.jefeId = null;
  }
  
  private resetChecadorForm(): void {
    this.checador.name = '';
    this.checador.email = '';
    this.checador.password = '';
    this.editModeChecador = false;
    delete this.checador.id;
  }
}