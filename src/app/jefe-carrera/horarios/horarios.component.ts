import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideComponent } from '../aside/aside.component';
import { Paso2Component } from '../pasos/paso2/paso2.component';


@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [AsideComponent, CommonModule, FormsModule, Paso2Component],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent {
}
