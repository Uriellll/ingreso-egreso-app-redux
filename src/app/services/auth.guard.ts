import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad,CanActivate {
  constructor(private auth:AuthService, private router:Router){
  }
  canLoad():  Observable<boolean> {
    return this.auth.isAuth().pipe(
      tap(estado=>{
      if(!estado) this.router.navigate(['/login']);
    }),take(1)
    );
  }
  canActivate(): Observable<boolean> {
    return this.auth.isAuth()
      .pipe(
        tap(estado =>{
          console.log(estado);
          if(!estado) this.router.navigate(['/login']);
        })
      )
  }
  
}
