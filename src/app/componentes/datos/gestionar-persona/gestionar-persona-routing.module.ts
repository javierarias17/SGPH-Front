import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaPrincipalPersonaComponent } from './pages/bandeja-principal-persona/bandeja-principal-persona.component';
const routes: Routes = [
  {
    path:'',
    component: BandejaPrincipalPersonaComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarPersonaRoutingModule { }
