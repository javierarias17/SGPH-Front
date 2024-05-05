import { Component, ViewChild } from '@angular/core';
import { EspacioFisicoServicio } from '../../servicios/espacio.fisico.servicio';
import { MessageService } from 'primeng/api';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { HorarioEspacioFisicoComponent } from './horario-espacio-fisico/horario.espacio.fisico.component';
import { FiltroEspacioFisicoDTO } from '../../dto/espacio-fisico/in/filtro.espacio.fisico.dto';
import { EstadoEspacioFisicoEnum } from '../../enum/estado.espacio.fisico.enum';
import { TipoEspacioFisicoOutDTO } from '../../dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoDTO } from '../../dto/espacio-fisico/out/espacio.fisico.dto';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gestionar-espacio-fisico',
  templateUrl: './gestionar.espacio.fisico.component.html',
  styleUrls: ['./gestionar.espacio.fisico.component.css'],
  providers: [MessageService, FacultadServicio, EspacioFisicoServicio]
})
export class GestionarEspacioFisicoComponent {

    private readonly PAGINA_CERO: number = 0;   

	private readonly REGISTROS_POR_PAGINA: number = 10;  

	public pagina: number = this.PAGINA_CERO;
  
	public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    public totalRecords:number;  

    public listaEspacioFisicoDTO: EspacioFisicoDTO[] = [];

    public lstUbicacion: string[] = [];

    public listaEdificios: string[] = [];

    public listaTipoEspacioFisico: TipoEspacioFisicoOutDTO[] = [];

    public tipoEspacioFisicoSeleccionados: TipoEspacioFisicoOutDTO[] = [];

    public listaEstados:{ label: string; value: string }[] = [];  

    public filtroEspacioFisicoDTO: FiltroEspacioFisicoDTO=new FiltroEspacioFisicoDTO();

	public aulaDTOSeleccionado: EspacioFisicoDTO=new EspacioFisicoDTO();   
	 
	public inactivarEspacioFisicoDialog: boolean = false;

	//Referencias componentes hijos
	//@ViewChild('crearEditarVerEspacioFisico') crearEditarVerEspacioFisico: CrearEditarVerAulaComponent;
	@ViewChild('horarioEspacioFisico') horarioEspacioFisico: HorarioEspacioFisicoComponent;
  
	constructor(private messageService: MessageService,
        private espacioFisicoServicio:EspacioFisicoServicio,
        private translateService: TranslateService) {
	}

	public ngOnInit():void {          
        this.filtroEspacioFisicoDTO.registrosPorPagina = this.registrosPorPagina;         

        this.espacioFisicoServicio.consultarUbicaciones().subscribe(
            (lstUbicacion: string[]) => {
                this.lstUbicacion = lstUbicacion;
            },
            (error) => {
              console.error(error);
            }
        );  

        Object.keys(EstadoEspacioFisicoEnum).forEach(key => {
            const translatedLabel = this.translateService.instant('gestionar.espaciofisico.filtro.estado.espaciofisico.' + key);
            this.listaEstados.push({ label: translatedLabel, value: key });
        });
	}

    private consultarEspaciosFisicos():void{
        this.espacioFisicoServicio.consultarEspaciosFisicos(this.filtroEspacioFisicoDTO).subscribe(
            (response: any) => {
              this.listaEspacioFisicoDTO = response.content;
              this.totalRecords= response.totalElements;
            },
            (error) => {
              console.error(error);
            }
          );
    }

    public onUbicacionesChange():void{
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        if(this.filtroEspacioFisicoDTO.listaUbicacion!==null && this.filtroEspacioFisicoDTO.listaUbicacion.length !== 0){
            this.espacioFisicoServicio.consultarEdificiosPorUbicacion(this.filtroEspacioFisicoDTO.listaUbicacion).subscribe(
                (lstEdificio: string[]) => {
                    this.filtroEspacioFisicoDTO.listaEdificio =[];
                    if(lstEdificio.length === 0){
                        this.listaEdificios=[];
                    }else{
                        this.listaEdificios = lstEdificio;
                    }
                    this.listaTipoEspacioFisico=[];
                    this.tipoEspacioFisicoSeleccionados=[];
                    this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico=[];
                    this.consultarEspaciosFisicos();
                },
                (error) => {
                    console.error(error);
                }
                ); 
        }else{
            this.listaEspacioFisicoDTO=[];
            //Se limpian variables de las listas desplegables
            this.listaEdificios=[];
            this.listaTipoEspacioFisico=[];
            //Se limpian valores del filtro
            this.filtroEspacioFisicoDTO.listaUbicacion=[];
            this.filtroEspacioFisicoDTO.listaEdificio=[];
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico=[];
            this.filtroEspacioFisicoDTO.estado=null;
            //Se limpian variables de los inputs
            this.tipoEspacioFisicoSeleccionados=[];  
        }
    }  
    
    public onEdificiosChange():void{
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        if(this.filtroEspacioFisicoDTO.listaEdificio!==null && this.filtroEspacioFisicoDTO.listaEdificio.length !== 0){
            this.espacioFisicoServicio.consultarTiposEspaciosFisicosPorEdificio(this.filtroEspacioFisicoDTO.listaEdificio).subscribe(
                (lstTipoAulaOutDTO: TipoEspacioFisicoOutDTO[]) => {
                    if(lstTipoAulaOutDTO.length === 0){
                        this.listaTipoEspacioFisico=[];
                        this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico =[];
                    }else{
                        this.listaTipoEspacioFisico = lstTipoAulaOutDTO;
                        this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico = lstTipoAulaOutDTO.map(tipoAula => tipoAula.idTipoEspacioFisico);
                    }
                    this.tipoEspacioFisicoSeleccionados=[];
                    this.consultarEspaciosFisicos();
                },
                (error) => {
                  console.error(error);
                }
            ); 
        }else{
            //Se limpian variables de las listas desplegables
            this.listaTipoEspacioFisico=[];
             //Se limpian valores del filtro
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico=[];
             //Se limpian variables de los inputs
            this.tipoEspacioFisicoSeleccionados=[];
            this.consultarEspaciosFisicos();
        }
    }   

    public onTipoEspacioFisicoChange():void{
        if( this.tipoEspacioFisicoSeleccionados){
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico = this.tipoEspacioFisicoSeleccionados.map(tipoEspacioFisico => tipoEspacioFisico.idTipoEspacioFisico);
        }else{
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico =[];
        }
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        this.consultarEspaciosFisicos();
    }

    public onEstadoChange():void{     
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        this.consultarEspaciosFisicos();
    } 

    public onPageChange(event: any):void {
		this.filtroEspacioFisicoDTO.pagina =event.page;     
		this.consultarEspaciosFisicos();
	}
		
	//Crear, Editar y Ver espacio físico
	/*public abrirModalCrearEditarVerEspacioFisico(idEspacioFisico: number, tituloModal: string) {
		if (this.crearEditarVerEspacioFisico) {
			this.crearEditarVerEspacioFisico.abrirModal(idEspacioFisico, tituloModal);
		}      
	}*/
	
	/*Inactivar aula*/
	public inactivarEspacioFisico(idEspacioFisico: number):void {
		this.inactivarEspacioFisicoDialog = true;
	}
	
	public confirmarInactivacion():void {
		this.inactivarEspacioFisicoDialog = false;
		this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Docente inactivado', life: 3000 });
	}

	/*Horario aula*/
	public abrirModalHorarioAula(aulaDTOSeleccionado: EspacioFisicoDTO):void {
		if (this.horarioEspacioFisico) {
			this.horarioEspacioFisico.abrirModal(aulaDTOSeleccionado);
		}      
	} 

    public obtenerNombreCompletoEspacioFisico():string{
        return "FALTA COMPLETAR";
    }
}