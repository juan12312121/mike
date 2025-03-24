import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { ModalComponent } from "../modal/modal.component";


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [AsideComponent, ModalComponent,CommonModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  // Pestaña activa, por defecto se muestra "Jefes de Grupo"
  activeTab: string = 'jefes-grupo';

  @ViewChild(ModalComponent) modal!: ModalComponent;

  // Método para cambiar la pestaña activa
  selectTab(tab: string): void {
    this.activeTab = tab;
  }
}
