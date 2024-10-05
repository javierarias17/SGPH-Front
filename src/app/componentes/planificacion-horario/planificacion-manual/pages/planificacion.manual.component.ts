import { Component, ViewChild } from '@angular/core';
import { FacultadOutDTO } from '../../../common/model/facultad/out/facultad.out.dto';
import { EstadoCursoHorarioEnum } from '../../../common/enum/estado.curso.horario.enum';
import { Message, MessageService } from 'primeng/api';
import { ProgramaService } from '../../../common/services/programa.service';
import { AsignaturaService } from '../../../common/services/asignatura.service';
import { AsociarDocenteComponent } from '../components/asociar-docente/asociar.docente.component';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import { InfoGeneralCursosPorProgramaDTO } from '../../../datos/gestionar-curso/model/out/info.general.cursos.por.programa.dto';
import { CursoPlanificacionOutDTO } from '../../../datos/gestionar-curso/model/out/curso.planificacion.out.dto';
import { FiltroCursoPlanificacionDTO } from '../../../datos/gestionar-curso/model/in/filtro.curso.planificacion.dto';
import { PlanificacionManualService } from '../../../common/services/planificacion.manual.service';
import { TranslateService } from '@ngx-translate/core';
import { AsociarEspacioFisicoComponent } from '../components/asociar-espacio-fisico/asociar.espacio.fisico.component';
import { FacultadService } from '../../../common/services/facultad.service';
import { LenguajeService } from '../../../common/services/lenguaje.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

@Component({
selector: 'app-planificacion-manual',
templateUrl: './planificacion.manual.component.html',
styleUrls: ['./planificacion.manual.component.css'],
providers: [MessageService, FacultadService, ProgramaService, AsignaturaService, PlanificacionManualService, LenguajeService]
})
export class PlanificacionManualComponent {

    private readonly PAGINA_CERO: number = 0;   

    private readonly REGISTROS_POR_PAGINA: number = 10;   

    public listaCursoPlanificacionOutDTO: CursoPlanificacionOutDTO[] = [];

    public listaProgramas: any[] = [];

    public programasSeleccionados: number[] = [];
        
    public listaHorarios= [];
    
    public horarioSeleccionado: { label: string, codigo: EstadoCursoHorarioEnum }=null;
    
    public listaAsignaturas: any[] = [];
    
    public asignaturasSeleccionadas: number[] = [];
    
    public numeroSemestre: number;
    
    public numeroDocente: number;    

    public filtroCursoPlanificacionDTO: FiltroCursoPlanificacionDTO = new FiltroCursoPlanificacionDTO();
    
    public pagina: number = this.PAGINA_CERO;
    
    public totalRecords:number;  
    
    public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    /*Generales*/
    public mapaAulas: Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoAula:string}> = new Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoAula:string}>();

    public cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO;
    
    public infoGeneralCursosPorProgramaDTO: InfoGeneralCursosPorProgramaDTO;

    public abreviaturaPrograma: string = "";
   
    public messages: Message[] = null;

    //Referencias componentes hijos
    @ViewChild('asociarEspacioFisico') asociarEspacioFisico: AsociarEspacioFisicoComponent;
    @ViewChild('asociarDocente') asociarDocente: AsociarDocenteComponent;

    constructor(
        private programaService: ProgramaService, 
        private asignaturaService:AsignaturaService,
        private planificacionManualService: PlanificacionManualService,
        private translateService: TranslateService,
        public periodoAcademicoSharedService:PeriodoAcademicoSharedService) {
    }

    public ngOnInit() {        
        this.consultarPeriodoAcademicoVigente();

        this.infoGeneralCursosPorProgramaDTO=null;
        this.filtroCursoPlanificacionDTO.registrosPorPagina = this.registrosPorPagina;        
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        
        this.programaService.consultarProgramasPermitidosPorUsuario().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                if(lstProgramaOutDTO.length === 0){
                    this.listaProgramas=[];
                    this.filtroCursoPlanificacionDTO.listaIdPrograma =null;
                    this.infoGeneralCursosPorProgramaDTO=null;
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

        Object.keys(EstadoCursoHorarioEnum).forEach(key => {
            const translatedLabel = this.translateService.instant('planificacion.manual.filtro.estado.horario.' + key);
            this.listaHorarios.push({ label: translatedLabel, codigo: key });
        });
    }

    private consultarInfoGeneralCursosPorPrograma(idPrograma:number):void{
        this.planificacionManualService.consultarInfoGeneralCursosPorPrograma(idPrograma).subscribe(
            (infoGeneralCursosPorProgramaDTO: InfoGeneralCursosPorProgramaDTO) => {
                this.infoGeneralCursosPorProgramaDTO = infoGeneralCursosPorProgramaDTO;
            },
            (error) => {
            console.error(error);
            }
        );
    }

    private consultarCursosPorFiltro(){
        this.planificacionManualService.consultarCursosPlanificacionPorFiltro(this.filtroCursoPlanificacionDTO).subscribe(
            (response: any) => {            
            this.consultarPeriodoAcademicoVigente();
            
            this.listaCursoPlanificacionOutDTO = response.content;
            this.totalRecords= response.totalElements;
            if(this.cursoPlanificacionOutDTOSeleccionado){
                this.cursoPlanificacionOutDTOSeleccionado = this.listaCursoPlanificacionOutDTO.find(curso => this.cursoPlanificacionOutDTOSeleccionado.idCurso === curso.idCurso);
            }

            if (this.asociarEspacioFisico) {
                this.asociarEspacioFisico.actualizarDTOEntradaEnModal(this.cursoPlanificacionOutDTOSeleccionado);
            }  

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
                        this.consultarInfoGeneralCursosPorPrograma(this.programasSeleccionados[0]);
                    },
                    (error) => {
                        console.error(error);
                    }
                    );
            }else{
                this.asignaturasSeleccionadas=[];
                this.listaAsignaturas=[];
                this.infoGeneralCursosPorProgramaDTO=null;
                this.filtroCursoPlanificacionDTO.listaIdAsignatura = null;
                this.consultarCursosPorFiltro();
            }
        }else{
            this.programasSeleccionados=[];
            this.infoGeneralCursosPorProgramaDTO=null;
            this.listaAsignaturas=[];
            this.asignaturasSeleccionadas=null;
            this.filtroCursoPlanificacionDTO.listaIdPrograma=null;
            this.filtroCursoPlanificacionDTO.listaIdAsignatura = null;
            this.consultarCursosPorFiltro();
        }
    }

    public onAsignaturasChange(){        
        if( this.asignaturasSeleccionadas){
            this.filtroCursoPlanificacionDTO.listaIdAsignatura = this.asignaturasSeleccionadas;
        }else{
            this.filtroCursoPlanificacionDTO.listaIdAsignatura =[];
        }
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        this.consultarCursosPorFiltro();
    }

    public onSemestreChange(){        
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

    public onHorarioChange(){   
        if(this.horarioSeleccionado){
            this.filtroCursoPlanificacionDTO.estadoCursoHorario = this.horarioSeleccionado.codigo;
        }else{
            this.filtroCursoPlanificacionDTO.estadoCursoHorario =null;
        }     
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
    
    /*Asociar aulas*/
    public asociarAulas(cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO, esPrincipal:boolean) {
        this.cursoPlanificacionOutDTOSeleccionado=cursoPlanificacionOutDTOSeleccionado;
        if (this.asociarEspacioFisico) {
            this.asociarEspacioFisico.abrirModal(cursoPlanificacionOutDTOSeleccionado, esPrincipal);
        }      
    }

    /*Asociar docentes*/
    public asociarDocentes(cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO) {
        this.cursoPlanificacionOutDTOSeleccionado=cursoPlanificacionOutDTOSeleccionado;
        if (this.asociarDocente) {
            this.asociarDocente.abrirModal(cursoPlanificacionOutDTOSeleccionado);
        }      
    }
    
    public actualizarInformacionCursos():void {
        if(this.programasSeleccionados && this.programasSeleccionados.length === 1){
            this.consultarInfoGeneralCursosPorPrograma(this.programasSeleccionados[0]);
        }
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
