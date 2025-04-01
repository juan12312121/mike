import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../core/service/autenticacion.service';
import { AsideComponent } from "../aside/aside.component";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [AsideComponent, ModalComponent, CommonModule, FormsModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  activeTab: string = 'jefes-grupo';
  jefesGrupo: any[] = [];
  checadores: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  pages: number[] = [];
  filteredChecadores: any[] | undefined;

  @ViewChild(ModalComponent) modal!: ModalComponent;

  constructor(private authService: AutenticacionService) {}

  ngOnInit(): void {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      this.activeTab = storedTab;
    }
    this.loadData();
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab);
    this.currentPage = 1;
    this.loadData();
  }

  loadData(): void {
    if (this.activeTab === 'jefes-grupo') {
      this.getJefesGrupo();
    } else if (this.activeTab === 'checadores') {
      this.getChecadores();
    }
  }

  getJefesGrupo(): void {
    this.authService.getJefesGrupo().subscribe({
      next: (response) => {
        console.log("Jefes de Grupo obtenidos:", response);
        this.jefesGrupo = response;
        this.calculateTotalPages();
      },
      error: (error) => {
        console.error("Error al obtener jefes de grupo:", error);
        this.mostrarToast('Hubo un problema al obtener los jefes de grupo.', 'error');
      }
    });
  }

  getChecadores(): void {
    this.authService.getChecadores().subscribe({
      next: (response) => {
        console.log("Checadores obtenidos:", response);
        if (!Array.isArray(response)) {
          console.error("La respuesta del API no es un array:", response);
          this.mostrarToast("Error en la estructura de datos recibida.", 'error');
          return;
        }
        this.checadores = response;
        this.filteredChecadores = [...this.checadores];
        this.calculateTotalPages();
      },
      error: (error) => {
        console.error("Error en la petición de checadores:", error);
        this.mostrarToast("Hubo un problema al obtener los checadores.", 'error');
      }
    });
  }

  calculateTotalPages(): void {
    const filtered = this.searchTerm 
      ? this.jefesGrupo.filter(jefe =>
          jefe.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.carrera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.grupo.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : this.jefesGrupo;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get filteredJefesGrupo(): any[] {
    let filtered = this.searchTerm 
      ? this.jefesGrupo.filter(jefe =>
          jefe.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.carrera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.grupo.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : this.jefesGrupo;

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onNewJefeAdded(newJefe: any): void {
    this.jefesGrupo.push(newJefe);
    this.calculateTotalPages();
  }

  onNewChecadorAdded(newChecador: any): void {
    this.checadores.push(newChecador);
    this.filteredChecadores = [...this.checadores];
    this.calculateTotalPages();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    // Actualizar el filtrado si se requiere
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredChecadores = this.checadores.filter(checador => 
        checador.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        checador.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredChecadores = [...this.checadores];
    }
  }

  deleteUsuario(userId: number, tipo: 'jefe' | 'checador'): void {
    const tipoUsuario = tipo === 'jefe' ? 'Jefe de Grupo' : 'Checador';
    const mensaje = `Esta acción eliminará permanentemente al ${tipoUsuario}. ¿Continuar?`;

    if (!confirm(mensaje)) return;

    this.authService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`${tipoUsuario} eliminado correctamente`);
        this.actualizarListaUsuarios(userId, tipo);
        this.mostrarToast(`${tipoUsuario} eliminado exitosamente.`, 'success');
      },
      error: (error) => {
        console.error(`Error al eliminar el ${tipoUsuario}:`, error);
        this.mostrarToast(`Hubo un problema al eliminar el ${tipoUsuario}.`, 'error');
      }
    });
  }

  private actualizarListaUsuarios(userId: number, tipo: 'jefe' | 'checador') {
    if (tipo === 'jefe') {
      this.jefesGrupo = this.jefesGrupo.filter(jefe => jefe.id !== userId);
    } else {
      this.checadores = this.checadores.filter(checador => checador.id !== userId);
      this.filteredChecadores = [...this.checadores];
    }
    this.calculateTotalPages();
  }

  /**
   * Función para mostrar un toast de notificación.
   * Se inyecta el mensaje y se asigna la clase según el tipo: 'success' o 'error'.
   */
  private mostrarToast(mensaje: string, tipo: 'success' | 'error'): void {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
      ${mensaje}
      <button class="close-btn">&times;</button>
    `;

    // Agrega el toast al contenedor
    toastContainer.appendChild(toast);

    // Permitir cierre manual del toast
    toast.querySelector('.close-btn')?.addEventListener('click', () => {
      toast.remove();
    });

    // Elimina automáticamente el toast después de 5 segundos
    setTimeout(() => toast.remove(), 5000);
  }

  openEditModal(user: any, userType: 'jefe' | 'checador'): void {
    if (userType === 'jefe') {
      // Configura los campos con los datos actuales del jefe, incluyendo el ID
      this.modal.jefeId = user.id;
      this.modal.jefeName = user.name;
      this.modal.jefeEmail = user.email;
      this.modal.jefeCarrera = user.carrera;
      this.modal.jefeGrupo = user.grupo;
      this.modal.editMode = true;
      this.modal.openModal('jefe');
    } else {
      // Configura los campos del checador, asignando su ID si existe
      this.modal.checador.id = user.id;
      this.modal.checador.name = user.name;
      this.modal.checador.email = user.email;
      this.modal.editModeChecador = true;
      this.modal.openModal('checador');
    }
  }

  onJefeUpdated(updatedJefe: any): void {
    const index = this.jefesGrupo.findIndex(jefe => jefe.id === updatedJefe.id);
    if (index !== -1) {
      this.jefesGrupo[index] = updatedJefe;
    } else {
      this.jefesGrupo.push(updatedJefe);
    }
  }
}
