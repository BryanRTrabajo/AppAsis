import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ConsumoAPIService } from '../services/consumo-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-estudiante',
  templateUrl: './home-estudiante.page.html',
  styleUrls: ['./home-estudiante.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomeEstudiantePage implements OnInit {
  cursos: any[] = [];
  estudianteId: number | null = null; // Eliminamos el valor hardcodeado
  estudianteNombre: string = '';

  constructor(
    private router: Router,
    private consumoApi: ConsumoAPIService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.estudianteId = navigation.extras.state['id']; // Obtenemos el ID del estudiante
      this.estudianteNombre = navigation.extras.state['nombre'];
    }
  }

  ngOnInit() {
    if (this.estudianteId !== null) {
      this.cargarCursos();
    } else {
      console.error('ID del estudiante no disponible.');
    }
  }

  cargarCursos() {
    if (this.estudianteId !== null) {
      this.consumoApi.getCursosEstudiante(this.estudianteId).subscribe({
        next: (data: any) => {
          this.cursos = data;
        },
        error: (error) => {
          console.error('Error al cargar los cursos:', error);
        },
      });
    }
  }

  navegar(curso: any) {
    const courseData: NavigationExtras = {
      state: {
        nombre: curso.nombre,
        id: curso.id,
        horario: curso.horario,
      },
    };
    this.router.navigate(['/camera'], courseData);
  }
}