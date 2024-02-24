import { Component, ViewChild} from '@angular/core';
import { MessageService} from 'primeng/api';
import { CursoServicio } from '../../servicios/curso.servicio';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { BehaviorSubject } from 'rxjs';
import { EstadoCursoHorarioEnum } from '../../enum/estado.curso.horario.enum';
import { AsignaturaServicio } from '../../servicios/asignatura.servicio';
import { AulaServicio } from '../../servicios/aula.servicio';
import { HorarioServicio } from '../../servicios/horario.servicio';
import { CrearEditarVerCursoComponent } from './crear-editar-consultar-curso/crear-editar-ver-curso.component';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { CursoPlanificacionOutDTO } from '../../dto/curso/out/curso.planificacion.out.dto';
import { FiltroCursoPlanificacionDTO } from '../../dto/curso/in/filtro.curso.planificacion.dto';


@Component({
    selector: 'app-gestionar-curso',
    templateUrl: './gestionar-curso.component.html',
    styleUrls: ['./gestionar-curso.component.css'],
    providers: [MessageService, CursoServicio, FacultadServicio, ProgramaServicio, AsignaturaServicio, AulaServicio, HorarioServicio]
})
export class GestionarCursoComponent {

    private readonly PAGINA_CERO: number = 0;   

    private readonly REGISTROS_POR_PAGINA: number = 10;   

    public listaCursoPlanificacionOutDTO: CursoPlanificacionOutDTO[] = [];

    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    public facultadesSeleccionadas: any[] = [];

    public listaProgramas: any[] = [];

    public programasSeleccionados: any[] = [];
        
    public listaHorarios= [];
    
    public horarioSeleccionado: { label: string, codigo: EstadoCursoHorarioEnum }= null;
    
    public listaAsignaturas: any[] = [];
    
    public asignaturasSeleccionadas: any[] = [];
    
    public numeroSemestre: number;
    
    public numeroDocente: number;    

    public filtroCursoPlanificacionDTO: FiltroCursoPlanificacionDTO = new FiltroCursoPlanificacionDTO();
    
    public pagina: number = this.PAGINA_CERO;
    
    public totalRecords:number;  
    
    public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    /*Generales*/
    public mapaAulas: Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoAula:string}> = new Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoAula:string}>();

    public cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO;    
    
    /*TEMPORALES*/    
    deleteCursoDialog: boolean = false;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    //Referencias componentes hijos
    @ViewChild('crearEditarVerCurso') crearEditarVerCurso: CrearEditarVerCursoComponent;

    constructor(private messageService: MessageService, 
        private cursoServicio:CursoServicio, private facultadServicio:FacultadServicio,
        private programaServicio: ProgramaServicio, private asignaturaServicio:AsignaturaServicio) {
    }

    public ngOnInit() {   
        this.filtroCursoPlanificacionDTO.registrosPorPagina = this.registrosPorPagina;    

        this.facultadServicio.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
            },
            (error) => {
              console.error(error);
            }
        );  

        this.listaHorarios = [
            { label: 'Parcial', codigo: EstadoCursoHorarioEnum.PARCIALMENTE },
            { label: 'Sin horario', codigo: EstadoCursoHorarioEnum.SIN_ASIGNAR },
            { label: 'Completo', codigo: EstadoCursoHorarioEnum.ASIGNADO }
        ];
    }

    private consultarCursosPorFiltro(){
        this.cursoServicio.consultarCursosPlanificacionPorFiltro(this.filtroCursoPlanificacionDTO).subscribe(
            (response: any) => {
            this.listaCursoPlanificacionOutDTO = response.content;
            this.totalRecords= response.totalElements;
            },
            (error) => {
            console.error(error);
            }
        );
    }
  
    public onFacultadesChange(){
        this.filtroCursoPlanificacionDTO.pagina=this.PAGINA_CERO;
        if(this.facultadesSeleccionadas!==null && this.facultadesSeleccionadas.length !== 0){
            this.programaServicio.consultarProgramasPorIdFacultad(this.facultadesSeleccionadas.map(facultad => facultad.idFacultad)).subscribe(
                (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                    if(lstProgramaOutDTO.length === 0){
                        this.listaProgramas=[];
                        this.filtroCursoPlanificacionDTO.listaIdPrograma =null;
                    }else{
                        this.programasSeleccionados=null;
                        this.listaProgramas = lstProgramaOutDTO.map((programa: any) => ({ abreviatura: programa.abreviatura, nombre: programa.nombre, idPrograma:programa.idPrograma }));
                        this.filtroCursoPlanificacionDTO.listaIdPrograma = lstProgramaOutDTO.map(programa => programa.idPrograma);
                    }
                    this.filtroCursoPlanificacionDTO.listaIdFacultad = this.facultadesSeleccionadas.map(facultad => facultad.idFacultad);
                    this.consultarCursosPorFiltro();
                },
                (error) => {
                    console.error(error);
                }
                );   
        }else{
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
            this.filtroCursoPlanificacionDTO.listaIdPrograma = this.programasSeleccionados.map(programa => programa.idPrograma);

            if(this.programasSeleccionados.length === 1){
                this.asignaturaServicio.consultarAsignaturasPorIdPrograma(this.programasSeleccionados[0].idPrograma).subscribe(
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
                this.listaAsignaturas=[];
                this.consultarCursosPorFiltro();
            }
        }else{
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
       
    /*Crear, Editar y Ver curso*/
    public abrirModalCrearEditarVerCurso(cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO, tituloModal: string) {
        if (this.crearEditarVerCurso) {
            this.crearEditarVerCurso.abrirModal(cursoPlanificacionOutDTOSeleccionado, tituloModal);
        }      
    }
    
    /*Eliminar curso*/
    public eliminarCurso(cursoPlanificacionOutDTOSeleccionado: CursoPlanificacionOutDTO) {
        this.cursoPlanificacionOutDTOSeleccionado = { ...cursoPlanificacionOutDTOSeleccionado};
        this.deleteCursoDialog = true;
    }
   
    public confirmarEliminacion() {
        this.deleteCursoDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Curso eliminado', life: 3000 });
    }

    public actualizarInformacionCursos():void {
        this.consultarCursosPorFiltro();
    }
}
