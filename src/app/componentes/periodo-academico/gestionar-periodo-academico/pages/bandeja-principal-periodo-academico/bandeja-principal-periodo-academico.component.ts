import { Component } from '@angular/core';
import { LazyLoadEvent, Message } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FacultadOutDTO } from 'src/app/componentes/common/model/facultad/out/facultad.out.dto';
import { CrearEditarPeriodoAcademicoComponent } from '../../components/crear-editar-periodo-academico/crear-editar-periodo-academico.component';
import { PeriodoAcademicoOutDTO } from '../../model/out/periodo-academico-out-dto';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

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

    public messages: Message[] = null;

    constructor(public dialog: DialogService, 
        private periodoAcademicoSharedService: PeriodoAcademicoSharedService
    ) {}
    
    ngOnInit(): void {
        this.consultarPeriodoAcademicoVigente();
    }

    
    private listarPeriodosAcademicosBase() {
        this.cargando = true;
        this.filtro = {
            pagina: 0,
            registrosPorPagina: 10,
        }
        this.periodoAcademicoSharedService.consultarPeriodosAcademicos(this.filtro).subscribe((r) => {
            this.periodos = r.content;
            this.totalRecords = r.totalElements;
            this.cargando = false;
        });
    }


    public listarPeriodosAcademicos($event: LazyLoadEvent) {        
        this.filtro = {
            pagina: Math.floor($event.first / $event.rows),
            registrosPorPagina: $event.rows,
        };

        this.periodoAcademicoSharedService.consultarPeriodosAcademicos(this.filtro).subscribe((r) => {
            this.periodos = r.content;
            this.totalRecords = r.totalElements;
            this.cargando = false;
        });        
    }

    public editarPeriodoAcademico(periodoAcademicoOutDTO: PeriodoAcademicoOutDTO) {
        const ref = this.dialog.open(CrearEditarPeriodoAcademicoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Editar Periodo Académico',
            closable: false,
            data: {
                periodoAcademicoOutDTO: periodoAcademicoOutDTO,
                lectura: false,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarPeriodosAcademicosBase();
        });
        
    }
   
    public registrarPeriodoAcademico() {
        const ref = this.dialog.open(CrearEditarPeriodoAcademicoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Registrar Periodo Académico',
            closable: true,
            data: {
                lectura: false,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarPeriodosAcademicosBase();
            this.consultarPeriodoAcademicoVigente();
            this.periodoAcademicoSharedService.emitirDataPeriodoVigente();
        });
    }

    private consultarPeriodoAcademicoVigente():void{
        this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
            (r: any) => {
                if(r){
                    this.messages=null;
                }else{
                    this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"Cree un nuevo periodo académico para realizar la planificación de horarios" }];
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }
}
