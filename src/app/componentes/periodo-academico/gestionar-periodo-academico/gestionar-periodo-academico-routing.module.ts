import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaPrincipalPeriodoAcademicoComponent } from './pages/bandeja-principal-periodo-academico/bandeja-principal-periodo-academico.component';

const routes: Routes = [
  {
    path:'',
    component: BandejaPrincipalPeriodoAcademicoComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarPeriodoAcademicoRoutingModule { }
