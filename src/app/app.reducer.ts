import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';

export interface AppState {
    ui: ui.State;
    user:auth.State;
    /* ingresoEgreso:  ingresoEgreso.State; */

}



export const appReducers:ActionReducerMap<AppState>={
    ui: ui.uiReducer,
    user: auth.authReducer,
    /* ingresoEgreso: ingresoEgreso.ingresoEgresoReducer */
}

