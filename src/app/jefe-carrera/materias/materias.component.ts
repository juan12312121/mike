import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materia, MateriasService } from '../../core/service/materias.service';
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideComponent],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {
  isAddModalOpen = false;
  isUpdateModalOpen = false;
  subjects: Materia[] = [];
  
  notification: { message: string, type: 'success' | 'error' } | null = null;

  currentSubject: Materia = {
    nombre: '',
    codigo: '',
    carrera_id: 0
  };

  constructor(private materiasService: MateriasService) { }

  ngOnInit(): void {
    this.loadMaterias();
  }

  // Método para mostrar notificaciones
  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 5000);
  }

  // Carga la lista de materias
  loadMaterias(): void {
    this.materiasService.getAllMaterias().subscribe(
      (data) => {
        this.subjects = data;
      },
      (error) => {
        this.showNotification('Error al cargar materias', 'error');
      }
    );
  }

  // Abre el modal para agregar una nueva materia
  openAddModal(): void {
    this.isAddModalOpen = true;
    // Reinicia el objeto para evitar datos previos
    this.currentSubject = { nombre: '', codigo: '', carrera_id: 0 };
  }

  // Cierra el modal de agregar
  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  // Abre el modal para actualizar una materia existente
  openUpdateModal(subject: Materia): void {
    this.isUpdateModalOpen = true;
    // Clona la materia a actualizar
    this.currentSubject = { ...subject };
  }

  // Cierra el modal de actualizar
  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
  }

  // Valida que se hayan completado todos los campos
  private validateSubject(): boolean {
    const { nombre, codigo, carrera_id } = this.currentSubject;
    if (!nombre || !codigo || !carrera_id) {
      this.showNotification('Por favor, complete todos los campos', 'error');
      return false;
    }
    return true;
  }

  // Método para agregar una nueva materia
  addSubject(): void {
    if (!this.validateSubject()) {
      return;
    }

    this.materiasService.createMateria(this.currentSubject).subscribe(
      (response) => {
        this.showNotification('Materia agregada exitosamente', 'success');
        this.closeAddModal();
        this.loadMaterias();
      },
      (error) => {
        this.showNotification('Error al agregar la materia', 'error');
      }
    );
  }

  // Método para actualizar una materia existente
  updateSubject(): void {
    if (!this.validateSubject()) {
      return;
    }
    if (!this.currentSubject.id) {
      this.showNotification('El id de la materia es requerido para actualizar', 'error');
      return;
    }
    this.materiasService.updateMateria(this.currentSubject).subscribe(
      (response) => {
        this.showNotification('Materia actualizada exitosamente', 'success');
        this.closeUpdateModal();
        this.loadMaterias();
      },
      (error) => {
        this.showNotification('Error al actualizar la materia', 'error');
      }
    );
  }

  // Retorna la clase de ícono según el tipo de notificación
  getIconClass(): string {
    if (!this.notification) return '';
    return this.notification.type === 'success'
      ? 'fas fa-check-circle'
      : 'fas fa-times-circle';
  }
}
