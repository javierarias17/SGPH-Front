import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/dto/periodo-academico/periodo-academico-out-dto';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { CrearEditarPeriodoAcademicoComponent } from '../../components/crear-editar-periodo-academico/crear-editar-periodo-academico.component';

@Component({
  selector: 'app-bandeja-principal-periodo-academico',
  templateUrl: './bandeja-principal-periodo-academico.component.html',
  styleUrls: ['./bandeja-principal-periodo-academico.component.scss']
})
export class BandejaPrincipalPeriodoAcademicoComponent {

    public facultadesSeleccionadas: number[] = [];
    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    periodos: PeriodoAcademicoOutDTO[];

    totalRecords: number;
    cargando: boolean;
    filtro: any;
    constructor(public dialog: DialogService, 
        private periodoAcademicoService: PeriodoAcademicoService
    ) {}
    
    ngOnInit(): void {
    }

    
    listarPeriodosAcademicosBase() {
        this.cargando = true;
        this.filtro = {
            pagina: 0,
            registrosPorPagina: 10,
        }
        this.periodoAcademicoService.consultarPeriodosAcademicos(this.filtro).subscribe((r) => {
            this.periodos = r.content;
            this.totalRecords = r.totalElements;
            this.cargando = false;
        });
    }


    listarPeriodosAcademicos($event: LazyLoadEvent) {        
        this.filtro = {
            pagina: Math.floor($event.first / $event.rows),
            registrosPorPagina: $event.rows,
        };

        this.periodoAcademicoService.consultarPeriodosAcademicos(this.filtro).subscribe((r) => {
            this.periodos = r.content;
            this.totalRecords = r.totalElements;
            this.cargando = false;
        });        
    }

    /*editarGrupo(grupo: AgrupadorEspacioFiscioDTO) {
        const ref = this.dialog.open(CrearEditarGrupoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Editar Grupo',
            closable: false,
            data: {
                grupo: grupo,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarGruposBase();
        });
    }*/

   
    public registrarPeriodoAcademico() {
        const ref = this.dialog.open(CrearEditarPeriodoAcademicoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Registrar Grupo',
            closable: true,
            data: {
                lectura: false,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarPeriodosAcademicosBase();
        });
    }
}
