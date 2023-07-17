import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as uiActions from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingeesoEgresoForm: FormGroup;
  tipo:string = 'ingreso';
  cargando:boolean = false;
  loadingSubs: Subscription;
  constructor(private fb: FormBuilder, private ingresoEgresoS: IngresoEgresoService, private store:Store<AppState>) { }

  ngOnInit() {
    this.loadingSubs= this.store.select('ui').subscribe(({isLoading})=> this.cargando = isLoading);
    this.ingeesoEgresoForm = this.fb.group({
      descripcion:['', Validators.required],
      monto: ['', Validators.required]
    })
  }
  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }
  guardar(){
    
    
    if(this.ingeesoEgresoForm.invalid) return;
    this.store.dispatch(uiActions.isLoading());
    const {descripcion,monto}= this.ingeesoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion,monto,this.tipo);
    this.ingresoEgresoS.crearIngresoEgreso(ingresoEgreso)
    .then(()=>{
      this.ingeesoEgresoForm.reset();
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Registro creado', descripcion,'success');
    })
    .catch((err)=>{
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Error', err.message,'error')
    })


  }

}
