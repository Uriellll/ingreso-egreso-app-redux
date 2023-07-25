import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map} from "rxjs/operators";
import { Usuario } from "../models/usuario.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { AppState } from "../app.reducer";
import * as authActions from "../auth/auth.actions";
import { Observable, Subscription } from "rxjs";
import * as ingresosEgresosActions from "../ingreso-egreso/ingreso-egreso.actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userSubscripton:Subscription;
  private _user:Usuario;

  get user(){
    return this._user;
  }
  constructor(private auth: AngularFireAuth, private router: Router,private firestore:AngularFirestore, private store:Store<AppState>) {
  }
  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      if(fuser){
        console.log('fuser');
        this.userSubscripton =this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((fireStoreUser:any)=>{
            console.log(fireStoreUser);
            const user = Usuario.fromFirebase(fireStoreUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({user}))
          })
      }else{
        if(this.userSubscripton){
          
        this.userSubscripton.unsubscribe();
        }
        this._user = null;
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresosEgresosActions.unSetItems());
      }
    })
  }
  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(
      email,
      password
    ).then(({user})=>{
      const newUser = new Usuario(user.uid,nombre,email);
      this.firestore.doc(`${user.uid}/usuario`)
        .set({...newUser});
      return user;
    })
    
  }
  loginUsuario(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }
  logOut(){
    return this.auth.signOut();
  }
  isAuth(): Observable<boolean>{
    return this.auth.authState.pipe(map(fbUser=> !!fbUser));
  }
}
