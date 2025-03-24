import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'app-registro-asistencias',
  standalone: true,
  imports: [AsideComponent],
  templateUrl: './registro-asistencias.component.html',
  styleUrls: ['./registro-asistencias.component.css']
})
export class RegistroAsistenciasComponent implements AfterViewInit {
  // Referencias a los contenedores donde se insertarán los canvas
  @ViewChild('barChartContainer') barChartContainer!: ElementRef;
  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;

  // Datos para la gráfica de barras
  professorLabels = [
    'Dr. Juan Pérez', 
    'Mtra. Laura Sánchez', 
    'Dr. Roberto Martínez', 
    'Mtro. Carlos Gutiérrez',
    'Dra. Susana Díaz',
    'Dr. Antonio Morales',
    'Mtra. Elena Ramos',
    'Dr. Miguel Ángel Vargas'
  ];
  attendanceData = [95, 78, 82, 90, 93, 75, 88, 72];

  // Variables para almacenar las instancias de las gráficas
  barChart!: Chart;
  pieChart!: Chart;

  ngAfterViewInit(): void {
    // Configurar la gráfica de barras
    const barChartCanvas = document.createElement('canvas');
    barChartCanvas.id = 'professorAttendanceChart';
    this.barChartContainer.nativeElement.innerHTML = '';
    this.barChartContainer.nativeElement.appendChild(barChartCanvas);

    this.barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: {
        labels: this.professorLabels,
        datasets: [{
          label: '% de Asistencia',
          data: this.attendanceData,
          backgroundColor: 'rgba(75, 108, 183, 0.7)',
          borderColor: 'rgba(75, 108, 183, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}% de asistencia`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`
            },
            title: {
              display: true,
              text: 'Porcentaje de Asistencia'
            }
          },
          x: {
            ticks: { maxRotation: 45, minRotation: 45 }
          }
        }
      }
    });

    // Configurar la gráfica circular (pie)
    const pieChartCanvas = document.createElement('canvas');
    pieChartCanvas.id = 'absenceTypesChart';
    this.pieChartContainer.nativeElement.innerHTML = '';
    this.pieChartContainer.nativeElement.appendChild(pieChartCanvas);

    const absenceData = {
      labels: [
        'Enfermedad', 
        'Trámites administrativos', 
        'Problemas personales', 
        'Sin justificación'
      ],
      datasets: [{
        data: [45, 25, 15, 15],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1
      }]
    };

    this.pieChart = new Chart(pieChartCanvas, {
      type: 'pie',
      data: absenceData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 15 }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          }
        }
      }
    });
  }

  // Método para actualizar las gráficas (vincúlalo con el botón en el template)
  actualizarGraficas(): void {
    // Simulación de actualización de datos para la gráfica de barras
    this.attendanceData = this.attendanceData.map(value => {
      const change = Math.floor(Math.random() * 11) - 5;
      let newValue = value + change;
      return Math.min(Math.max(newValue, 0), 100);
    });
    this.barChart.data.datasets[0].data = this.attendanceData;
    this.barChart.update();

    // Actualizar la gráfica circular generando nuevos valores aleatorios que sumen 100
    let newValues = [
      Math.floor(Math.random() * 50) + 30,
      Math.floor(Math.random() * 30) + 10,
      Math.floor(Math.random() * 20) + 5,
      0
    ];
    const sum = newValues[0] + newValues[1] + newValues[2];
    newValues[3] = 100 - sum;
    this.pieChart.data.datasets[0].data = newValues;
    this.pieChart.update();

    alert('Gráficas actualizadas con los datos más recientes.');
  }
}
