import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/app.reducer";
import { AuthService } from "src/app/services/auth.service";
import * as ui from "src/app/shared/ui.actions";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin!: FormGroup;
  cargando:boolean=false;
  uiSubscription:Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    
  }

  ngOnInit() {
    this.formLogin = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
    this.uiSubscription =this.store.select('ui').subscribe(ui=>{
      this.cargando = ui.isLoading});
      console.log('cargando subs');
  }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe(); 
  }
  loginUsuario() {
    if (this.formLogin.invalid) return;
    this.store.dispatch(ui.isLoading());
    const { email, password } = this.formLogin.value;
        /* Swal.fire({
          title: "Cargando aplicación",
          html: "Espera un momento",
          didOpen: () => {
            Swal.showLoading();
          }
        }) */
    this.authService
      .loginUsuario(email, password)
      .then((resp) => {
        this.store.dispatch(ui.stopLoading());
        console.log(resp);
        /* Swal.close(); */
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: "error",
          title: "Algo salió mal",
          text: `${err.message}`,
        });
      });
  }
}
