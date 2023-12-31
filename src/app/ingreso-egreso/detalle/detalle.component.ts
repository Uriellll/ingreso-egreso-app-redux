import { IngresoEgreso } from './../../models/ingreso-egreso.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;
  constructor(private store:Store<AppStateWithIngreso>, private ieService: IngresoEgresoService) { }

  ngOnInit() {
    this.ingresosSubs=this.store.select('ingresoEgreso')
      .subscribe(({items})=>this.ingresosEgresos = items);
  }
  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }
  borrar(uid:any){
    this.ieService.borrarIngresoEgreso(uid)
      .then(()=> Swal.fire('Borrado','Item borrado', 'success'))
      .catch(err=> Swal.fire('Error', err.message, 'error'))
  }

}
