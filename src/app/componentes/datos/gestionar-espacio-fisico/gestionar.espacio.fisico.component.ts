import { Component, ViewChild } from '@angular/core';
import { EspacioFisicoServicio } from '../../servicios/espacio.fisico.servicio';
import { MessageService } from 'primeng/api';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { HorarioEspacioFisicoComponent } from './horario-espacio-fisico/horario.espacio.fisico.component';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { EdificioServicio } from '../../servicios/edificio.servicio';
import { EdificioOutDTO } from '../../dto/edificio/out/edificio.out.dto';
import { FiltroEspacioFisicoDTO } from '../../dto/espacio-fisico/in/filtro.espacio.fisico.dto';
import { EstadoAulaEnum } from '../../enum/estado.aula.enum';
import { TipoEspacioFisicoOutDTO } from '../../dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoDTO } from '../../dto/espacio-fisico/out/espacio.fisico.dto';

@Component({
  selector: 'app-gestionar-espacio-fisico',
  templateUrl: './gestionar.espacio.fisico.component.html',
  styleUrls: ['./gestionar.espacio.fisico.component.css'],
  providers: [MessageService, FacultadServicio, EspacioFisicoServicio, EdificioServicio]
})
export class GestionarEspacioFisicoComponent {

    private readonly PAGINA_CERO: number = 0;   

	private readonly REGISTROS_POR_PAGINA: number = 10;  

	public pagina: number = this.PAGINA_CERO;
  
	public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    public totalRecords:number;  

    public listaEspacioFisicoDTO: EspacioFisicoDTO[] = [];

    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    public facultadesSeleccionadas: any[] = [];

    public listaEdificios: EdificioOutDTO[] = [];

    public edificiosSeleccionados: EdificioOutDTO[] = [];

    public listaTipoEspacioFisico: TipoEspacioFisicoOutDTO[] = [];

    public tipoEspacioFisicoSeleccionados: TipoEspacioFisicoOutDTO[] = [];

    public listaEstados= [];
    
    public estadoSeleccionado: { label: string, codigo: EstadoAulaEnum }= null;

    public filtroEspacioFisicoDTO: FiltroEspacioFisicoDTO=new FiltroEspacioFisicoDTO();

	public aulaDTOSeleccionado: EspacioFisicoDTO=new EspacioFisicoDTO();   
	 
	public inactivarEspacioFisicoDialog: boolean = false;

	//Referencias componentes hijos
	//@ViewChild('crearEditarVerEspacioFisico') crearEditarVerEspacioFisico: CrearEditarVerAulaComponent;
	@ViewChild('horarioEspacioFisico') horarioEspacioFisico: HorarioEspacioFisicoComponent;
  
	constructor(private messageService: MessageService,
        private facultadServicio:FacultadServicio,
        private edificioServicio:EdificioServicio,
        private espacioFisicoServicio:EspacioFisicoServicio) {
	}

	public ngOnInit():void {          
        this.filtroEspacioFisicoDTO.registrosPorPagina = this.registrosPorPagina;         

        this.listaEstados = [
            { label: 'Activo', codigo: EstadoAulaEnum.ACTIVO },
            { label: 'Inactivo', codigo: EstadoAulaEnum.INACTIVO }
        ];

        this.facultadServicio.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
            },
            (error) => {
              console.error(error);
            }
        );  
	}

    private consultarAulas():void{
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

    public onFacultadesChange():void{
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        if(this.facultadesSeleccionadas!==null && this.facultadesSeleccionadas.length !== 0){
            this.edificioServicio.consultarEdificiosPorIdFacultad(this.facultadesSeleccionadas.map(facultad => facultad.idFacultad)).subscribe(
                (lstEdificioOutDTO: EdificioOutDTO[]) => {
                    if(lstEdificioOutDTO.length === 0){
                        this.listaEdificios=[];
                        this.filtroEspacioFisicoDTO.listaIdEdificio =null;
                    }else{
                        this.listaEdificios = lstEdificioOutDTO;
                        this.filtroEspacioFisicoDTO.listaIdEdificio = lstEdificioOutDTO.map(edificio => edificio.idEdificio);
                    }
                    this.filtroEspacioFisicoDTO.listaIdFacultad = this.facultadesSeleccionadas.map(facultad => facultad.idFacultad);
                    this.consultarAulas();
                },
                (error) => {
                    console.error(error);
                }
                ); 
        }else{
            this.listaEspacioFisicoDTO=[];
            this.totalRecords=undefined;
            //Se limpian variables de las listas desplegables
            this.listaEdificios=[];
            this.listaTipoEspacioFisico=[];
            //Se limpian valores del filtro
            this.filtroEspacioFisicoDTO.listaIdFacultad=null;
            this.filtroEspacioFisicoDTO.listaIdEdificio=null;
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico=null;
            this.filtroEspacioFisicoDTO.estado=null;
            //Se limpian variables de los inputs
            this.facultadesSeleccionadas=[];
            this.edificiosSeleccionados=null;
            this.tipoEspacioFisicoSeleccionados=null;
            this.estadoSeleccionado=null;
        }
    }  
    
    public onEdificiosChange():void{
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        if(this.edificiosSeleccionados){
            this.espacioFisicoServicio.consultarTiposEspaciosFisicosPorIdEdificio(this.edificiosSeleccionados.map(edificio => edificio.idEdificio)).subscribe(
                (lstTipoAulaOutDTO: TipoEspacioFisicoOutDTO[]) => {
                    if(lstTipoAulaOutDTO.length === 0){
                        this.listaTipoEspacioFisico=[];
                        this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico =null;
                    }else{
                        this.listaTipoEspacioFisico = lstTipoAulaOutDTO;
                        this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico = lstTipoAulaOutDTO.map(tipoAula => tipoAula.idTipoEspacioFisico);
                    }
                    this.filtroEspacioFisicoDTO.listaIdEdificio = this.edificiosSeleccionados.map(edficio => edficio.idEdificio);
                    this.consultarAulas();
                },
                (error) => {
                  console.error(error);
                }
            ); 
        }else{
            this.tipoEspacioFisicoSeleccionados=null;
            this.listaTipoEspacioFisico=[];
            this.filtroEspacioFisicoDTO.listaIdEdificio=null;
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico=null
            this.consultarAulas();
        }
    }   

    public onTipoEspacioFisicoChange():void{
        if( this.tipoEspacioFisicoSeleccionados){
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico = this.tipoEspacioFisicoSeleccionados.map(tipoAula => tipoAula.idTipoEspacioFisico);
        }else{
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico =[];
        }
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        this.consultarAulas();
    }

    public onEstadoChange():void{   
        if(this.estadoSeleccionado){
            this.filtroEspacioFisicoDTO.estado=this.estadoSeleccionado.codigo===EstadoAulaEnum.INACTIVO? false: true;
        }else{
            this.filtroEspacioFisicoDTO.estado=null;
        }     
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        this.consultarAulas();
    } 

    public onPageChange(event: any):void {
		this.filtroEspacioFisicoDTO.pagina =event.page;     
		this.consultarAulas();
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