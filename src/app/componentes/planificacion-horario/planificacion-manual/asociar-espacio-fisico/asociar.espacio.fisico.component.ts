import { Component, ViewChild,EventEmitter, Output } from '@angular/core';
import {  HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FacultadServicio } from '../../../servicios/facultad.servicio';
import { EspacioFisicoServicio } from '../../../servicios/espacio.fisico.servicio';
import { HorarioServicio } from '../../../servicios/horario.servicio';
import { FranjaHorariaCursoDTO } from '../../../dto/curso/out/franja.horaria.curso.dto';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { CrearActualizarHorarioCursoOutDTO } from 'src/app/componentes/dto/horario/out/crea.actualizar.horario.curso.out.dto';
import { CrearActualizarHorarioCursoInDTO } from 'src/app/componentes/dto/horario/in/crea.actualizar.horario.curso.in.dto';
import { FranjaHorariaCursoAsociarInDTO } from 'src/app/componentes/dto/horario/in/franja.horaria.curso.asociar.in.dto';
import { FiltroFranjaHorariaDisponibleCursoDTO } from 'src/app/componentes/dto/horario/in/filtro.franja.horaria.disponible.curso.dto';
import { DiaSemanaEnum } from 'src/app/componentes/enum/dia.semana.enum';
import { FormatoPresentacionFranjaHorariaCursoDTO } from 'src/app/componentes/dto/espacio-fisico/out/formato.presentacion.franja.horaria.curso.dto';
import { CursoPlanificacionOutDTO } from 'src/app/componentes/dto/curso/out/curso.planificacion.out.dto';
import { PlanificacionManualServicio } from 'src/app/componentes/servicios/planificacion.manual.servicio';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { AgrupadorEspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/agrupador.espacio.fisico.out.dto';
import { UbicacionOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/ubicacion.out.dto';

interface FranjaHorariaItem {
    check: boolean;
    franjaHorariaCursoDTO: FranjaHorariaCursoDTO;
}
@Component({
    selector: 'app-asociar-espacio-fisico',
    templateUrl: './asociar.espacio.fisico.component.html',
    styleUrls: ['./asociar.espacio.fisico.component.css'],
    providers: [MessageService, EspacioFisicoServicio, PlanificacionManualServicio]
})
export class AsociarEspacioFisicoComponent {
    
    @ViewChild('asociarEspacioFisico') asociarEspacioFisico: AsociarEspacioFisicoComponent;

    @Output() modalClosedEmitter = new EventEmitter<void>();

    public mostrarErrorModal: boolean = false;

    public mensajeModal: String = "";
    
    public mostrarAsociarAulaModal: boolean = false;

    /*Atributos para presentar la información del curso*/
    
    public cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO;

    public mapaAulas: Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoEspacioFisico:string}> = new Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoEspacioFisico:string}>();

    public listaFranjaHorariaDisponibles: FranjaHorariaItem[] = [];

    public listaFranjaHorariaAsignadas: FranjaHorariaItem[] = [];  

    /*Campos que almacenan los valores seleccionados de días, hora Desde(Inicio) y cantidad horas*/
      
    public diasSeleccionados: DiaSemanaEnum[] = [];

    public horaInicioSeleccionado:{ label: string, formato: string }= {label:"",formato:""};
    
    public cantidadHorasSeleccionada: number;

    /*Lista de opciones de los selectores: Ubicación, Tipo, Grupo y Hora Desde(Inicio)*/

    public lstUbicacionOutDTO: UbicacionOutDTO[] = [];
    
    public lstTipoEspaciosFisicos: TipoEspacioFisicoOutDTO[] = [];  
    
    public lstAgrupadorEspacioFisicoOutDTO:AgrupadorEspacioFisicoOutDTO[]=[];
    
    public listaHorasInicio: {label: string; formato:string}[] = [];

    /*Filtro para realizar las busqueda de los espacios físicos dispnibles*/
    public filtroFranjaHorariaDisponibleCursoDTO:FiltroFranjaHorariaDisponibleCursoDTO=new FiltroFranjaHorariaDisponibleCursoDTO();
   

    private precargarUbicacionesSeleccionadas:boolean;

    constructor(private messageService: MessageService,
        private espacioFisicoServicio: EspacioFisicoServicio,
        private planificacionManualServicio: PlanificacionManualServicio) {
    }

    public ngOnInit() {   
    
        this.listaHorasInicio = [
            { label: '07:00', formato: "" },
            { label: '08:00', formato: "" },
            { label: '09:00', formato: "" },
            { label: '10:00', formato: "" },
            { label: '11:00', formato: "" },
            { label: '12:00', formato: "" },
            { label: '13:00', formato: "" },
            { label: '14:00', formato: "" },
            { label: '15:00', formato: "" },
            { label: '16:00', formato: "" },
            { label: '17:00', formato: "" },
            { label: '18:00', formato: "" },
            { label: '19:00', formato: "" },
            { label: '20:00', formato: "" },
            { label: '21:00', formato: "" },
            { label: '22:00', formato: "" }
        ];

        /**
         * Se consulta todos los espacios fisicos para almacenarlos en un mapa 
         * y poder acceder a su nombre rápidamente a través de su identificador único
         * idEspacioFisico. 
         */
        this.planificacionManualServicio.consultarFormatoPresentacionFranjaHorariaCurso().subscribe(
            (lstFormatoPresentacionFranjaHorariaCursoDTO: FormatoPresentacionFranjaHorariaCursoDTO[]) => {         
                lstFormatoPresentacionFranjaHorariaCursoDTO.forEach((formatoPresentacion: FormatoPresentacionFranjaHorariaCursoDTO) => {
                const objetoAulaDTO = {abreviaturaFacultad:null, nombreEdificio:null, nombreCompletoEspacioFisico:formatoPresentacion.nombreCompletoEspacioFisico}
                this.mapaAulas.set(formatoPresentacion.idEspacioFisico, objetoAulaDTO);
              });
            },
            (error) => {
              console.error(error);
            }
          );
    }

    /**
     * Método que consulta las franjas horarias disponibles que se mostrarán en el pickList izquierdo
     */
    private consultarFranjasDisponiblesCurso():void{
        this.filtroFranjaHorariaDisponibleCursoDTO.idAsignatura=this.cursoPlanificacionOutDTOSeleccionado.idAsignatura;
        this.planificacionManualServicio.consultarFranjasHorariasDisponiblesPorCurso(this.filtroFranjaHorariaDisponibleCursoDTO).subscribe(
            (lstFranjaHorariaCursoDTO: FranjaHorariaCursoDTO[]) => {   
                if(lstFranjaHorariaCursoDTO.length === 0){
                    this.listaFranjaHorariaDisponibles = [];
                }else{
                    this.listaFranjaHorariaDisponibles = lstFranjaHorariaCursoDTO.map((franjaHorariaCursoDTO: FranjaHorariaCursoDTO) => ({check:false, franjaHorariaCursoDTO:franjaHorariaCursoDTO}));
                } 
            },
            (error) => {
                console.error(error);
            }
          );
    }

    public abrirModal(cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO) {
        this.precargarUbicacionesSeleccionadas=true;
        this.cursoPlanificacionOutDTOSeleccionado = cursoPlanificacionOutDTOSeleccionado;
        this.mostrarAsociarAulaModal=true;
        this.consultarFranjasAsignadasCurso();
        this.consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso();
        this.consultarUbicaciones();
    }

    /*
    * Método que permite actualizar el DTO en el modal cuando se consulta nuevamente desde el padre, 
    * es necesario para actualizar la cantidad de horas que tiene el curso
    */
    public actualizarDTOEntradaEnModal(cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO) {
        this.cursoPlanificacionOutDTOSeleccionado = cursoPlanificacionOutDTOSeleccionado;
    }

    private consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso(){
        this.espacioFisicoServicio.consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso(this.cursoPlanificacionOutDTOSeleccionado.idCurso).subscribe(
            (lstAgrupadorEspacioFisicoOutDTO: AgrupadorEspacioFisicoOutDTO[]) => {
                this.lstAgrupadorEspacioFisicoOutDTO = lstAgrupadorEspacioFisicoOutDTO;
                  // Se preseleccionan espacios físicos, por defecto son todos
                  if((this.lstAgrupadorEspacioFisicoOutDTO!==null && this.lstAgrupadorEspacioFisicoOutDTO.length>0 )){
                    this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico=this.lstAgrupadorEspacioFisicoOutDTO.map(agrupadorEspacioFisicoOutDTO=> agrupadorEspacioFisicoOutDTO.idAgrupadorEspacioFisico);
                    this.inputsChange();
                  }
            },
            (error) => {
              console.error(error);
            }
        );  
    }

    private consultarUbicaciones():void{
        this.espacioFisicoServicio.consultarUbicaciones().subscribe(
            (lstUbicacionOutDTO: UbicacionOutDTO[]) => {
                this.lstUbicacionOutDTO = lstUbicacionOutDTO;
                // Se preseleccionan espacios físicos, por defecto son todos
                if(this.precargarUbicacionesSeleccionadas && (this.lstAgrupadorEspacioFisicoOutDTO===null || this.lstAgrupadorEspacioFisicoOutDTO.length===0 )){
                    this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=this.lstUbicacionOutDTO.map(ubicacionOutDTO=> ubicacionOutDTO.idUbicacion);
                    this.onUbicacionesChange();
                }
            },
            (error) => {
              console.error(error);
            }
        );  
    } 

    private consultarTiposEspaciosFisicosPorUbicaciones(){
        if(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion){
            this.espacioFisicoServicio.consultarTiposEspaciosFisicosPorUbicaciones(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion).subscribe(
                (lstTipoEspacioFisicoOutDTO: TipoEspacioFisicoOutDTO[]) => {
                    // Cada vez que se consulta los tipos de espacios físicos se limpia el filtro
                    this.filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico=[];

                    if(lstTipoEspacioFisicoOutDTO.length === 0){
                        this.lstTipoEspaciosFisicos=[];
                    }else{
                        this.lstTipoEspaciosFisicos = lstTipoEspacioFisicoOutDTO;
                    }
                },
                (error) => {
                  console.error(error);
                }
            );  
        }
    }
    
    public obtenerFormatoFranjaPresentacion(franjaHorariaCursoDTO: FranjaHorariaCursoDTO):string{
        return franjaHorariaCursoDTO.dia+' '+franjaHorariaCursoDTO.horaInicio+'-'+franjaHorariaCursoDTO.horaFin+' '+(this.mapaAulas.get(franjaHorariaCursoDTO.idEspacioFisico)).nombreCompletoEspacioFisico;
    }
    
    /**
     * Método que consulta las franjas horarias asignadas que se mostrarán en el pickList derecho
     */
    private consultarFranjasAsignadasCurso() {
        this.planificacionManualServicio.consultarFranjasHorariaCursoPorIdCurso(this.cursoPlanificacionOutDTOSeleccionado.idCurso).subscribe(
            (lstFranjaHorariaCursoDTO: FranjaHorariaCursoDTO[]) => {        
                if(lstFranjaHorariaCursoDTO.length === 0){
                    this.listaFranjaHorariaAsignadas = [];
                }else{
                    this.listaFranjaHorariaAsignadas = lstFranjaHorariaCursoDTO.map((franjaHorariaCursoDTO: FranjaHorariaCursoDTO) => ({check:true, franjaHorariaCursoDTO:franjaHorariaCursoDTO}));
                }
                this.modalClosedEmitter.emit(); 
            },
            (error) => {
              console.error(error);
            }
        );

        this.filtroFranjaHorariaDisponibleCursoDTO.idCurso=this.cursoPlanificacionOutDTOSeleccionado.idCurso;
        this.filtroFranjaHorariaDisponibleCursoDTO.duracion=2;
        this.cantidadHorasSeleccionada = 2;
        this.inputsChange();
    }

    public inputsChange(){
        if((this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion!==null && this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion.length !== 0) 
            || (this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico!==null && this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico.length !== 0)){
            this.consultarFranjasDisponiblesCurso();
        }else{
            // Se limpia la lista de franjas disponibles
            this.listaFranjaHorariaDisponibles=[];
        }
    }

    public onUbicacionesChange(){
        if(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion!==null && this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion.length !== 0){
            this.consultarTiposEspaciosFisicosPorUbicaciones();
            this.inputsChange();
        }else{
            // Se limpian los filtros
            this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=[];
            this.filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico=[];
            this.filtroFranjaHorariaDisponibleCursoDTO.salon="";

            //Se limpian lso selectores
            this.lstTipoEspaciosFisicos=[];

            // Se limpia la lista de franjas disponibles
            this.listaFranjaHorariaDisponibles=[];
        }
    }   

    public onGruposChange(){
        if(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico===null){
            // Se limpian los filtros
            this.filtroFranjaHorariaDisponibleCursoDTO.salon="";
        }
        this.inputsChange();
    }   

    public onDiasChange(){
        this.filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum = [...this.diasSeleccionados];
        this.inputsChange();
    }

    public onTiposEspacioFisicoChange(){
        this.inputsChange();
    }
    
    public onHoraInicioChange(){
        if(this.horaInicioSeleccionado===null){
            this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio=null;
            this.horaInicioSeleccionado = {label:"",formato:""};
        }else{
            this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio = this.horaInicioSeleccionado.label;
        }
        this.inputsChange();
    }

    public cantidadHorasChange(){
        if(this.cantidadHorasSeleccionada==null){
            this.messageService.add({ severity: 'error', summary: 'Consulta fallida', detail: 'Cantidad horas es un campo obligatorio.' });
            this.cantidadHorasSeleccionada=2;
        }
        this.filtroFranjaHorariaDisponibleCursoDTO.duracion = this.cantidadHorasSeleccionada;
        this.inputsChange();
    }

    public salir() {
        // Se limpia DTO filtroFranjaHorariaDisponibleCursoDTO
        this.filtroFranjaHorariaDisponibleCursoDTO.duracion=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.horaFin=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.salon=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum=[];
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico=[];
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico=[];
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=[];
        //Se limpian checks de días
        this.diasSeleccionados=[];

        this.precargarUbicacionesSeleccionadas=false;
        
        this.mostrarAsociarAulaModal=false;
        this.modalClosedEmitter.emit();   
    }

    public guardar() {        
        let crearActualizarHorarioCursoInDTO :CrearActualizarHorarioCursoInDTO = new CrearActualizarHorarioCursoInDTO();
        crearActualizarHorarioCursoInDTO.idCurso = this.cursoPlanificacionOutDTOSeleccionado.idCurso;
        crearActualizarHorarioCursoInDTO.idAsignatura = this.cursoPlanificacionOutDTOSeleccionado.idAsignatura;

        let listaFranjaHorariaCursoAsociarInDTO:FranjaHorariaCursoAsociarInDTO[] = [];

        this.listaFranjaHorariaAsignadas.forEach(FranjaHorariaItem => {
                let franjaHorariaCursoAsociarInDTO=new FranjaHorariaCursoAsociarInDTO();
                franjaHorariaCursoAsociarInDTO.idHorario = FranjaHorariaItem.franjaHorariaCursoDTO.idHorario;
                franjaHorariaCursoAsociarInDTO.idEspacioFisico = FranjaHorariaItem.franjaHorariaCursoDTO.idEspacioFisico;
                franjaHorariaCursoAsociarInDTO.dia=FranjaHorariaItem.franjaHorariaCursoDTO.dia;
                franjaHorariaCursoAsociarInDTO.horaInicio=FranjaHorariaItem.franjaHorariaCursoDTO.horaInicio;
                franjaHorariaCursoAsociarInDTO.horaFin=FranjaHorariaItem.franjaHorariaCursoDTO.horaFin;
                listaFranjaHorariaCursoAsociarInDTO.push(franjaHorariaCursoAsociarInDTO);
           });

        crearActualizarHorarioCursoInDTO.listaFranjaHorariaCursoAsociarInDTO = listaFranjaHorariaCursoAsociarInDTO;

        this.planificacionManualServicio.crearActualizarHorarioCursoDTO(crearActualizarHorarioCursoInDTO).subscribe(
        (crearActualizarHorarioCursoOutDTO: CrearActualizarHorarioCursoOutDTO) => {   
            if(crearActualizarHorarioCursoOutDTO.esExitoso === true){
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Franjas horarias actualizadas con éxito.' });
                this.consultarFranjasAsignadasCurso();
            }else{
                this.messageService.add({ severity: 'error', summary: 'Fallido', detail: crearActualizarHorarioCursoOutDTO.lstMensajesSolapamientos[0], life: 7000 });
            }            
        },
        (httpErrorResponse: HttpErrorResponse) => {
            console.error(httpErrorResponse);
            this.mostrarErrorModal = true;
            this.mensajeModal = httpErrorResponse.error.message;
        }
        );
    }
}