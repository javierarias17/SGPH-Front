import { Component, ViewChild } from '@angular/core';
import { DocenteServicio } from '../../servicios/docente.servicio';
import { MessageService } from 'primeng/api';
import { CursoServicio } from '../../servicios/curso.servicio';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { AsignaturaServicio } from '../../servicios/asignatura.servicio';
import { HorarioServicio } from '../../servicios/horario.servicio';
import { FiltroDocenteDTO } from '../../dto/docente/in/filtro.docente.dto';
import { DocenteOutDTO } from '../../dto/docente/out/docente.out.dto';
import { CrearEditarVerDocenteComponent } from './crear-editar-ver-docente/crear.editar.ver.docente.component';
import { HorarioDocenteComponent } from './horario-docente/horario.docente.component';
import { EstadoDocenteEnum } from '../../enum/estado.docente.enum';
import { LenguajeServicio } from '../../servicios/lenguaje.servicio';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gestionar-docente',
  templateUrl: './gestionar.docente.component.html',
  styleUrls: ['./gestionar.docente.component.css'],
  providers: [MessageService, CursoServicio, FacultadServicio, ProgramaServicio, AsignaturaServicio, HorarioServicio, DocenteServicio, LenguajeServicio]
})
export class GestionarDocenteComponent {

	private readonly PAGINA_CERO: number = 0;   

	private readonly REGISTROS_POR_PAGINA: number = 10;  

	public pagina: number = this.PAGINA_CERO;
  
	public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  
	
	public totalRecords:number;  

	public listaDocenteOutDTO: DocenteOutDTO[] = [];

	public listaEstados:{ label: string; value: string }[] = [];  

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
		private docenteServicio:DocenteServicio,
		private translateService: TranslateService) {
	}

	public ngOnInit() {   
		Object.keys(EstadoDocenteEnum).forEach(key => {
            const translatedLabel = this.translateService.instant('gestionar.docente.filtro.estado.docente.' + key);
            this.listaEstados.push({ label: translatedLabel, value: key });
        });

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

