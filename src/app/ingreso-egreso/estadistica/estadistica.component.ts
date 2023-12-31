import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { ChartType} from 'chart.js';
import { MultiDataSet,Label } from 'ng2-charts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {
  ingresos:number = 0;
  egresos: number = 0;
  totalEgresos:number = 0;
  totalIngresos:number = 0;
  public barChartLabels:Label[] = ['Ingresos', 'Egresos'];
  public barChartType: ChartType = 'doughnut';
  public barChartData:MultiDataSet = [[]];
  constructor(private store: Store<AppStateWithIngreso>) { }

  ngOnInit() {
    this.store.select('ingresoEgreso').subscribe(({items})=> this.generarEstadistica(items));
  }
  generarEstadistica(items:IngresoEgreso[]){
    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.egresos = 0;
    this.ingresos = 0;


    for (const item of items) {
      if(item.tipo == 'ingreso'){
        this.totalIngresos += item.monto;
        this.ingresos ++;
      }else{
        this.totalEgresos +=item.monto;
        this.egresos ++;
      }
    }
    this.barChartData = [[this.totalIngresos, this.totalEgresos]];
  }

}
