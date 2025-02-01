import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ConsumoAPIService } from '../services/consumo-api.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class QrCodePage implements OnInit {
  clase: string = '';
  id: string = '';
  horario: string = '';
  alumnos: any[] = [];
  qrCodeData: string = '';
  profesorId: number = 1; 

  constructor(
    private router: Router,
    private consumoApi: ConsumoAPIService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.clase = navigation.extras.state['nombre'];
      this.id = navigation.extras.state['id'];
      this.horario = navigation.extras.state['horario'];
    }
  }

  ngOnInit() {
    const cursoId = parseInt(this.id, 10);

    
    this.consumoApi.getAlumnosCurso(this.profesorId, cursoId).subscribe({
      next: (data: any) => {
        this.alumnos = data;
        this.generateQrCode();
      },
      error: (error) => {
        console.error('Error al obtener los alumnos:', error);
      },
    });
  }

  generateQrCode() {
    const fechaActual = formatDate(new Date(), 'dd/MM/yyyy', 'es-CL');
    this.qrCodeData = JSON.stringify({
      curso: this.clase,
      seccion: this.id,
      fecha: fechaActual,
    });
  }
}