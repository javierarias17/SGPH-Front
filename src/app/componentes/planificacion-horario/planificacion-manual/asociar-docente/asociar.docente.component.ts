import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { DocenteOutDTO } from 'src/app/componentes/dto/docente/out/docente.out.dto';
import { FiltroDocenteDTO } from 'src/app/componentes/dto/docente/in/filtro.docente.dto';
import { CrearActualizarDocentesCursoInDTO } from 'src/app/componentes/dto/horario/in/crea.actualizar.docentes.curso.in.dto';
import { CrearActualizarDocentesCursoOutDTO } from 'src/app/componentes/dto/horario/out/crea.actualizar.docentes.curso.out.dto';
import { DocenteServicio } from 'src/app/componentes/servicios/docente.servicio';
import { HorarioServicio } from 'src/app/componentes/servicios/horario.servicio';
import { EstadoDocenteEnum } from 'src/app/componentes/enum/estado.docente.enum';
import { CursoPlanificacionOutDTO } from 'src/app/componentes/dto/curso/out/curso.planificacion.out.dto';
import { PlanificacionManualServicio } from 'src/app/componentes/servicios/planificacion.manual.servicio';


interface DocenteItem {
    check: boolean;
    docenteOutDTO: DocenteOutDTO;
}

@Component({
  selector: 'app-asociar-docente',
  templateUrl: './asociar.docente.component.html',
  styleUrls: ['./asociar.docente.component.css'],
  providers: [MessageService, DocenteServicio, HorarioServicio, PlanificacionManualServicio]
})
export class AsociarDocenteComponent {

    @ViewChild('asociarDocente') asociarDocente: AsociarDocenteComponent;

    @Output() modalClosedEmitter = new EventEmitter<void>();
    
    public mostrarErrorModal: boolean = false;

    public mensajeModal: String = "";

    public mostrarAsociarDocenteModal: boolean = false;

    public lstNombreDocentesAsignados: string[] = [];

    /*Atributos para presentar la información del docente*/  
    public cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO;

    public listaDocentesDisponibles: DocenteItem[] = [];

    public listaDocentesAsignados: DocenteItem[] = [];  

    /*Filtro*/
    public filtroDocenteDTO:FiltroDocenteDTO=new FiltroDocenteDTO();
   
    constructor(private messageService: MessageService, 
        private docenteServicio:DocenteServicio, 
        private horarioServicio:HorarioServicio,
        private planificacionManualServicio: PlanificacionManualServicio) {
    }

    public ngOnInit() { 
        this.filtroDocenteDTO.estado=EstadoDocenteEnum.ACTIVO;
    }

    public abrirModal(cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO) {
        this.cursoPlanificacionOutDTOSeleccionado = cursoPlanificacionOutDTOSeleccionado;
        this.mostrarAsociarDocenteModal=true;
        this.consultarDocentesAsignados();
        this.consultarDocentesDisponibles();
    }

    private consultarDocentesAsignados() {
        this.docenteServicio.consultarDocentePorIdCurso(this.cursoPlanificacionOutDTOSeleccionado.idCurso).subscribe(
            (lstDocenteOutDTO: DocenteOutDTO[]) => {        
                if(lstDocenteOutDTO.length === 0){
                    this.listaDocentesAsignados = [];
                }else{
                    this.listaDocentesAsignados = lstDocenteOutDTO.map((docenteOutDTO: DocenteOutDTO) => ({check:true, docenteOutDTO:docenteOutDTO}));
                    this.restarDocentesAsignadosADocentesDisponibles();
                }
                this.actualizarEncabezadoDocentesPresentacion();
            },
            (error) => {
              console.error(error);
            }
        );
    }

    private consultarDocentesDisponibles() {
        this.docenteServicio.consultarDocentes(this.filtroDocenteDTO).subscribe(
            (response: any) => {  
                let lstDocenteOutDTO = response.content;                        
                if(lstDocenteOutDTO.length === 0){
                    this.listaDocentesDisponibles = [];
                }else{
                    this.listaDocentesDisponibles = lstDocenteOutDTO.map((docenteOutDTO: DocenteOutDTO) => ({check:false, docenteOutDTO:docenteOutDTO}));
                }
                this.restarDocentesAsignadosADocentesDisponibles();
            },
            (error) => {
                console.error(error);
            }
          );
    }

    private restarDocentesAsignadosADocentesDisponibles():void{
        if(this.listaDocentesAsignados.length > 0 && this.listaDocentesDisponibles.length > 0 ){
            const lstIdPersonaAsignadas = this.listaDocentesAsignados.map(docenteItem => docenteItem.docenteOutDTO.idPersona);
            this.listaDocentesDisponibles = this.listaDocentesDisponibles.filter(docenteItem => !lstIdPersonaAsignadas.includes(docenteItem.docenteOutDTO.idPersona));
        }
    }

    public obtenerFormatoDocentePresentacion(docenteDTO: DocenteOutDTO):string{
        return (docenteDTO.primerNombre? docenteDTO.primerNombre+" ": "")
                +(docenteDTO.segundoNombre? docenteDTO.segundoNombre+" ": "")
                +(docenteDTO.primerApellido? docenteDTO.primerApellido+" ": "")
                +(docenteDTO.segundoApellido? docenteDTO.segundoApellido: "")
                +"-"
                +(docenteDTO.codigoTipoIdentificacion? docenteDTO.codigoTipoIdentificacion:"")
                +(docenteDTO.numeroIdentificacion? docenteDTO.numeroIdentificacion:"");
    }

    private actualizarEncabezadoDocentesPresentacion():void{
        let lstNombreDocentesAsignados: string[]=[];
        this.listaDocentesAsignados.forEach(docenteItem => {
            if(docenteItem.check===true){
                lstNombreDocentesAsignados.push(
                         (docenteItem.docenteOutDTO.primerNombre? docenteItem.docenteOutDTO.primerNombre+" ": "")
                        +(docenteItem.docenteOutDTO.segundoNombre? docenteItem.docenteOutDTO.segundoNombre+" ": "")
                        +(docenteItem.docenteOutDTO.primerApellido? docenteItem.docenteOutDTO.primerApellido+" ": "")
                        +(docenteItem.docenteOutDTO.segundoApellido? docenteItem.docenteOutDTO.segundoApellido: ""));
            }            
        });
        this.lstNombreDocentesAsignados = lstNombreDocentesAsignados;
    }

    public salir():void{
        this.mostrarAsociarDocenteModal=false;
        this.modalClosedEmitter.emit();  
    }
    public guardar():void{
        let crearActualizarDocentesCursoInDTO :CrearActualizarDocentesCursoInDTO = new CrearActualizarDocentesCursoInDTO();
        crearActualizarDocentesCursoInDTO.idCurso = this.cursoPlanificacionOutDTOSeleccionado.idCurso;
        if(this.listaDocentesAsignados.length > 0){
            crearActualizarDocentesCursoInDTO.listaIdPersona = this.listaDocentesAsignados.map(docenteItem => docenteItem.docenteOutDTO.idPersona);
        }else{
            crearActualizarDocentesCursoInDTO.listaIdPersona = [];
        }

        this.planificacionManualServicio.crearActualizarDocentesCursoDTO(crearActualizarDocentesCursoInDTO).subscribe(
            (crearActualizarDocentesCursoOutDTO: CrearActualizarDocentesCursoOutDTO) => {   
                if(crearActualizarDocentesCursoOutDTO.esExitoso === true){
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Docentes asignados con éxito.' });
                    this.consultarDocentesAsignados();
                }else{
                    this.messageService.add({ severity: 'error', summary: 'Existe solapamiento', detail: crearActualizarDocentesCursoOutDTO.lstMensajesSolapamientos[0], life: 7000 });
                }
                this.filtroDocenteDTO.nombre="";
                this.filtroDocenteDTO.codigo=null;
                this.filtroDocenteDTO.numeroIdentificacion=null;
                this.consultarDocentesDisponibles();
                this.modalClosedEmitter.emit();
            },
            (httpErrorResponse: HttpErrorResponse) => {
                console.error(httpErrorResponse);
                this.mostrarErrorModal = true;
                this.mensajeModal = httpErrorResponse.error.message;
            }
        );
    }

    public inputsChange(){
        if( this.filtroDocenteDTO.codigo===""){
            this.filtroDocenteDTO.codigo = null;
        }
        if( this.filtroDocenteDTO.numeroIdentificacion===""){
            this.filtroDocenteDTO.numeroIdentificacion = null;
        }
        if( this.filtroDocenteDTO.nombre===null){
            this.filtroDocenteDTO.nombre = "";
        }
        this.consultarDocentesDisponibles();
    }
}
