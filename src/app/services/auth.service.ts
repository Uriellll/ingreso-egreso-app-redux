import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { map } from "rxjs/operators";
import { Usuario } from "../models/usuario.model";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private router: Router,private firestore:AngularFirestore) {}
  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      console.log(fuser);
    })
  }
  async crearUsuario(nombre: string, email: string, password: string) {
    try {
      Swal.fire({
        title: "Cargando aplicación",
        html: "Espera un momento",
        didOpen: () => {
          Swal.showLoading();
        }
      })
      const {user} = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      Swal.close();
      const newUser = new Usuario(user.uid,nombre,email);
      const result = await this.firestore.doc(`${user.uid}/usuario`)
        .set({...newUser});
      return user;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: `${error.message}`,
      })
    }
  }
  loginUsuario(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }
  logOut(){
    return this.auth.signOut();
  }
  isAuth(){
    return this.auth.authState.pipe(map(fbUser=> fbUser!= null));
  }
}
