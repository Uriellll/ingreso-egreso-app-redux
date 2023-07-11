import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2'
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  cargando:boolean=false;
  

  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router, private store:Store<AppState>) { }

  ngOnInit() {
    this.store.select('ui').subscribe((ui)=>{
      this.cargando = ui.isLoading;
    })
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    })
  }
  ngOnDestroy(){

  }
  async crearUsuario(){
    if(this.registroForm.invalid) return;
    this.store.dispatch(ui.isLoading());
    /* Swal.fire({
      title: "Cargando aplicación",
      html: "Espera un momento",
      didOpen: () => {
        Swal.showLoading();
      }
    }) */
    const {nombre, correo,password} = this.registroForm.value;

    try{
      const result = await this.authService.crearUsuario(nombre,correo,password);
      this.store.dispatch(ui.stopLoading());
      if(result){
        /* Swal.close(); */
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/login']);

      }
    }catch(err){
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: `${err.message}`,
      })
      console.log(`Ocurrió un error ${err}`);
    }
    
  }

}
