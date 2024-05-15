import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaPrincipalAsignaturaComponent } from './pages/bandeja-principal-asignatura/bandeja-principal-asignatura.component';
const routes: Routes = [
  {
    path:'',
    component: BandejaPrincipalAsignaturaComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarAsignaturaRoutingModule { }
