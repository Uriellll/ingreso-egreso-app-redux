import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;

  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    })
  }
  async crearUsuario(){
    if(this.registroForm.invalid) return;
    const {nombre, correo,password} = this.registroForm.value;
    try{
      const result = await this.authService.crearUsuario(nombre,correo,password);
      console.log(result);
      if(result)this.router.navigate(['/login']);
    }catch(err){
      console.log(`Ocurrió un error ${err}`);
    }
    
  }

}
