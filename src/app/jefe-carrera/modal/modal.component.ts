import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  constructor(private cdr: ChangeDetectorRef) {}

  // Método para abrir el modal según el tipo
  openModal(modalType: 'jefe' | 'checador'): void {
    console.log('openModal llamado con:', modalType);
    if (modalType === 'jefe') {
      this.showModalJefe = true;
    } else {
      this.showModalChecador = true;
    }
    this.cdr.detectChanges(); // Forzar la detección de cambios
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
      this.cdr.detectChanges(); // Asegurar actualización de la UI
    }, 300);
    
    console.log('Cerrando modales con animación');
  }
}