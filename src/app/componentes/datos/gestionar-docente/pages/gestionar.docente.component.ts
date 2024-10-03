import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FiltroDocenteDTO } from '../model/in/filtro.docente.dto';
import { DocenteOutDTO } from '../model/out/docente.out.dto';

import { EstadoDocenteEnum } from '../../../common/enum/estado.docente.enum';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearEditardocenteComponent } from '../components/crear-editar-docente/crear-editar-docente.component';
import { DocenteService } from '../../../common/services/docente.service';

@Component({
  selector: 'app-gestionar-docente',
  templateUrl: './gestionar.docente.component.html',
  styleUrls: ['./gestionar.docente.component.css'],
  providers: [DocenteService]
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

	constructor(private confirmationService: ConfirmationService,
		private messageService: MessageService,
		private docenteService:DocenteService,
		private translateService: TranslateService,
		private dialogService: DialogService) {
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
		this.docenteService.consultarDocentes(this.filtroDocenteDTO).subscribe(
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

	private obtenerNombreCompletoDocente():string{
        return (this.docenteOutDTOSeleccionado.primerNombre? this.docenteOutDTOSeleccionado.primerNombre+" ": "")
                +(this.docenteOutDTOSeleccionado.segundoNombre? this.docenteOutDTOSeleccionado.segundoNombre+" ": "")
                +(this.docenteOutDTOSeleccionado.primerApellido? this.docenteOutDTOSeleccionado.primerApellido+" ": "")
                +(this.docenteOutDTOSeleccionado.segundoApellido? this.docenteOutDTOSeleccionado.segundoApellido: "");
    }

	public onPageChange(event: any) {
		this.filtroDocenteDTO.pagina =event.page;     
		this.consultarDocentes();
	}
	/*Inactivar Docente*/
	public inactivarDocente(docenteOutDTOSeleccionado: DocenteOutDTO) {
		this.docenteOutDTOSeleccionado = { ...docenteOutDTOSeleccionado};
		const nombreCompleto = this.obtenerNombreCompletoDocente();

		this.confirmationService.confirm({
            message: `¿Está seguro que desea inactivar/activar el docente <strong>${nombreCompleto}</strong>?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
				console.log(this.docenteOutDTOSeleccionado.estado)
				if (this.docenteOutDTOSeleccionado.estado && this.docenteOutDTOSeleccionado.estado === EstadoDocenteEnum.ACTIVO) {
					this.docenteOutDTOSeleccionado.estado = EstadoDocenteEnum.INACTIVO
				} else {
					this.docenteOutDTOSeleccionado.estado = EstadoDocenteEnum.ACTIVO
				}
				this.docenteService.guardarDocente(this.docenteOutDTOSeleccionado).subscribe(r => {
					this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Docente activado/inactivado', life: 3000 });
				})
            },
            reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operación cancelada', life: 3000 });
            }
          }); 
	}
	idTipoIdentificacion
	numeroIdentificacion
	crearDocente() {
		const ref = this.dialogService.open(CrearEditardocenteComponent, {
			height: 'auto',
			width: '800px',
			header: 'Crear docente',
			closable: false,
			data: {
			  lectura: false
			}
		  },)
	}
	editarDocente(docente: DocenteOutDTO) {
		const ref = this.dialogService.open(CrearEditardocenteComponent, {
			height: 'auto',
			width: '800px',
			header: 'Editar docente',
			closable: false,
			data: {
				idTipoIdentificacion: docente.idTipoIdentificacion,
				numeroIdentificacion: docente.numeroIdentificacion,
				id: docente.idPersona,
			  	lectura: false
			}
		  },)
	}
	verDocente(docente: DocenteOutDTO) {
		const ref = this.dialogService.open(CrearEditardocenteComponent, {
			height: 'auto',
			width: '800px',
			header: 'Ver docente',
			closable: false,
			data: {
				idTipoIdentificacion: docente.idTipoIdentificacion,
				numeroIdentificacion: docente.numeroIdentificacion,
				id: docente.idPersona,
			  	lectura: true
			}
		  },)
	}
}

