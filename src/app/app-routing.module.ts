import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuardGuard } from './auth-guard.guard';
import { GestionarReservaTemporalComponent } from './componentes/reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { LoginStudentComponent } from './demo/components/auth/login-student/login.student/login.student.component';
import { InformacionReservaTemporalComponent } from './componentes/reservas/informacion-reserva-temporal/informacion-reserva-temporal.component';
import { HorarioEspacioFisicoComponent } from './componentes/reportes/ver-horario-espacio-fisico/components/horario-espacio-fisico/horario.espacio.fisico.component';
import { VisualizarEspacioFisicoComponent } from './componentes/reportes/ver-horario-espacio-fisico/visualizar-espacio-fisico/visualizar.espacio.fisico.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, canActivate: [AuthGuardGuard],
                children: [
                    { path: '', redirectTo: '/home/inicio', pathMatch: 'full' },
                    { path: 'home', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'periodo-academico', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'datos', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'planificacion-horario', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'reportes', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'reservas', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'seguridad', loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'login-student', component: LoginStudentComponent },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'login-student/ReservaTemporal',  component: GestionarReservaTemporalComponent },
            { path: 'reserva/InformacionReserva',  component: InformacionReservaTemporalComponent },
            { path: 'visualizar-horario/:idEspacioFisico', component: VisualizarEspacioFisicoComponent },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: 'auth' },
        ], { useHash: false })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
