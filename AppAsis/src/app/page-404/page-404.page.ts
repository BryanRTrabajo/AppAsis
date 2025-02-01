import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.page.html',
  styleUrls: ['./page-404.page.scss'],
  imports: [IonicModule]
})
export class Page404Page implements OnInit {

  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}