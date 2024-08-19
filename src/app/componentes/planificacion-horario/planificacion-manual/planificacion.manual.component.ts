import { Component, ViewChild } from '@angular/core';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { EstadoCursoHorarioEnum } from '../../enum/estado.curso.horario.enum';
import { Message, MessageService } from 'primeng/api';
import { ProgramaService } from '../../servicios/programa.service';
import { AsignaturaService } from '../../servicios/asignatura.service';
import { AsociarDocenteComponent } from './asociar-docente/asociar.docente.component';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { InfoGeneralCursosPorProgramaDTO } from '../../dto/curso/out/info.general.cursos.por.programa.dto';
import { CursoPlanificacionOutDTO } from '../../dto/curso/out/curso.planificacion.out.dto';
import { FiltroCursoPlanificacionDTO } from '../../dto/curso/in/filtro.curso.planificacion.dto';
import { PlanificacionManualService } from '../../servicios/planificacion.manual.service';
import { TranslateService } from '@ngx-translate/core';
import { AsociarEspacioFisicoComponent } from './asociar-espacio-fisico/asociar.espacio.fisico.component';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { FacultadService } from '../../servicios/facultad.service';
import { LenguajeService } from '../../servicios/lenguaje.service';

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

    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    public facultadesSeleccionadas: number[] = [];

    public idFacultadSeleccionada: number;

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

    constructor(private facultadService:FacultadService,
        private programaService: ProgramaService, 
        private asignaturaService:AsignaturaService,
        private planificacionManualService: PlanificacionManualService,
        private translateService: TranslateService,
        public periodoAcademicoService:PeriodoAcademicoService) {
    }

    public ngOnInit() {        
        this.consultarPeriodoAcademicoVigente();

        this.infoGeneralCursosPorProgramaDTO=null;
        this.filtroCursoPlanificacionDTO.registrosPorPagina = this.registrosPorPagina;        
        
        this.facultadService.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
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

    public onFacultadesChange(){
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        if(this.facultadesSeleccionadas!==null && this.facultadesSeleccionadas.length !== 0){
            this.programaService.consultarProgramasPorIdFacultad(this.facultadesSeleccionadas).subscribe(
                (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                    if(lstProgramaOutDTO.length === 0){
                        this.listaProgramas=[];
                        this.filtroCursoPlanificacionDTO.listaIdPrograma =null;
                        this.infoGeneralCursosPorProgramaDTO=null;
                    }else{
                        this.programasSeleccionados=null;
                        this.listaProgramas = lstProgramaOutDTO.map((programa: any) => ({ abreviatura: programa.abreviatura, nombre: programa.nombre, idPrograma:programa.idPrograma }));
                        this.filtroCursoPlanificacionDTO.listaIdPrograma = lstProgramaOutDTO.map(programa => programa.idPrograma);
                    }
                    this.filtroCursoPlanificacionDTO.listaIdFacultad = this.facultadesSeleccionadas;
                    this.consultarCursosPorFiltro();
                },
                (error) => {
                    console.error(error);
                }
                );   
        }else{
            this.infoGeneralCursosPorProgramaDTO=null;
            this.listaCursoPlanificacionOutDTO = [];
            this.totalRecords=undefined;
            //Se limpian variables de las listas desplegables
            this.listaProgramas=[];
            this.listaAsignaturas=[];
            //Se limpian valores del filtro
            this.filtroCursoPlanificacionDTO.listaIdFacultad=null;
            this.filtroCursoPlanificacionDTO.listaIdPrograma=null;
            this.filtroCursoPlanificacionDTO.listaIdAsignatura=null;
            this.filtroCursoPlanificacionDTO.cantidadDocentes=null;
            this.filtroCursoPlanificacionDTO.estadoCursoHorario=null;
            this.filtroCursoPlanificacionDTO.semestre=null;
            //Se limpian variables de los inputs
            this.facultadesSeleccionadas =[];
            this.programasSeleccionados=null;
            this.asignaturasSeleccionadas=null;
            this.numeroSemestre=null;
            this.horarioSeleccionado=null;
            this.numeroDocente=null;
        }
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
                this.consultarCursosPorFiltro();
            }
        }else{
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
        this.periodoAcademicoService.consultarPeriodoAcademicoVigente().subscribe(
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
