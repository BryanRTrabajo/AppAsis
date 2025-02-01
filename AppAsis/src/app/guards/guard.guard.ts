import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

export const guardGuard: CanActivateFn = (route, state) => {
  
const AuthService = inject(AuthServiceService);
const router = inject(Router)

if(AuthService.isLoggedin()){
  return true;
} else {
  return router.createUrlTree(['/login']);
}

};
