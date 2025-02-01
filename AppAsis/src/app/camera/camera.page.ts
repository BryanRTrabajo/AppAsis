import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { ConsumoAPIService } from '../services/consumo-api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  imports: [IonicModule,CommonModule]
})
export class CameraPage {
  foto: string | undefined; 
  curso: any; 
  estudianteId: number | null = null; 

  constructor(
    private router: Router,
    private consumoApi: ConsumoAPIService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.curso = navigation.extras.state['curso']; 
      this.estudianteId = navigation.extras.state['estudianteId']; 
    }
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90, 
        allowEditing: false,
        resultType: CameraResultType.Uri, 
        source: CameraSource.Camera, 
      });

      this.foto = image.webPath;

      this.registrarAsistencia();
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      alert('Error al tomar la foto. Por favor, inténtalo de nuevo.');
    }
  }

  registrarAsistencia() {
    if (this.curso && this.estudianteId !== null) {
      const asistenciaData = {
        alumno_id: this.estudianteId, 
        codigo: this.curso.codigo, 
        seccion: this.curso.seccion, 
        fecha: new Date().toISOString().split('T')[0], 
      };
  
      this.consumoApi.registrarAsistencia(
        asistenciaData.alumno_id,
        asistenciaData.codigo,
        asistenciaData.seccion,
        asistenciaData.fecha
      ).subscribe({
        next: (response) => {
          console.log('Asistencia registrada:', response);
          alert('Asistencia registrada correctamente.');
        },
        error: (error) => {
          console.error('Error al registrar la asistencia:', error);
          alert('Error al registrar la asistencia.');
        },
      });
    } else {
      console.error('Datos del curso o ID del estudiante no disponibles.');
      alert('Error: Datos del curso o ID del estudiante no disponibles.');
    }
  }
}

