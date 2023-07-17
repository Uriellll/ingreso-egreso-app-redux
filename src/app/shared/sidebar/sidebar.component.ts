import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  nombre:string = "";
  constructor(private authService: AuthService, private router:Router, private store:Store<AppState>) { }

  ngOnInit() {
    this.store.select('user')
      .pipe(filter( ({user})=> user != null))
      .subscribe( ({ user }) => this.nombre = user.nombre);

  }
  logOut(){
    this.authService.logOut().then(()=>{
      this.router.navigate(['/login']);
    })
  }

}
