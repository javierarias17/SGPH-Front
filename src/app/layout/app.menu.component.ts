import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuItem, MessageService } from 'primeng/api';
import { TokenService } from '../componentes/common/services/token.service';
import { PeriodoAcademicoSharedService } from '../shared/service/periodo.academico.shared.service';
import { ReservaTemporalService } from '../componentes/common/services/reserva.temporal.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styles: [`
    /* Headers normal look */
    ::ng-deep .p-panelmenu .p-panelmenu-header > a {
      background-color: #cfe6f4  ;
    }
    /* Header on expanded content */
    ::ng-deep .p-panelmenu .p-panelmenu-header.p-highlight > a {
    background-color: #82b4da;
    }
    /* Header text normal */
    ::ng-deep p-panelmenu .p-component.p-panelmenu-header > a {
    color: #295276 ;
    }
    /* Header on hover, but not expanded */
    ::ng-deep
    .p-panelmenu
    .p-panelmenu-header:not(.p-highlight):not(.p-disabled)
    > a:hover {
    background-color: #82b4da ;
    }
    /* Header on hover, but ALSO Expanded */
    ::ng-deep
    .p-panelmenu
    .p-panelmenu-header.p-highlight:not(.p-disabled)
    > a:hover {
    background-color: #82b4da;
    }`    
    ]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    panelMenuItems: MenuItem[] = [];

    constructor(public layoutService: LayoutService, public periodoAcademicoSharedService:PeriodoAcademicoSharedService, private tokenService: TokenService,
        private reservaTemporalService: ReservaTemporalService, private messageService: MessageService
    ) { }

    ngOnInit() {
        //Se consultan los roles del usuario
        let authorities: string[] = this.tokenService.getAuthorities();

        this.actualizarPeriodoAcademicoVigente();
        this.model = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                routerLink: ['home/inicio']           
            },
            {
                label: 'Periodo Académico',
                items: [
                    { label: 'Gestionar periodo académico', icon: 'pi pi-fw pi-chart-pie', routerLink: ['periodo-academico/gestionar-periodo-academico'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                ],
                visible: authorities.includes('ROLE_PLANIFICADOR')               
            },
            {
                label: 'Datos',
                items: [                    
                    { label: 'Cargar labor docencia', icon: 'pi pi-fw pi-upload', routerLink: ['datos/cargar-labor-docencia'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Gestionar espacios físicos (E.F)', icon: 'pi pi-fw pi-building', routerLink: ['datos/gestionar-espacio-fisico'], visible: authorities.includes('ROLE_PLANIFICADOR') || authorities.includes('ROLE_PRESTAMISTA') },
                    { label: 'Gestionar asignaturas', icon: 'pi pi-fw pi-book', routerLink: ['datos/gestionar-asignatura'], visible: authorities.includes('ROLE_PLANIFICADOR')  },
                    { label: 'Gestionar cursos', icon: 'pi pi-fw pi-star', routerLink: ['datos/gestionar-curso'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Gestionar docentes', icon: 'pi pi-fw pi-users', routerLink: ['datos/gestionar-docente'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Gestionar personas', icon: 'pi pi-fw pi-user-edit', routerLink: ['datos/gestionar-persona'], visible: authorities.includes('ROLE_PLANIFICADOR') || authorities.includes('ROLE_ADMINISTRADOR')  }
                ],
                visible: authorities.includes('ROLE_PLANIFICADOR') || authorities.includes('ROLE_ADMINISTRADOR')
            },   
            {
                label: 'Planificación Horario',
                items: [
                    { label: 'Planificación manual', icon: 'pi pi-fw pi-calendar', routerLink: ['planificacion-horario/planificacion-manual'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Generar horario base a partir del semestre anterior', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['planificacion-horario/planificacion-semestre-anterior'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Eliminar horario por programa', icon: 'pi pi-fw pi-calendar-minus', routerLink: ['planificacion-horario/eliminar-horario-programa'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Gestionar agrupadores E.F', icon: 'pi pi-fw pi-th-large', routerLink: ['planificacion-horario/gestionar-grupos'], visible: authorities.includes('ROLE_PLANIFICADOR') }
                ],
                visible: authorities.includes('ROLE_PLANIFICADOR') 
            },   
            {
                label: 'Reportes',
                items: [
                    { label: 'Generar reporte SIMCA', icon: 'pi pi-download', routerLink: ['reportes/generar-reporte-simca'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Generar reporte docente', icon: 'pi pi-download', routerLink: ['reportes/generar-reporte-docente'], visible: authorities.includes('ROLE_PLANIFICADOR')  },
                    { label: 'Generar reporte espacio físico', icon: 'pi pi-download', routerLink: ['reportes/generar-reporte-espacio-fisico'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    { label: 'Generar reporte franjas libres', icon: 'pi pi-download', routerLink: ['reportes/generar-reporte-franjas-libres'], visible: authorities.includes('ROLE_PLANIFICADOR') },
                    {
                        label: 'Generar historial de reservas temporales',
                        icon: 'pi pi-download',
                        command: () => this.descargarHistorialExcel(),
                        visible: authorities.includes('ROLE_PRESTAMISTA'),
                      },
                    ],
                visible:  authorities.includes('ROLE_PLANIFICADOR') || authorities.includes('ROLE_PRESTAMISTA')    
            }, 
            {
                label: 'Reservas',
                items: [
                    { label: 'Gestionar reserva temporal', icon: 'pi pi-fw pi-id-card', routerLink: ['reservas/seguimiento-reserva'], visible: authorities.includes('ROLE_PRESTAMISTA') },
                ],
                visible: authorities.includes('ROLE_PRESTAMISTA') 
            },        
            {
                label: 'Seguridad',
                items: [
                    { label: 'Gestionar usuarios administradores', icon: 'pi pi-fw pi-users', routerLink: ['seguridad/gestionar-usuario'], visible: authorities.includes('ROLE_ADMINISTRADOR')  }
                ],
                visible: authorities.includes('ROLE_ADMINISTRADOR')      
            }
        ];

        // Descomente para deshabilitar las restricciones de visibilidad en menus
        //this.model.forEach(menu => menu.visible = true);

        // Descomente para deshabilitar las restricciones de visibilidad en items de menu
        //this.model.forEach(menu => menu.item.visible = true);
    }

    public actualizarPeriodoAcademicoVigente(){
        this.periodoAcademicoSharedService.emitirDataPeriodoVigente();
    }

    descargarHistorialExcel(): void {
        this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe({
          next: (periodoVigente: any) => {
            if (!periodoVigente || !periodoVigente.idPeriodoAcademico) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No hay un periodo académico vigente para descargar el historial.',
              });
              return;
            }
      
            this.reservaTemporalService.descargarHistorialReservas(periodoVigente.idPeriodoAcademico).subscribe({
              next: (blob) => {
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = `historial_reservas_${periodoVigente.idPeriodo}.xlsx`;
                a.click();
                URL.revokeObjectURL(objectUrl);
              },
              error: (err) => {
                console.error('Error al descargar el historial de reservas:', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo descargar el historial de reservas.',
                });
              },
            });
          },
          error: (err) => {
            console.error('Error al consultar el periodo académico vigente:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo consultar el periodo académico vigente.',
            });
          },
        });
      }
      
}
