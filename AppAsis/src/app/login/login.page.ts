import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { ConsumoAPIService } from '../services/consumo-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule,CommonModule,ReactiveFormsModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoginPage implements OnInit {
  usuario = new FormGroup({
    user: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
  });

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthServiceService,
    private consumoApi: ConsumoAPIService
  ) {}

  navegar() {
    const { user, pass } = this.usuario.value;

    if (!user || !pass) {
      this.presentAlert('Error', 'Por favor, ingresa usuario y contraseña.');
      return;
    }

    this.consumoApi.getUsuarios().subscribe({
      next: (usuarios) => {
        const usuarioEncontrado = usuarios.find(
          (u) => u.user === user && u.password === pass
        );

        if (usuarioEncontrado) {
          this.authService.login();
          const navigationExtras: NavigationExtras = {
            state: { 
              id: usuarioEncontrado.id, 
              nombre: usuarioEncontrado.nombre,
              perfil: usuarioEncontrado.perfil 
            },
          };

          if (usuarioEncontrado.perfil === 1) {
            this.router.navigate(['/home-docente'], navigationExtras);
          } else if (usuarioEncontrado.perfil === 2) {
            this.router.navigate(['/home-estudiante'], navigationExtras);
          }
        } else {
          this.presentAlert(
            'Error Login',
            'Usuario o contraseña incorrectos. Inténtalo nuevamente.'
          );
        }
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.presentAlert(
          'Error',
          'Ocurrió un problema al intentar iniciar sesión. Por favor, inténtalo más tarde.'
        );
      },
    });
  }

  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      subHeader: titulo,
      message: mensaje,
      buttons: ['Deshacer'],
    });
    await alert.present();
  }

  ngOnInit() {}
}