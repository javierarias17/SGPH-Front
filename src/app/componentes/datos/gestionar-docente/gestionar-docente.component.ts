import { Component, ViewChild } from '@angular/core';
import { DocenteServicio } from '../../servicios/docente.servicio';
import { MessageService } from 'primeng/api';
import { CursoServicio } from '../../servicios/curso.servicio';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { AsignaturaServicio } from '../../servicios/asignatura.servicio';
import { AulaServicio } from '../../servicios/aula.servicio';
import { HorarioServicio } from '../../servicios/horario.servicio';
import { FiltroDocenteDTO } from '../../dto/docente/in/filtro.docente.dto';
import { DocenteOutDTO } from '../../dto/docente/out/docente.out.dto';
import { CrearEditarVerDocenteComponent } from './crear-editar-ver-docente/crear-editar-ver-docente.component';
import { HorarioDocenteComponent } from './horario-docente/horario-docente.component';
import { EstadoDocenteEnum } from '../../enum/estado.docente.enum';

@Component({
  selector: 'app-gestionar-docente',
  templateUrl: './gestionar-docente.component.html',
  styleUrls: ['./gestionar-docente.component.css'],
  providers: [MessageService, CursoServicio, FacultadServicio, ProgramaServicio, AsignaturaServicio, AulaServicio, HorarioServicio, DocenteServicio]
})
export class GestionarDocenteComponent {

	private readonly PAGINA_CERO: number = 0;   

	private readonly REGISTROS_POR_PAGINA: number = 10;  

	public pagina: number = this.PAGINA_CERO;
  
	public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  
	
	public totalRecords:number;  

	public listaDocenteOutDTO: DocenteOutDTO[] = [];

	public listaEstados= [];

    public estadoSeleccionado: { label: string, codigo: EstadoDocenteEnum }= null;

  	/*Filtro*/
  	public filtroDocenteDTO:FiltroDocenteDTO=new FiltroDocenteDTO();

	public docenteOutDTOSeleccionado: DocenteOutDTO=new DocenteOutDTO();   
	
	/*TEMPORALES*/    
	inactivarDocenteDialog: boolean = false;
	submitted: boolean = false;
	cols: any[] = [];
	rowsPerPageOptions = [5, 10, 20];

	//Referencias componentes hijos
	@ViewChild('crearEditarVerDocente') crearEditarVerDocente: CrearEditarVerDocenteComponent;
	@ViewChild('horarioDocente') horarioDocente: HorarioDocenteComponent;
  
	constructor(private messageService: MessageService,
		private docenteServicio:DocenteServicio) {
	}

	public ngOnInit() {   
		this.listaEstados = [
            { label: 'Activo', codigo: EstadoDocenteEnum.ACTIVO },
            { label: 'Inactivo', codigo: EstadoDocenteEnum.INACTIVO }
        ];

        this.filtroDocenteDTO.pagina=this.pagina;
        this.filtroDocenteDTO.registrosPorPagina = this.registrosPorPagina;    
        this.consultarDocentes();       
	}

  	private consultarDocentes() {
		this.docenteServicio.consultarDocentes(this.filtroDocenteDTO).subscribe(
			(response: any) => {  
					this.listaDocenteOutDTO = response.content;
					this.totalRecords= response.totalElements;
					},
					(error) => {
						console.error(error);
					}
			);
	}

	public inputsChange():void{
		if( this.filtroDocenteDTO.codigo===""){
            this.filtroDocenteDTO.codigo = null;
        }
        if( this.filtroDocenteDTO.numeroIdentificacion===""){
            this.filtroDocenteDTO.numeroIdentificacion = null;
        }
        if( this.filtroDocenteDTO.nombre===null){
            this.filtroDocenteDTO.nombre = "";
        }
        this.consultarDocentes();
	}

	public onEstadoChange():void{   
        if(this.estadoSeleccionado){
            this.filtroDocenteDTO.estado=this.estadoSeleccionado.codigo===EstadoDocenteEnum.INACTIVO? false: true;
        }else{
            this.filtroDocenteDTO.estado=null;
        }     
        this.filtroDocenteDTO.pagina=this.PAGINA_CERO;
        this.consultarDocentes();
    } 

	public obtenerNombreCompletoDocente():string{
        return (this.docenteOutDTOSeleccionado.primerNombre? this.docenteOutDTOSeleccionado.primerNombre+" ": "")
                +(this.docenteOutDTOSeleccionado.segundoNombre? this.docenteOutDTOSeleccionado.segundoNombre+" ": "")
                +(this.docenteOutDTOSeleccionado.primerApellido? this.docenteOutDTOSeleccionado.primerApellido+" ": "")
                +(this.docenteOutDTOSeleccionado.segundoApellido? this.docenteOutDTOSeleccionado.segundoApellido: "");
    }

	public onPageChange(event: any) {
		this.filtroDocenteDTO.pagina =event.page;     
		this.consultarDocentes();
	}
		
	/*Crear, Editar y Ver docente*/
	public abrirModalCrearEditarVerDocente(docenteOutDTOSeleccionado: DocenteOutDTO, tituloModal: string) {
		if (this.crearEditarVerDocente) {
			this.crearEditarVerDocente.abrirModal(docenteOutDTOSeleccionado, tituloModal);
		}      
	}
	
	/*Inactivar curso*/
	public inactivarDocente(docenteOutDTOSeleccionado: DocenteOutDTO) {
		this.docenteOutDTOSeleccionado = { ...docenteOutDTOSeleccionado};
		this.inactivarDocenteDialog = true;
	}
	
	public confirmarInactivacion() {
		this.inactivarDocenteDialog = false;
		this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Docente inactivado', life: 3000 });
	}

	/*Horario docente*/
	public abrirModalHorarioDocente(docenteOutDTOSeleccionado: DocenteOutDTO) {
		if (this.horarioDocente) {
			this.horarioDocente.abrirModal(docenteOutDTOSeleccionado);
		}      
	}
}

