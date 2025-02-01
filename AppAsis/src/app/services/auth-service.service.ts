import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private authenticated = false;

  constructor() { }

  isLoggedin(){
    return this.authenticated;
  }

  login(){
    this.authenticated = true;
  }

  logout(){
    this.authenticated = false;
  }
}
