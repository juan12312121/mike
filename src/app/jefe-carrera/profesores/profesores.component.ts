import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideComponent } from '../aside/aside.component';

interface Professor {
  id: number;
  name: string;
  career: string;
}

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideComponent],
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.css'
})
export class ProfesoresComponent {
  @ViewChild('professorModal') professorModal!: ElementRef;
  @ViewChild('professorForm') professorForm!: ElementRef;

  // Lista completa de profesores
  allProfessors: Professor[] = [
    { id: 1, name: 'Juan Pérez', career: 'Ingeniería de Sistemas' },
    { id: 2, name: 'María González', career: 'Ciencias de la Computación' },
    // Agregar más profesores de ejemplo para probar paginación
    { id: 3, name: 'Carlos Rodríguez', career: 'Ingeniería de Software' },
    { id: 4, name: 'Ana Martínez', career: 'Redes y Telecomunicaciones' },
    { id: 5, name: 'Luis Fernández', career: 'Ingeniería de Sistemas' },
    { id: 6, name: 'Sofía Díaz', career: 'Ciencias de la Computación' },
    { id: 7, name: 'Roberto Sánchez', career: 'Ingeniería de Software' },
    { id: 8, name: 'Laura Torres', career: 'Redes y Telecomunicaciones' },
    { id: 9, name: 'Miguel Ángel Ruiz', career: 'Ingeniería de Sistemas' },
    { id: 10, name: 'Elena Navarro', career: 'Ciencias de la Computación' },
    { id: 11, name: 'Diego Morales', career: 'Ingeniería de Software' },
    { id: 12, name: 'Claudia Herrera', career: 'Redes y Telecomunicaciones' },
    { id: 13, name: 'Javier Mendoza', career: 'Ingeniería de Sistemas' }
  ];

  // Profesores en la página actual
  professors: Professor[] = [];

  // Configuración de paginación
  currentPage: number = 1;
  professorsPerPage: number = 8;
  totalPages: number = 0;

  modalMode: 'add' | 'edit' = 'add';
  currentProfessor: Professor = { id: 0, name: '', career: '' };
  editingRowIndex: number | null = null;

  careers = [
    'Ingeniería de Sistemas',
    'Ciencias de la Computación', 
    'Ingeniería de Software',
    'Redes y Telecomunicaciones'
  ];

  constructor() {
    this.calculateTotalPages();
    this.updatePaginatedProfessors();
  }

  // Calcular total de páginas
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.allProfessors.length / this.professorsPerPage);
  }

  // Actualizar profesores de la página actual
  updatePaginatedProfessors() {
    const startIndex = (this.currentPage - 1) * this.professorsPerPage;
    const endIndex = startIndex + this.professorsPerPage;
    this.professors = this.allProfessors.slice(startIndex, endIndex);
  }

  // Cambiar página
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProfessors();
    }
  }

  // Método para generar array de páginas para la navegación
  getPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  openModal(mode: 'add' | 'edit', professor?: Professor) {
    this.modalMode = mode;
    
    if (mode === 'edit' && professor) {
      // Cuando se edita, clonar el objeto profesor para evitar mutación directa
      this.currentProfessor = { ...professor };
      this.editingRowIndex = this.allProfessors.findIndex(p => p.id === professor.id);
    } else {
      // Resetear para agregar un nuevo profesor
      const newId = this.allProfessors.length > 0 
        ? Math.max(...this.allProfessors.map(p => p.id)) + 1 
        : 1;
      this.currentProfessor = { id: newId, name: '', career: '' };
      this.editingRowIndex = null;
    }

    // Mostrar modal
    const modal = this.professorModal.nativeElement;
    modal.classList.add('show');
  }

  closeModal() {
    const modal = this.professorModal.nativeElement;
    modal.classList.remove('show');
    
    // Resetear el formulario
    this.currentProfessor = { id: 0, name: '', career: '' };
    this.editingRowIndex = null;
  }

  onSubmit() {
    if (this.editingRowIndex !== null) {
      // Actualizar profesor existente
      this.allProfessors[this.editingRowIndex] = { ...this.currentProfessor };
    } else {
      // Agregar nuevo profesor
      this.allProfessors.push({ ...this.currentProfessor });
      
      // Recalcular páginas y actualizar
      this.calculateTotalPages();
      this.currentPage = this.totalPages; // Ir a la última página
    }

    // Actualizar profesores mostrados
    this.updatePaginatedProfessors();
    this.closeModal();
  }

  deleteRow(index: number) {
    // Calcular el índice real en allProfessors
    const realIndex = (this.currentPage - 1) * this.professorsPerPage + index;
    
    // Eliminar profesor
    this.allProfessors.splice(realIndex, 1);
    
    // Renumerar IDs
    this.allProfessors = this.allProfessors.map((prof, idx) => ({
      ...prof,
      id: idx + 1
    }));

    // Recalcular páginas
    this.calculateTotalPages();
    
    // Si la página actual ya no existe, ir a la última página
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    // Actualizar profesores mostrados
    this.updatePaginatedProfessors();
  }
}