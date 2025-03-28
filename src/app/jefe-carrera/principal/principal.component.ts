import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../core/service/autenticacion.service'; // Import the service
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
  // Active tab, by default "Jefes de Grupo" tab is selected
  activeTab: string = 'jefes-grupo';
  
  // Variable to store the group leaders
  jefesGrupo: any[] = [];
  searchTerm: string = '';  // Variable to store search term

  @ViewChild(ModalComponent) modal!: ModalComponent;

  // Injecting the authentication service
  constructor(private authService: AutenticacionService) {}

  // Method to switch active tab
  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  // Calls the service to get group leaders when component is initialized
  ngOnInit(): void {
    if (this.activeTab === 'jefes-grupo') {
      this.getJefesGrupo();
    }
  }

  // Function to get group leaders
  getJefesGrupo(): void {
    this.authService.getJefesGrupo().subscribe(
      (response) => {
        console.log("Full API response:", response);
        this.jefesGrupo = response;
        console.log("Group leaders fetched:", this.jefesGrupo);
      },
      (error) => {
        console.error("Error fetching group leaders:", error);
        alert('There was an issue fetching the group leaders. Please try again later.');
      }
    );
  }

  // Method to handle the addition of a new group leader
  onNewJefeAdded(newJefe: any): void {
    this.jefesGrupo.push(newJefe); // Add the new leader to the list
  }

  // Filter group leaders based on search term
  filterJefesGrupo(): any[] {
    if (!this.searchTerm) return this.jefesGrupo;
    return this.jefesGrupo.filter(jefe =>
      jefe.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      jefe.carrera.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      jefe.grupo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
