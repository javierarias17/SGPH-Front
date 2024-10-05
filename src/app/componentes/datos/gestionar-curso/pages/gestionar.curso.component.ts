import { Component} from '@angular/core';
import { MessageService} from 'primeng/api';
import { CursoService } from '../../../common/services/curso.service';
import { ProgramaService } from '../../../common/services/programa.service';
import { AsignaturaService } from '../../../common/services/asignatura.service';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import { CursoPlanificacionOutDTO } from '../model/out/curso.planificacion.out.dto';
import { FiltroCursoPlanificacionDTO } from '../model/in/filtro.curso.planificacion.dto';
import { Message } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { PlanificacionManualService } from '../../../common/services/planificacion.manual.service';
import { FacultadService } from '../../../common/services/facultad.service';
import { CrearEditarVerCursoComponent } from '../components/crear-editar-consultar-curso/crear.editar.ver.curso.component';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';
@Component({
    selector: 'app-gestionar-curso',
    templateUrl: './gestionar.curso.component.html',
    styleUrls: ['./gestionar.curso.component.css'],
    providers: [MessageService, CursoService, FacultadService, ProgramaService, AsignaturaService, PlanificacionManualService]
})
export class GestionarCursoComponent {

    private readonly PAGINA_CERO: number = 0;   

    private readonly REGISTROS_POR_PAGINA: number = 10;   

    public listaCursoPlanificacionOutDTO: CursoPlanificacionOutDTO[] = [];

    public listaProgramas: any[] = [];

    public programasSeleccionados: any[] = [];   
    
    public listaAsignaturas: any[] = [];
    
    public asignaturasSeleccionadas: any[] = [];
    
    public numeroSemestre: number;
    
    public numeroDocente: number;    

    public filtroCursoPlanificacionDTO: FiltroCursoPlanificacionDTO = new FiltroCursoPlanificacionDTO();
    
    public pagina: number = this.PAGINA_CERO;
    
    public totalRecords:number;  
    
    public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    /*Generales*/
    public cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO;    
    
    /*TEMPORALES*/    
    deleteCursoDialog: boolean = false;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    public messages: Message[] = null;
    constructor(
        private cursoService:CursoService, 
        private programaService: ProgramaService, 
        private asignaturaService:AsignaturaService,
        public periodoAcademicoSharedService:PeriodoAcademicoSharedService,
        private dialog: DialogService,
        private messageService: ShowMessageService,
        private PlanificacionManualService:PlanificacionManualService
    ) {
    }

    public ngOnInit() {   
        this.consultarPeriodoAcademicoVigente();
        this.filtroCursoPlanificacionDTO.registrosPorPagina = this.registrosPorPagina;        
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        
        this.programaService.consultarProgramasPermitidosPorUsuario().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                if(lstProgramaOutDTO.length === 0){
                    this.listaProgramas=[];
                    this.filtroCursoPlanificacionDTO.listaIdPrograma =null;
                }else{
                    this.programasSeleccionados=[];
                    this.listaProgramas = lstProgramaOutDTO.map((programa: any) => ({ abreviatura: programa.abreviatura, nombre: programa.nombre, idPrograma:programa.idPrograma }));
                    this.filtroCursoPlanificacionDTO.listaIdPrograma = lstProgramaOutDTO.map(programa => programa.idPrograma);
                }
                this.consultarCursosPorFiltro();
            },
            (error) => {
                console.error(error);
            }
        );   
    }

    private consultarCursosPorFiltro(){
        this.PlanificacionManualService.consultarCursosPlanificacionPorFiltro(this.filtroCursoPlanificacionDTO).subscribe(
            (response: any) => {
            this.consultarPeriodoAcademicoVigente();
            this.listaCursoPlanificacionOutDTO = response.content;
            this.totalRecords= response.totalElements;
            },
            (error) => {
            console.error(error);
            }
        );
    }
  
    public onProgramasChange(){        
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        if(this.programasSeleccionados){
            this.filtroCursoPlanificacionDTO.listaIdPrograma = this.programasSeleccionados;

            if(this.programasSeleccionados.length === 1){
                this.asignaturaService.consultarAsignaturasPorIdPrograma(this.programasSeleccionados[0]).subscribe(
                    (response: any) => {
                        if(response.length === 0){
                            this.listaAsignaturas=[];
                        }else{
                            this.listaAsignaturas = response.map((asignatura: any) => ({ nombre: asignatura.nombre, semestre: asignatura.semestre, idAsignatura:asignatura.idAsignatura }));
                        }
                        this.consultarCursosPorFiltro();
                    },
                    (error) => {
                        console.error(error);
                    }
                    );
            }else{
                this.asignaturasSeleccionadas=[];
                this.listaAsignaturas=[];
                this.filtroCursoPlanificacionDTO.listaIdAsignatura = null;
                this.consultarCursosPorFiltro();
            }
        }else{
            this.programasSeleccionados=[];
            this.listaAsignaturas=[];
            this.asignaturasSeleccionadas=null;
            this.filtroCursoPlanificacionDTO.listaIdPrograma=null;
            this.filtroCursoPlanificacionDTO.listaIdAsignatura = null;
            this.consultarCursosPorFiltro();
        }
    }

    public onAsignaturasChange(){        
        if( this.asignaturasSeleccionadas){
            this.filtroCursoPlanificacionDTO.listaIdAsignatura = this.asignaturasSeleccionadas.map(asignatura => asignatura.idAsignatura);
        }else{
            this.filtroCursoPlanificacionDTO.listaIdAsignatura =[];
        }
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        this.consultarCursosPorFiltro();
    }

    public onSemestreChange() {        
        if( this.numeroSemestre === null){
            this.filtroCursoPlanificacionDTO.semestre=null;
        }else if(this.numeroSemestre < 1 || this.numeroSemestre > 10){
            this.filtroCursoPlanificacionDTO.semestre=null;
            this.numeroSemestre=null;
            return;
        }
        this.filtroCursoPlanificacionDTO.semestre=this.numeroSemestre;
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        this.consultarCursosPorFiltro();
    }   

    public onDocenteChange(){
        if( this.numeroDocente === null){
            this.filtroCursoPlanificacionDTO.cantidadDocentes=null;
        }else if(this.numeroDocente < 0 || this.numeroDocente > 4){
            this.filtroCursoPlanificacionDTO.cantidadDocentes=null;
            this.numeroDocente=null;
            return;
        }
        this.filtroCursoPlanificacionDTO.cantidadDocentes=this.numeroDocente;
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        this.consultarCursosPorFiltro();
    }      
    
    public onPageChange(event: any) {
        this.filtroCursoPlanificacionDTO.pagina =event.page;     
        this.consultarCursosPorFiltro();
    }
    crear() {
        this.dialog.open(CrearEditarVerCursoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Crear curso',
            closable: false,
            data: {
              lectura: false
            }
        })
    }
    ver(curso: CursoPlanificacionOutDTO) {
        this.dialog.open(CrearEditarVerCursoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Información curso',
            closable: false,
            data: {
              id: curso.idCurso,
              lectura: true
            }
        })
    }
    editar(curso: CursoPlanificacionOutDTO) {
        this.dialog.open(CrearEditarVerCursoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Editar curso',
            closable: false,
            data: {
              id: curso.idCurso,
              lectura: false
            }
        })
    }
    
    /*Eliminar curso*/
    public eliminarCurso(cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO) {
        this.cursoPlanificacionOutDTOSeleccionado = { ...cursoPlanificacionOutDTOSeleccionado};
        this.deleteCursoDialog = true;
    }
   
    public confirmarEliminacion(idCurso: number) {
        this.deleteCursoDialog = false;
        this.cursoService.eliminarCurso(idCurso).subscribe(r => {
            if (r) {
                this.messageService.showMessage('success', "Curso eliminado")
                this.consultarCursosPorFiltro()
            }
        })
    }

    public actualizarInformacionCursos():void {
        this.consultarCursosPorFiltro();
    }

    private consultarPeriodoAcademicoVigente():void{
        this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
            (r: any) => {
                if(r){
                    this.messages=null;
                }else{
                    this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá visualizar cursos si no existe un periodo académico abierto." }];
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }
}
