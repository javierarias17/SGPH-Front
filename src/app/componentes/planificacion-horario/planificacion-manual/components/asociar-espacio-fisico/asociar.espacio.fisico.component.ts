import { Component, ViewChild,EventEmitter, Output } from '@angular/core';
import {  HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FranjaHorariaCursoDTO } from '../../../../datos/gestionar-curso/model/out/franja.horaria.curso.dto';
import { CrearActualizarHorarioCursoOutDTO } from 'src/app/componentes/common/model/horario/out/crea.actualizar.horario.curso.out.dto';
import { CrearActualizarHorarioCursoInDTO } from 'src/app/componentes/common/model/horario/in/crea.actualizar.horario.curso.in.dto';
import { FranjaHorariaCursoAsociarInDTO } from 'src/app/componentes/common/model/horario/in/franja.horaria.curso.asociar.in.dto';
import { FiltroFranjaHorariaDisponibleCursoDTO } from 'src/app/componentes/common/model/horario/in/filtro.franja.horaria.disponible.curso.dto';
import { FormatoPresentacionFranjaHorariaCursoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/formato.presentacion.franja.horaria.curso.dto';
import { PlanificacionManualService } from 'src/app/componentes/common/services/planificacion.manual.service';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/tipo.espacio.fisico.out.dto';
import { AgrupadorEspacioFisicoOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/agrupador.espacio.fisico.out.dto';
import { UbicacionOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { EspacioFisicoService } from 'src/app/componentes/common/services/espacio.fisico.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';
import { CursoPlanificacionOutDTO } from 'src/app/componentes/datos/gestionar-curso/model/out/curso.planificacion.out.dto';
import { DiaSemanaEnum } from 'src/app/componentes/common/enum/dia.semana.enum';

interface FranjaHorariaItem {
    check: boolean;
    checkSecundario: boolean;
    franjaHorariaCursoDTO: FranjaHorariaCursoDTO;
}
@Component({
    selector: 'app-asociar-espacio-fisico',
    templateUrl: './asociar.espacio.fisico.component.html',
    styleUrls: ['./asociar.espacio.fisico.component.css'],
    providers: [MessageService, EspacioFisicoService, PlanificacionManualService]
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

    /*Filtro para realizar las busqueda de los espacios físicos disponibles*/
    public filtroFranjaHorariaDisponibleCursoDTO:FiltroFranjaHorariaDisponibleCursoDTO=new FiltroFranjaHorariaDisponibleCursoDTO();
   
    private precargarUbicacionesSeleccionadas:boolean;

    public mensajeResultadoBusqueda: string = "";

    private esPrincipal: boolean = true;

    public nombreHeader:string="";

    public isLoading: boolean = false;

    public deshabilitarBotonBuscar:boolean = false;

    constructor(private messageService: MessageService,
        private espacioFisicoService: EspacioFisicoService,
        private planificacionManualService: PlanificacionManualService,
        private spinnerService: SpinnerService) {
    }

    /*TODO. Avance para espacios fisicos secundarios*/
    mostrarDialogo: boolean = false;
    itemSeleccionado: any;

    abrirDialogo(event: MouseEvent, item: any) {
        event.preventDefault(); // Evitar el menú contextual del navegador
        if (this.listaFranjaHorariaAsignadas.includes(item)) {
            this.itemSeleccionado = item;
            this.mostrarDialogo = true;
        }
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
        this.planificacionManualService.consultarFormatoPresentacionFranjaHorariaCurso().subscribe(
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
        this.mensajeResultadoBusqueda= "Buscando...";
        this.listaFranjaHorariaDisponibles = [];
        this.isLoading=true;
        this.planificacionManualService.consultarFranjasHorariasDisponiblesPorCurso(this.filtroFranjaHorariaDisponibleCursoDTO).subscribe(
            (lstFranjaHorariaCursoDTO: FranjaHorariaCursoDTO[]) => {   
                if(lstFranjaHorariaCursoDTO.length === 0){
                    this.listaFranjaHorariaDisponibles = [];
                    this.mensajeResultadoBusqueda= "No hay franjas horarias disponibles.";
                }else{
                    this.listaFranjaHorariaDisponibles = lstFranjaHorariaCursoDTO.map((franjaHorariaCursoDTO: FranjaHorariaCursoDTO) => ({check:false, franjaHorariaCursoDTO:franjaHorariaCursoDTO, checkSecundario:false}));
                    this.mensajeResultadoBusqueda= "Franjas encontradas: "+this.listaFranjaHorariaDisponibles.length;
                } 
                this.isLoading=false;
            },
            (error) => {
                this.mensajeResultadoBusqueda= "Se produjo un error consultando las franjas";
                console.error(error);
                this.isLoading=false;
            }
          );
    }

    public abrirModal(cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO,  esPrincipal:boolean) {
        this.esPrincipal=esPrincipal;
        this.filtroFranjaHorariaDisponibleCursoDTO.esPrincipal=esPrincipal;
        this.nombreHeader = esPrincipal===true?'Gestionar horario principal':'Gestionar horario secundario';

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
        this.espacioFisicoService.consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso(this.cursoPlanificacionOutDTOSeleccionado.idCurso).subscribe(
            (lstAgrupadorEspacioFisicoOutDTO: AgrupadorEspacioFisicoOutDTO[]) => {
                this.lstAgrupadorEspacioFisicoOutDTO = lstAgrupadorEspacioFisicoOutDTO;
                  // Se preseleccionan grupos de espacios físicos, todos los que estén asociados a la asignatura
                  if((this.lstAgrupadorEspacioFisicoOutDTO!==null && this.lstAgrupadorEspacioFisicoOutDTO.length>0 )){
                    this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico=this.lstAgrupadorEspacioFisicoOutDTO.map(agrupadorEspacioFisicoOutDTO=> agrupadorEspacioFisicoOutDTO.idAgrupadorEspacioFisico);
                    this.buscar();
                  }
            },
            (error) => {
              console.error(error);
            }
        );  
    }

    private consultarUbicaciones():void{
        this.espacioFisicoService.consultarUbicaciones().subscribe(
            (lstUbicacionOutDTO: UbicacionOutDTO[]) => {
                this.lstUbicacionOutDTO = lstUbicacionOutDTO;
                // Se preseleccionan espacios físicos, por defecto son todos
                if(this.precargarUbicacionesSeleccionadas && (this.lstAgrupadorEspacioFisicoOutDTO===null || this.lstAgrupadorEspacioFisicoOutDTO.length===0 )){
                    //this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=this.lstUbicacionOutDTO.map(ubicacionOutDTO=> ubicacionOutDTO.idUbicacion);
                    this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=[11,10];
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
            this.espacioFisicoService.consultarTiposEspaciosFisicosPorUbicaciones(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion).subscribe(
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
        this.planificacionManualService.consultarFranjasHorariaCursoPorIdCurso(this.cursoPlanificacionOutDTOSeleccionado.idCurso,  this.esPrincipal).subscribe(
            (lstFranjaHorariaCursoDTO: FranjaHorariaCursoDTO[]) => {        
                if(lstFranjaHorariaCursoDTO.length === 0){
                    this.listaFranjaHorariaAsignadas = [];
                }else{
                    this.listaFranjaHorariaAsignadas = lstFranjaHorariaCursoDTO.map((franjaHorariaCursoDTO: FranjaHorariaCursoDTO) => ({check:true, franjaHorariaCursoDTO:franjaHorariaCursoDTO, checkSecundario:false}));
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
        this.buscar();
    }

    public buscar(){
        if((this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion!==null && this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion.length !== 0) 
            || (this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico!==null && this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico.length !== 0)){
            this.consultarFranjasDisponiblesCurso();
        }else{
            // Se limpia la lista de franjas disponibles
            this.limpiarListaFranjasHorariasDisponibles();
        }
    }

    public onUbicacionesChange(){
        this.limpiarListaFranjasHorariasDisponibles();
        if(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion!==null && this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion.length !== 0){
            this.deshabilitarBotonBuscar=false;
            this.consultarTiposEspaciosFisicosPorUbicaciones();
        }else{
            this.deshabilitarBotonBuscar=true;

            // Se limpian los filtros
            this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=[];
            this.filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico=[];
            this.filtroFranjaHorariaDisponibleCursoDTO.salon="";

            //Se limpian lso selectores
            this.lstTipoEspaciosFisicos=[];

            this.limpiarListaFranjasHorariasDisponibles();
        }
    }   

    public onInputsChange():void{
        this.limpiarListaFranjasHorariasDisponibles();
    }

    public onGruposChange(){
        this.limpiarListaFranjasHorariasDisponibles();
        if(this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico===null){
            // Se limpian los filtros
            this.filtroFranjaHorariaDisponibleCursoDTO.salon="";
            this.deshabilitarBotonBuscar=true;
        }else{
            this.deshabilitarBotonBuscar=false;
        }
    }   

    public onDiasChange(){
        this.limpiarListaFranjasHorariasDisponibles();
        this.filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum = [...this.diasSeleccionados];
    }

    public onTiposEspacioFisicoChange(){
        this.limpiarListaFranjasHorariasDisponibles();
    }
    
    public onHoraInicioChange(){
        this.limpiarListaFranjasHorariasDisponibles();
        if(this.horaInicioSeleccionado===null){
            this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio=null;
            this.horaInicioSeleccionado = {label:"",formato:""};
        }else{
            this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio = this.horaInicioSeleccionado.label;
        }
    }

    public cantidadHorasChange(){
        this.limpiarListaFranjasHorariasDisponibles();
        this.deshabilitarBotonBuscar=true;
        if(this.cantidadHorasSeleccionada===null){
            this.messageService.add({ severity: 'error', summary: 'Consulta fallida', detail: 'Cantidad horas es un campo obligatorio.' });
            return ;
        }else if(this.cantidadHorasSeleccionada < 1){
            this.messageService.add({ severity: 'error', summary: 'Consulta fallida', detail: 'Cantidad horas debe ser mayor a 0' });
            return ;
        }
        this.deshabilitarBotonBuscar=false;
        this.filtroFranjaHorariaDisponibleCursoDTO.duracion = this.cantidadHorasSeleccionada;
    }

    private limpiarListaFranjasHorariasDisponibles():void{
        // Se limpia la lista de franjas disponibles
        this.listaFranjaHorariaDisponibles=[];
        this.mensajeResultadoBusqueda= "Aún no ha realizado la busqueda";
    }

    public salir() {
        // Se limpia DTO filtroFranjaHorariaDisponibleCursoDTO
        this.filtroFranjaHorariaDisponibleCursoDTO.duracion=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.horaFin=null;
        this.filtroFranjaHorariaDisponibleCursoDTO.salon=null;
        //this.filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum=[];
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico=[];
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico=[];
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion=[];
        //Se limpian checks de días
        //this.diasSeleccionados=[];
        this.horaInicioSeleccionado=null;

        // Se limpia la lista de franjas disponibles
        this.listaFranjaHorariaDisponibles=[];

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

        this.spinnerService.show();
        if(this.esPrincipal===true){
            this.planificacionManualService.crearActualizarHorarioCursoDTO(crearActualizarHorarioCursoInDTO).subscribe(
            (crearActualizarHorarioCursoOutDTO: CrearActualizarHorarioCursoOutDTO) => {   
                if(crearActualizarHorarioCursoOutDTO.esExitoso === true){
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Franjas horarias actualizadas con éxito.' });
                    this.consultarFranjasAsignadasCurso();
                }
                this.spinnerService.hide();            
            },
            (httpErrorResponse: HttpErrorResponse) => {
                //esExitoso igual a false se maneja como 400BadRequest
                this.spinnerService.hide();
                if (httpErrorResponse.status === 400) {
                    const crearActualizarHorarioCursoOutDTO = httpErrorResponse.error as CrearActualizarHorarioCursoOutDTO;
                    this.messageService.add({ severity: 'error', summary: 'Fallido', detail: crearActualizarHorarioCursoOutDTO.lstMensajesSolapamientos[0], life: 7000 });
                }else{
                    console.error(httpErrorResponse);
                    this.mostrarErrorModal = true;
                    this.mensajeModal = httpErrorResponse.error.message;
                }
            }
            );
        }else{
            this.planificacionManualService.crearActualizarHorarioSecundarioCurso(crearActualizarHorarioCursoInDTO).subscribe(
                (crearActualizarHorarioCursoOutDTO: CrearActualizarHorarioCursoOutDTO) => {   
                    if(crearActualizarHorarioCursoOutDTO.esExitoso === true){
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Franjas horarias actualizadas con éxito.' });
                        this.consultarFranjasAsignadasCurso();
                    }  
                    this.spinnerService.hide();         
                },
                (httpErrorResponse: HttpErrorResponse) => {
                    //esExitoso igual a false se maneja como 400BadRequest
                    this.spinnerService.hide();
                    if (httpErrorResponse.status === 400) {
                        const crearActualizarHorarioCursoOutDTO = httpErrorResponse.error as CrearActualizarHorarioCursoOutDTO;
                        this.messageService.add({ severity: 'error', summary: 'Fallido', detail: crearActualizarHorarioCursoOutDTO.lstMensajesSolapamientos[0], life: 7000 });
                    }else{
                        console.error(httpErrorResponse);
                        this.mostrarErrorModal = true;
                        this.mensajeModal = httpErrorResponse.error.message;
                    }
                }
                );
        }
    }

    /**
     * Método en encargado de establecer los atributos check en false de la 
     * lista izquierda del picklist cuando un item de la derecha se pasa hacia la izquierda.
     */
    public onMoveToSource(event: any) {
        event.items.forEach((item: any) => {
            item.check = false;
        });
    }
}