import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit() {}
  loginUsuario() {
    if (this.formLogin.invalid) return;
    const { email, password } = this.formLogin.value;
    let timerInterval;
        Swal.fire({
          title: "Cargando aplicación",
          html: "Espera un momento",
          didOpen: () => {
            Swal.showLoading();
          }
        })
    this.authService
      .loginUsuario(email, password)
      .then((resp) => {
        console.log(resp);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal",
          text: `${err.message}`,
        });
      });
  }
}
