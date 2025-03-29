import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../core/service/autenticacion.service'; // Import del servicio
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
  // Pestaña activa, por defecto la de "Jefes de Grupo"
  activeTab: string = 'jefes-grupo';
  
  // Variables para almacenar los jefes de grupo y checadores
  jefesGrupo: any[] = [];
  checadores: any[] = [];
  searchTerm: string = '';  // Término para búsqueda

  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 5; // Ajusta la cantidad de elementos por página
  totalPages: number = 0;

  @ViewChild(ModalComponent) modal!: ModalComponent;
  filteredChecadores: any[] | undefined;
pages: any;

  constructor(private authService: AutenticacionService) {}

  // Método para cambiar la pestaña activa
  selectTab(tab: string): void {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab);
    // Reiniciar la paginación cuando se cambia de pestaña
    this.currentPage = 1;
    if (this.activeTab === 'jefes-grupo') {
      this.getJefesGrupo();
    } else if (this.activeTab === 'checadores') {
      this.getChecadores();
    }
  }

  // Se llama al iniciar el componente
  ngOnInit(): void {
    // Recupera el tab activo desde localStorage, si existe
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      this.activeTab = storedTab;
    }
    if (this.activeTab === 'jefes-grupo') {
      this.getJefesGrupo();
    } else if (this.activeTab === 'checadores') {
      this.getChecadores();
    }
  }

  // Función para obtener los jefes de grupo desde el API
  getJefesGrupo(): void {
    this.authService.getJefesGrupo().subscribe(
      (response) => {
        console.log("Respuesta completa del API:", response);
        this.jefesGrupo = response;
        this.calculateTotalPages();
        console.log("Jefes de grupo obtenidos:", this.jefesGrupo);
      },
      (error) => {
        console.error("Error al obtener jefes de grupo:", error);
        alert('Hubo un problema al obtener los jefes de grupo. Intente nuevamente más tarde.');
      }
    );
  }

  // Función para obtener los checadores desde el API
  getChecadores(): void {
    console.log("Iniciando petición para obtener checadores...");
  
    this.authService.getChecadores().subscribe(
      (response) => {
        console.log("Respuesta completa del API (checadores):", response);
        this.checadores = response;
  
        // Verificar si los datos recibidos son correctos
        if (!Array.isArray(response)) {
          console.error("La respuesta del API no es un array:", response);
          alert("Error en la estructura de datos recibida.");
          return;
        }
  
        // Asigna los checadores obtenidos a filteredChecadores si no hay término de búsqueda
        if (!this.searchTerm) {
          this.filteredChecadores = [...this.checadores];
        }
        
        this.calculateTotalPages();
        console.log("Checadores obtenidos correctamente:", this.checadores);
      },
      (error) => {
        console.error("Error en la petición de checadores:", error);
  
        if (error.status) {
          console.error(`Código de estado HTTP: ${error.status}`);
        }
  
        if (error.message) {
          console.error(`Mensaje de error: ${error.message}`);
        }
  
        alert("Hubo un problema al obtener los checadores. Revisa la consola para más detalles.");
      }
    );
  }
  
  

  // Método para recalcular el total de páginas en base a la lista filtrada
  calculateTotalPages(): void {
    const filtered = this.searchTerm 
      ? this.jefesGrupo.filter(jefe =>
          jefe.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.carrera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.grupo.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : this.jefesGrupo;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  }

  // Getter para obtener la lista filtrada y paginada
  get filteredJefesGrupo(): any[] {
    // Filtrar según el término de búsqueda
    let filtered = this.searchTerm 
      ? this.jefesGrupo.filter(jefe =>
          jefe.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.carrera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          jefe.grupo.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : this.jefesGrupo;

    // Recalcular total de páginas y reiniciar currentPage si es necesario
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Método para cambiar de página
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Métodos para avanzar o retroceder página
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

  // Método para recibir el evento de nuevo jefe agregado desde el ModalComponent
  onNewJefeAdded(newJefe: any): void {
    this.jefesGrupo.push(newJefe); // Se añade el nuevo registro a la lista
    this.calculateTotalPages();
  }

  onNewChecadorAdded(newChecador: any): void {
    // Agrega el nuevo checador al arreglo de checadores
    this.checadores.push(newChecador);
  
    // Si no se está usando búsqueda, actualiza también filteredChecadores
    // O, si usas lógica de búsqueda, vuelve a aplicar el filtro.
    if (!this.searchTerm) {
      this.filteredChecadores = [...this.checadores];
    } else {
      this.onSearch(); // Vuelve a filtrar con el término actual
    }
  
    // Recalcula la paginación si es necesario
    this.calculateTotalPages();
    console.log('Nuevo checador agregado:', newChecador);
  }
  

  // Método para cuando se cambia el término de búsqueda
  onSearchChange(): void {
    // Reinicia la página actual y recalcula total de páginas
    this.currentPage = 1;
    this.calculateTotalPages();
    // Actualiza la lista filtrada en tiempo real
    this.onSearch();
  }
  
  // Método para la búsqueda de checadores
  onSearch(): void {
    if (this.searchTerm) {
      this.filteredChecadores = this.checadores.filter(checador => 
        checador.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        checador.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Si no hay término de búsqueda, muestra todos los checadores
      this.filteredChecadores = [...this.checadores];
    }
  }
  

  // Método para editar un checador

  // Método para eliminar un checador
  
}
