import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaGruposComponent } from './pages/bandeja-grupos/bandeja-grupos.component';
const routes: Routes = [
  {
    path:'',
    component: BandejaGruposComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionGruposRoutingModule { }
