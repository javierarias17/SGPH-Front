import { Component, ViewChild } from '@angular/core';
import { AulaServicio } from '../../servicios/aula.servicio';
import { MessageService } from 'primeng/api';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { HorarioAulaComponent } from './horario-aula/horario-aula.component';
import { AulaDTO } from '../../dto/aula/out/aula.dto';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { EdificioServicio } from '../../servicios/edificio.servicio';
import { EdificioOutDTO } from '../../dto/edificio/out/edificio.out.dto';
import { FiltroAulaDTO } from '../../dto/aula/in/FiltroAulaDTO';
import { TipoAulaOutDTO } from '../../dto/aula/out/tipo.aula.out.dto';
import { EstadoAulaEnum } from '../../enum/estado.aula.enum';

@Component({
  selector: 'app-gestionar-aula',
  templateUrl: './gestionar-aula.component.html',
  styleUrls: ['./gestionar-aula.component.css'],
  providers: [MessageService, FacultadServicio, AulaServicio, EdificioServicio]
})
export class GestionarAulaComponent {

    private readonly PAGINA_CERO: number = 0;   

	private readonly REGISTROS_POR_PAGINA: number = 10;  

	public pagina: number = this.PAGINA_CERO;
  
	public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    public totalRecords:number;  

    public listaAulaDTO: AulaDTO[] = [];

    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    public facultadesSeleccionadas: any[] = [];

    public listaEdificios: EdificioOutDTO[] = [];

    public edificiosSeleccionados: EdificioOutDTO[] = [];

    public listaTipoAulas: TipoAulaOutDTO[] = [];

    public tipoAulasSeleccionadas: TipoAulaOutDTO[] = [];

    public listaEstados= [];
    
    public estadoSeleccionado: { label: string, codigo: EstadoAulaEnum }= null;

    private filtroAulaDTO: FiltroAulaDTO=new FiltroAulaDTO();

	public aulaDTOSeleccionado: AulaDTO=new AulaDTO();   
	 
	public inactivarAulaDialog: boolean = false;

	//Referencias componentes hijos
	//@ViewChild('crearEditarVerAula') crearEditarVerAula: CrearEditarVerAulaComponent;
	@ViewChild('horarioAula') horarioAula: HorarioAulaComponent;
  
	constructor(private messageService: MessageService,
        private facultadServicio:FacultadServicio,
        private edificioServicio:EdificioServicio,
        private aulaServicio:AulaServicio) {
	}

	public ngOnInit():void {          
        this.filtroAulaDTO.registrosPorPagina = this.registrosPorPagina;         

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
        this.aulaServicio.consultarAulas(this.filtroAulaDTO).subscribe(
            (response: any) => {
              this.listaAulaDTO = response.content;
              this.totalRecords= response.totalElements;
            },
            (error) => {
              console.error(error);
            }
          );
    }

    public onFacultadesChange():void{
        this.filtroAulaDTO.pagina=this.PAGINA_CERO;
        if(this.facultadesSeleccionadas!==null && this.facultadesSeleccionadas.length !== 0){
            this.edificioServicio.consultarEdificiosPorIdFacultad(this.facultadesSeleccionadas.map(facultad => facultad.idFacultad)).subscribe(
                (lstEdificioOutDTO: EdificioOutDTO[]) => {
                    if(lstEdificioOutDTO.length === 0){
                        this.listaEdificios=[];
                        this.filtroAulaDTO.listaIdEdificio =null;
                    }else{
                        this.listaEdificios = lstEdificioOutDTO;
                        this.filtroAulaDTO.listaIdEdificio = lstEdificioOutDTO.map(edificio => edificio.idEdificio);
                    }
                    this.filtroAulaDTO.listaIdFacultad = this.facultadesSeleccionadas.map(facultad => facultad.idFacultad);
                    this.consultarAulas();
                },
                (error) => {
                    console.error(error);
                }
                ); 
        }else{
            this.listaAulaDTO=[];
            this.totalRecords=undefined;
            //Se limpian variables de las listas desplegables
            this.listaEdificios=[];
            this.listaTipoAulas=[];
            //Se limpian valores del filtro
            this.filtroAulaDTO.listaIdFacultad=null;
            this.filtroAulaDTO.listaIdEdificio=null;
            this.filtroAulaDTO.listaIdTipoAula=null;
            this.filtroAulaDTO.estado=null;
            //Se limpian variables de los inputs
            this.facultadesSeleccionadas=[];
            this.edificiosSeleccionados=null;
            this.tipoAulasSeleccionadas=null;
            this.estadoSeleccionado=null;
        }
    }  
    
    public onEdificiosChange():void{
        this.filtroAulaDTO.pagina=this.PAGINA_CERO;
        if(this.edificiosSeleccionados){
            this.aulaServicio.consultarTipoAulasPorIdEdificio(this.edificiosSeleccionados.map(edificio => edificio.idEdificio)).subscribe(
                (lstTipoAulaOutDTO: TipoAulaOutDTO[]) => {
                    if(lstTipoAulaOutDTO.length === 0){
                        this.listaTipoAulas=[];
                        this.filtroAulaDTO.listaIdTipoAula =null;
                    }else{
                        this.listaTipoAulas = lstTipoAulaOutDTO;
                        this.filtroAulaDTO.listaIdTipoAula = lstTipoAulaOutDTO.map(tipoAula => tipoAula.idTipoAula);
                    }
                    this.filtroAulaDTO.listaIdEdificio = this.edificiosSeleccionados.map(edficio => edficio.idEdificio);
                    this.consultarAulas();
                },
                (error) => {
                  console.error(error);
                }
            ); 
        }else{
            this.tipoAulasSeleccionadas=null;
            this.listaTipoAulas=[];
            this.filtroAulaDTO.listaIdEdificio=null;
            this.filtroAulaDTO.listaIdTipoAula=null
            this.consultarAulas();
        }
    }   

    public onTipoAulaChange():void{
        if( this.tipoAulasSeleccionadas){
            this.filtroAulaDTO.listaIdTipoAula = this.tipoAulasSeleccionadas.map(tipoAula => tipoAula.idTipoAula);
        }else{
            this.filtroAulaDTO.listaIdTipoAula =[];
        }
        this.filtroAulaDTO.pagina=this.PAGINA_CERO;
        this.consultarAulas();
    }

    public onEstadoChange():void{   
        if(this.estadoSeleccionado){
            this.filtroAulaDTO.estado=this.estadoSeleccionado.codigo===EstadoAulaEnum.INACTIVO? false: true;
        }else{
            this.filtroAulaDTO.estado=null;
        }     
        this.filtroAulaDTO.pagina=this.PAGINA_CERO;
        this.consultarAulas();
    } 

    public onPageChange(event: any):void {
		this.filtroAulaDTO.pagina =event.page;     
		this.consultarAulas();
	}
		
	/*Crear, Editar y Ver docente
	public abrirModalCrearEditarVerAula(idAula: number, tituloModal: string) {
		if (this.crearEditarVerAula) {
			this.crearEditarVerAula.abrirModal(idAula, tituloModal);
		}      
	}*/
	
	/*Inactivar aula*/
	public inactivarAula(idAula: number):void {
		this.inactivarAulaDialog = true;
	}
	
	public confirmarInactivacion():void {
		this.inactivarAulaDialog = false;
		this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Docente inactivado', life: 3000 });
	}

	/*Horario aula*/
	public abrirModalHorarioAula(aulaDTOSeleccionado: AulaDTO):void {
		if (this.horarioAula) {
			this.horarioAula.abrirModal(aulaDTOSeleccionado);
		}      
	} 

    public obtenerNombreCompletoAula():string{
        return "FALTA COMPLETAR";
    }

}