import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DocenteOutDTO } from 'src/app/componentes/datos/gestionar-docente/model/out/docente.out.dto';
import { CrearActualizarDocentesCursoInDTO } from 'src/app/componentes/common/model/horario/in/crea.actualizar.docentes.curso.in.dto';
import { CrearActualizarDocentesCursoOutDTO } from 'src/app/componentes/common/model/horario/out/crea.actualizar.docentes.curso.out.dto';
import { PlanificacionManualService } from 'src/app/componentes/common/services/planificacion.manual.service';
import { DocenteService } from 'src/app/componentes/common/services/docente.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';
import { FiltroDocenteDTO } from 'src/app/componentes/datos/gestionar-docente/model/in/filtro.docente.dto';
import { CursoPlanificacionOutDTO } from 'src/app/componentes/datos/gestionar-curso/model/out/curso.planificacion.out.dto';
import { EstadoDocenteEnum } from 'src/app/componentes/common/enum/estado.docente.enum';


interface DocenteItem {
    check: boolean;
    docenteOutDTO: DocenteOutDTO;
}

@Component({
  selector: 'app-asociar-docente',
  templateUrl: './asociar.docente.component.html',
  styleUrls: ['./asociar.docente.component.css'],
  providers: [MessageService, DocenteService, PlanificacionManualService]
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
        private docenteService:DocenteService, 
        private planificacionManualService: PlanificacionManualService,
        private spinnerService: SpinnerService) {
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
        this.docenteService.consultarDocentePorIdCurso(this.cursoPlanificacionOutDTOSeleccionado.idCurso).subscribe(
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
        this.docenteService.consultarDocentes(this.filtroDocenteDTO).subscribe(
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
        this.listaDocentesAsignados=[];
        this.listaDocentesDisponibles=[];
        this.lstNombreDocentesAsignados=[];
        this.cursoPlanificacionOutDTOSeleccionado=null;
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

        this.spinnerService.show();
        this.planificacionManualService.crearActualizarDocentesCursoDTO(crearActualizarDocentesCursoInDTO).subscribe(
            (crearActualizarDocentesCursoOutDTO: CrearActualizarDocentesCursoOutDTO) => {   
                if(crearActualizarDocentesCursoOutDTO.esExitoso === true){
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Docentes asignados con éxito.' });
                    this.consultarDocentesAsignados();
                }else{
                    this.messageService.add({ severity: 'error', summary: 'Existe solapamiento', detail: crearActualizarDocentesCursoOutDTO.lstMensajesSolapamientos[0], life: 7000 });
                }
                this.spinnerService.hide();
                this.filtroDocenteDTO.nombre="";
                this.filtroDocenteDTO.codigo=null;
                this.filtroDocenteDTO.numeroIdentificacion=null;
                this.consultarDocentesDisponibles();
                this.modalClosedEmitter.emit();
            },
            (httpErrorResponse: HttpErrorResponse) => {
                this.spinnerService.hide();
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
