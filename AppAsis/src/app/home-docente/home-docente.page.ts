import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsumoAPIService } from '../services/consumo-api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-docente',
  templateUrl: './home-docente.page.html',
  styleUrls: ['./home-docente.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomeDocentePage implements OnInit {
  cursos: any[] = [];
  profesorId: number | null = null; // Eliminamos el valor hardcodeado
  profesorNombre: string = "";

  constructor(
    private router: Router,
    private consumoApi: ConsumoAPIService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.profesorId = navigation.extras.state['id']; // Obtenemos el ID del profesor
      this.profesorNombre = navigation.extras.state['nombre'];
    }
  }

  ngOnInit() {
    if (this.profesorId !== null) {
      this.consumoApi.getCursos(this.profesorId).subscribe({
        next: (data) => {
          this.cursos = data;
        },
        error: (err) => {
          console.error('Error al cargar los cursos:', err);
        }
      });
    } else {
      console.error('ID del profesor no disponible.');
    }
  }

  navegarACurso(curso: any) {
    this.router.navigate(['/qr-code'], {
      state: {
        nombre: curso.nombre,
        id: curso.id,
        horario: curso.horario
      }
    });
  }
}