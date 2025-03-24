import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ClassBlock {
  id: number;
  subject: string;
  group: string;
  location: string;
  topicVisible: boolean;
  topicInput: string;
  savedTopic: string;
  topicButtonText: string;
}

@Component({
  selector: 'app-jefegrupo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jefegrupo.component.html',
  styleUrls: ['./jefegrupo.component.css']
})
export class JefegrupoComponent {
  weekActive: boolean = true;

  // Horario extendido: 4 horas (filas) y 5 días (columnas)
  rows: ClassBlock[][] = [
    // Fila 1: 8:00 - 9:00
    [
      {
        id: 1,
        subject: 'Matemáticas',
        group: 'Grupo 101',
        location: 'Aula 101',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 2,
        subject: 'Historia',
        group: 'Grupo 101',
        location: 'Aula 102',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 3,
        subject: 'Ciencias',
        group: 'Grupo 101',
        location: 'Laboratorio 1',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 4,
        subject: 'Inglés',
        group: 'Grupo 101',
        location: 'Aula 103',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 5,
        subject: 'Educación Física',
        group: 'Grupo 101',
        location: 'Cancha 1',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      }
    ],
    // Fila 2: 9:00 - 10:00
    [
      {
        id: 6,
        subject: 'Física',
        group: 'Grupo 102',
        location: 'Laboratorio 2',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 7,
        subject: 'Química',
        group: 'Grupo 102',
        location: 'Laboratorio 3',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 8,
        subject: 'Biología',
        group: 'Grupo 102',
        location: 'Laboratorio 4',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 9,
        subject: 'Geografía',
        group: 'Grupo 102',
        location: 'Aula 104',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 10,
        subject: 'Artes',
        group: 'Grupo 102',
        location: 'Aula 105',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      }
    ],
    // Fila 3: 10:00 - 11:00
    [
      {
        id: 11,
        subject: 'Matemáticas Avanzadas',
        group: 'Grupo 201',
        location: 'Aula 201',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 12,
        subject: 'Literatura',
        group: 'Grupo 201',
        location: 'Aula 202',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 13,
        subject: 'Filosofía',
        group: 'Grupo 201',
        location: 'Aula 203',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 14,
        subject: 'Economía',
        group: 'Grupo 201',
        location: 'Aula 204',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 15,
        subject: 'Informática',
        group: 'Grupo 201',
        location: 'Laboratorio 5',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      }
    ],
    // Fila 4: 11:00 - 12:00
    [
      {
        id: 16,
        subject: 'Historia Moderna',
        group: 'Grupo 301',
        location: 'Aula 301',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 17,
        subject: 'Geografía Avanzada',
        group: 'Grupo 301',
        location: 'Aula 302',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 18,
        subject: 'Ciencias Sociales',
        group: 'Grupo 301',
        location: 'Aula 303',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 19,
        subject: 'Arte y Cultura',
        group: 'Grupo 301',
        location: 'Aula 304',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      },
      {
        id: 20,
        subject: 'Música',
        group: 'Grupo 301',
        location: 'Aula 305',
        topicVisible: false,
        topicInput: '',
        savedTopic: '',
        topicButtonText: 'Tema'
      }
    ]
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  // Alterna la visibilidad de la semana
  toggleWeek(): void {
    this.weekActive = !this.weekActive;
  }

  // Muestra u oculta el input para ingresar/editar el tema con logs de depuración
  toggleTopicInput(block: ClassBlock): void {
    console.log(`toggleTopicInput: Antes de togglear, block.id ${block.id} tiene topicVisible = ${block.topicVisible}`);
    if (!block.topicVisible && block.savedTopic) {
      block.topicInput = block.savedTopic;
    }
    block.topicVisible = !block.topicVisible;
    console.log(`toggleTopicInput: Después de togglear, block.id ${block.id} tiene topicVisible = ${block.topicVisible}`);
    // Angular actualiza la vista sin forzar cambios en este caso.
    // this.cdr.detectChanges();
  }

  // Guarda el tema ingresado y actualiza el botón sin ocultar el input
  saveTopic(block: ClassBlock): void {
    const trimmed = block.topicInput.trim();
    if (trimmed !== '') {
      block.savedTopic = trimmed;
      block.topicVisible = false; // Oculta el input
      block.topicButtonText = 'Editar tema';
      console.log(`saveTopic: Tema guardado para block.id ${block.id}: ${block.savedTopic}`);
    }
  }
}
