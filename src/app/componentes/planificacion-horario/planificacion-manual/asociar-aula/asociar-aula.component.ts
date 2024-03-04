import { Component, ViewChild,EventEmitter, Output } from '@angular/core';
import {  HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FacultadServicio } from '../../../servicios/facultad.servicio';
import { AulaServicio } from '../../../servicios/aula.servicio';
import { HorarioServicio } from '../../../servicios/horario.servicio';
import { FranjaHorariaCursoDTO } from '../../../dto/curso/out/franja.horaria.curso.dto';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { CrearActualizarHorarioCursoOutDTO } from 'src/app/componentes/dto/horario/out/crea.actualizar.horario.curso.out.dto';
import { CrearActualizarHorarioCursoInDTO } from 'src/app/componentes/dto/horario/in/crea.actualizar.horario.curso.in.dto';
import { FranjaHorariaCursoAsociarInDTO } from 'src/app/componentes/dto/horario/in/franja.horaria.curso.asociar.in.dto';
import { FiltroFranjaHorariaDisponibleCursoDTO } from 'src/app/componentes/dto/horario/in/filtro.franja.horaria.disponible.curso.dto';
import { DiaSemanaEnum } from 'src/app/componentes/enum/dia.semana.enum';
import { TipoAulaOutDTO } from 'src/app/componentes/dto/aula/out/tipo.aula.out.dto';
import { FormatoPresentacionFranjaHorariaCursoDTO } from 'src/app/componentes/dto/aula/out/formato.presentacion.franja.horaria.curso.dto';
import { CursoPlanificacionOutDTO } from 'src/app/componentes/dto/curso/out/curso.planificacion.out.dto';
import { PlanificacionManualServicio } from 'src/app/componentes/servicios/planificacion.manual.servicio';

interface FranjaHorariaItem {
    check: boolean;
    franjaHorariaCursoDTO: FranjaHorariaCursoDTO;
}

@Component({
    selector: 'app-asociar-aula',
    templateUrl: './asociar-aula.component.html',
    styleUrls: ['./asociar-aula.component.css'],
    providers: [MessageService, FacultadServicio, AulaServicio, HorarioServicio, PlanificacionManualServicio]
})
export class AsociarAulaComponent {
    
    @ViewChild('asociarAula') asociarAula: AsociarAulaComponent;

    @Output() modalClosedEmitter = new EventEmitter<void>();

    public mostrarErrorModal: boolean = false;

    public mensajeModal: String = "";
    
    public mostrarAsociarAulaModal: boolean = false;

    /*Atributos para presentar la información del curso*/
    
    public cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO;

    public mapaAulas: Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoAula:string}> = new Map<number, {abreviaturaFacultad:string, nombreEdificio:string, nombreCompletoAula:string}>();

    public listaFranjaHorariaDisponibles: FranjaHorariaItem[] = [];

    public listaFranjaHorariaAsignadas: FranjaHorariaItem[] = [];  

    /*Atributos para almacenar las opciones seleccionadas*/

    public facultadesSeleccionadas: number[] = [];

    public tipoAulasSeleccionadas: number[] = [];

    public numeroAulaSeleccionada: string;
    
    public recursosSeleccionados: any[] = [];
    
    public diasSeleccionados: DiaSemanaEnum[] = [];

    public horaInicioSeleccionado:{ label: string, formato: string }= {label:"",formato:""};

    public horaFinSeleccionado:{ label: string, formato: string }= {label:"",formato:""};
    
    public cantidadHorasSeleccionada: number;

    /*Atributos para mostrar las opciones disponibles*/

    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    public listaTipoAulas: { nombre: string; idTipoAula: number }[] = [];   

    public listaRecursos: any[] = [];

    public listaHorasInicio: {label: string; formato:string}[] = [];

    /*Filtro*/
    public filtroFranjaHorariaDisponibleCursoDTO:FiltroFranjaHorariaDisponibleCursoDTO=new FiltroFranjaHorariaDisponibleCursoDTO();
   
    constructor(private messageService: MessageService, private facultadServicio:FacultadServicio,
        private aulaServicio: AulaServicio, private horarioServicio: HorarioServicio, 
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

        this.planificacionManualServicio.consultarFormatoPresentacionFranjaHorariaCurso().subscribe(
            (lstFormatoPresentacionFranjaHorariaCursoDTO: FormatoPresentacionFranjaHorariaCursoDTO[]) => {         
                lstFormatoPresentacionFranjaHorariaCursoDTO.forEach((formatoPresentacion: FormatoPresentacionFranjaHorariaCursoDTO) => {
                const objetoAulaDTO = {abreviaturaFacultad:null, nombreEdificio:null, nombreCompletoAula:formatoPresentacion.nombreCompletoAula}
                this.mapaAulas.set(formatoPresentacion.idAula, objetoAulaDTO);
              });
            },
            (error) => {
              console.error(error);
            }
          );

    }

    private consultarFranjasHorariasDisponiblesPorCurso():void{
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
        this.cursoPlanificacionOutDTOSeleccionado = cursoPlanificacionOutDTOSeleccionado;
        this.mostrarAsociarAulaModal=true;
        this.consultarAulasAsignadasYDisponibles();
        this.consultarFacultades();
    }

    private consultarFacultades():void{
        this.facultadServicio.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
            },
            (error) => {
              console.error(error);
            }
        );  
    }   

    public obtenerFormatoFranjaPresentacion(franjaHorariaCursoDTO: FranjaHorariaCursoDTO):string{
        return franjaHorariaCursoDTO.dia+' '+franjaHorariaCursoDTO.horaInicio+'-'+franjaHorariaCursoDTO.horaFin+' '+(this.mapaAulas.get(franjaHorariaCursoDTO.idAula)).nombreCompletoAula;
    }
        
    private consultarAulasAsignadasYDisponibles() {
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
        this.consultarFranjasHorariasDisponiblesPorCurso();
    }

    public onFacultadesChange(){
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdFacultad = this.facultadesSeleccionadas; 
        this.consultarFranjasHorariasDisponiblesPorCurso();

        if(this.facultadesSeleccionadas===null || this.facultadesSeleccionadas.length === 0){
            this.listaTipoAulas=[];
            this.tipoAulasSeleccionadas=[];
            this.facultadesSeleccionadas=[];
        }else{
            //Se consulta y actualiza la lista de tipo de aulas
            this.aulaServicio.consultarTipoAulasPorIdFacultad(this.facultadesSeleccionadas).subscribe(
                (lstTipoAulaOutDTO: TipoAulaOutDTO[]) => {
                    if(lstTipoAulaOutDTO.length === 0){
                        this.listaTipoAulas=[];
                    }else{
                        this.listaTipoAulas = lstTipoAulaOutDTO.map((tipoAulaOutDTO: TipoAulaOutDTO) => ({ nombre: tipoAulaOutDTO.tipo, idTipoAula:tipoAulaOutDTO.idTipoAula }));
                    }
                },
                (error) => {
                  console.error(error);
                }
            ); 
        }        
    }   

    public onDiasChange(){
        this.filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum = [...this.diasSeleccionados];
        this.consultarFranjasHorariasDisponiblesPorCurso();
    }

    public onTipoAulasChange(){
        this.filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoAula = this.tipoAulasSeleccionadas; 
        this.consultarFranjasHorariasDisponiblesPorCurso();
    }
    
    public onHoraInicioChange(){
        if(this.horaInicioSeleccionado===null){
            this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio=null;
            this.horaInicioSeleccionado = {label:"",formato:""};
        }else{
            this.filtroFranjaHorariaDisponibleCursoDTO.horaInicio = this.horaInicioSeleccionado.label;
        }
        this.consultarFranjasHorariasDisponiblesPorCurso();
    }

    public onHoraFinChange(){
        if(this.horaFinSeleccionado===null){
            this.filtroFranjaHorariaDisponibleCursoDTO.horaFin=null;
            this.horaFinSeleccionado = {label:"",formato:""};
        }else{
            this.filtroFranjaHorariaDisponibleCursoDTO.horaFin = this.horaFinSeleccionado.label;
        }
        this.consultarFranjasHorariasDisponiblesPorCurso();
    }

    public cantidadHorasChange(){
        if(this.cantidadHorasSeleccionada==null){
            this.messageService.add({ severity: 'error', summary: 'Consulta fallida', detail: 'Cantidad horas es un campo obligatorio.' });
            this.cantidadHorasSeleccionada=2;
        }
        this.filtroFranjaHorariaDisponibleCursoDTO.duracion = this.cantidadHorasSeleccionada;
        this.consultarFranjasHorariasDisponiblesPorCurso();
    }

    public onNumeroAulaChange(){
        if(this.numeroAulaSeleccionada===null){
            this.filtroFranjaHorariaDisponibleCursoDTO.listaNumeroAula=[];
        }else{
            this.filtroFranjaHorariaDisponibleCursoDTO.listaNumeroAula = Array.of(this.numeroAulaSeleccionada);
        }
        this.consultarFranjasHorariasDisponiblesPorCurso();        
    }

    public salir() {
        this.mostrarAsociarAulaModal=false;
        this.modalClosedEmitter.emit();   
    }

    public guardar() {        
        let crearActualizarHorarioCursoInDTO :CrearActualizarHorarioCursoInDTO = new CrearActualizarHorarioCursoInDTO();
        crearActualizarHorarioCursoInDTO.idCurso = this.cursoPlanificacionOutDTOSeleccionado.idCurso;

        let listaFranjaHorariaCursoAsociarInDTO:FranjaHorariaCursoAsociarInDTO[] = [];

        this.listaFranjaHorariaAsignadas.forEach(FranjaHorariaItem => {
                let franjaHorariaCursoAsociarInDTO=new FranjaHorariaCursoAsociarInDTO();
                franjaHorariaCursoAsociarInDTO.idHorario = FranjaHorariaItem.franjaHorariaCursoDTO.idHorario;
                franjaHorariaCursoAsociarInDTO.idAula = FranjaHorariaItem.franjaHorariaCursoDTO.idAula;
                franjaHorariaCursoAsociarInDTO.dia=FranjaHorariaItem.franjaHorariaCursoDTO.dia;
                franjaHorariaCursoAsociarInDTO.horaInicio=FranjaHorariaItem.franjaHorariaCursoDTO.horaInicio;
                franjaHorariaCursoAsociarInDTO.horaFin=FranjaHorariaItem.franjaHorariaCursoDTO.horaFin;
                listaFranjaHorariaCursoAsociarInDTO.push(franjaHorariaCursoAsociarInDTO);
           });

        crearActualizarHorarioCursoInDTO.listaFranjaHorariaCursoAsociarInDTO = listaFranjaHorariaCursoAsociarInDTO;

        this.planificacionManualServicio.crearActualizarHorarioCursoDTO(crearActualizarHorarioCursoInDTO).subscribe(
        (crearActualizarHorarioCursoOutDTO: CrearActualizarHorarioCursoOutDTO) => {   
            if(crearActualizarHorarioCursoOutDTO.esExitoso === true){
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Franjas horarias asignadas con éxito.' });
                this.consultarAulasAsignadasYDisponibles();
            }else{
                this.messageService.add({ severity: 'error', summary: 'Existe solapamiento', detail: crearActualizarHorarioCursoOutDTO.lstMensajesSolapamientos[0], life: 7000 });
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