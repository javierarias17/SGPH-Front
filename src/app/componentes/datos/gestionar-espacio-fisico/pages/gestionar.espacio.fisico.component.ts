import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FiltroEspacioFisicoDTO } from '../model/in/filtro.espacio.fisico.dto';
import { EstadoEspacioFisicoEnum } from '../../../common/enum/estado.espacio.fisico.enum';
import { TipoEspacioFisicoOutDTO } from '../model/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoDTO } from '../model/out/espacio.fisico.dto';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearEditarEspacioFisicoComponent } from '../components/crear-editar-espacio-fisico/crear-editar-espacio-fisico.component';
import { UbicacionOutDTO } from '../model/out/ubicacion.out.dto';
import { EspacioFisicoService } from '../../../common/services/espacio.fisico.service';
import { InformacionDetalleCargueComponent } from '../../cargar-labor-docencia/components/informacion-detalle-cargue/informacion-detalle-cargue.component';
import { ModalDetalleCargueComponent } from '../components/detalle-cargue/detalle-cargue-espacios.component';

@Component({
  selector: 'app-gestionar-espacio-fisico',
  templateUrl: './gestionar.espacio.fisico.component.html',
  styleUrls: ['./gestionar.espacio.fisico.component.css'],
  providers: [EspacioFisicoService]
})
export class GestionarEspacioFisicoComponent {

    private readonly PAGINA_CERO: number = 0;   

	private readonly REGISTROS_POR_PAGINA: number = 10;  

	public pagina: number = this.PAGINA_CERO;
  
	public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;  

    public totalRecords:number;  

    public listaEspacioFisicoDTO: EspacioFisicoDTO[] = [];

    public lstUbicacionOutDTO: UbicacionOutDTO[] = [];

    public lstTipoEspacioFisicoOutDTO: TipoEspacioFisicoOutDTO[] = [];

    public listaEstados:{ label: string; value: string }[] = [];  

    public filtroEspacioFisicoDTO: FiltroEspacioFisicoDTO=new FiltroEspacioFisicoDTO();

	public aulaDTOSeleccionado: EspacioFisicoDTO=new EspacioFisicoDTO();   
	 
	public inactivarEspacioFisicoDialog: boolean = false;
    mensaje: string
    idEspacioFisicoSeleccionado: number;
	constructor(private messageService: MessageService,
        private espacioFisicoService:EspacioFisicoService,
        private translateService: TranslateService,
        private dialog: DialogService
    ) {
	}

	public ngOnInit():void {          
        this.filtroEspacioFisicoDTO.registrosPorPagina = this.registrosPorPagina;         

        this.espacioFisicoService.consultarUbicaciones().subscribe(
            (lstUbicacionOutDTO: UbicacionOutDTO[]) => {
                this.lstUbicacionOutDTO = lstUbicacionOutDTO;
            },
            (error) => {
              console.error(error);
            }
        );  

        Object.keys(EstadoEspacioFisicoEnum).forEach(key => {
            const translatedLabel = this.translateService.instant('gestionar.espaciofisico.filtro.estado.espaciofisico.' + key);
            this.listaEstados.push({ label: translatedLabel, value: key });
        });

        this.inputsChange();
	}

    private consultarEspaciosFisicos():void{
        this.espacioFisicoService.consultarEspaciosFisicos(this.filtroEspacioFisicoDTO).subscribe(
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
        if(this.filtroEspacioFisicoDTO.listaIdUbicacion!==null && this.filtroEspacioFisicoDTO.listaIdUbicacion.length !== 0) {
            this.espacioFisicoService.consultarTiposEspaciosFisicosPorUbicaciones(this.filtroEspacioFisicoDTO.listaIdUbicacion).subscribe(
                (lstTipoEspacioFisicoOutDTO: TipoEspacioFisicoOutDTO[]) => {
                    this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico =[];
                    this.filtroEspacioFisicoDTO.estado=null;
                    this.filtroEspacioFisicoDTO.salon="";
                    if(lstTipoEspacioFisicoOutDTO.length === 0){
                        this.lstTipoEspacioFisicoOutDTO=[];
                    }else{
                        this.lstTipoEspacioFisicoOutDTO = lstTipoEspacioFisicoOutDTO;
                    }
                    this.consultarEspaciosFisicos();
                },
                (error) => {
                    console.error(error);
                }
                ); 
        }else{
            this.filtroEspacioFisicoDTO.listaIdUbicacion=[];
            this.filtroEspacioFisicoDTO.listaIdTipoEspacioFisico =[];
            this.filtroEspacioFisicoDTO.estado=null;
            this.filtroEspacioFisicoDTO.salon="";
            this.listaEspacioFisicoDTO=[];
            this.totalRecords=0;
            this.consultarEspaciosFisicos();
        }
    }  
    
    public onTipoEspacioFisicoChange():void{
        this.inputsChange();
    }

    public onEstadoChange():void{     
        this.inputsChange();
    }
    
    public inputsChange(){
        this.filtroEspacioFisicoDTO.pagina=this.PAGINA_CERO;
        this.consultarEspaciosFisicos();
    }

    public onPageChange(event: any):void {
		this.filtroEspacioFisicoDTO.pagina =event.page;     
		this.consultarEspaciosFisicos();
	}
    registrarEspacioFisico() {
        const ref = this.dialog.open(CrearEditarEspacioFisicoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Registrar espacio fisico',
            closable: false,
            data: {
                lectura: false
            }
        })
        ref.onClose.subscribe(r => {
            this.consultarEspaciosFisicos();
        })
    }
    verEspacioFisico(idEspacioFisico: number) {
        const ref = this.dialog.open(CrearEditarEspacioFisicoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Ver espacio fisico',
            closable: false,
            data: {
                lectura: true,
                idEspacioFisico: idEspacioFisico
            }
        })
        ref.onClose.subscribe(r => {
            this.consultarEspaciosFisicos();
        })
    }
    editarEspacioFisico(idEspacioFisico: number) {
        const espacioFisico = this.listaEspacioFisicoDTO.find(e => e.idEspacioFisico === idEspacioFisico);

        const ref = this.dialog.open(CrearEditarEspacioFisicoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Editar espacio fisico',
            closable: false,
            data: {
                lectura: false,
                idEspacioFisico: idEspacioFisico,
                idUbicacion: espacioFisico?.idUbicacion, // Asegúrate de incluir idUbicacion
                salon: espacioFisico?.salon
            }
        });
        ref.onClose.subscribe(r => {
            this.consultarEspaciosFisicos();
        });
    }    
	
	/*Inactivar espacio físico*/
	public inactivarEspacioFisico(espacioFisicoDTO: EspacioFisicoDTO):void {
        this.mensaje = `¿Está seguro que desea ${espacioFisicoDTO.estado == 'INACTIVO' ? "activar": "inactivar"} el espacio físico ` + "?"
        this.idEspacioFisicoSeleccionado = espacioFisicoDTO.idEspacioFisico
		this.inactivarEspacioFisicoDialog = true;
	}
	
	public confirmarInactivacion():void {
        this.espacioFisicoService.activarInactivar(this.idEspacioFisicoSeleccionado).subscribe(r => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Espacio fisico guardado', life: 3000 })
            this.consultarEspaciosFisicos();
        })
		this.inactivarEspacioFisicoDialog = false;
		
	}

    public obtenerNombreCompletoEspacioFisico():string{
        return "FALTA COMPLETAR";
    }

    public cargarArchivo(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
    
        input.onchange = (event: any) => {
            const file: File = event.target.files[0];
    
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
    
                this.espacioFisicoService.subirArchivo(formData).subscribe(
                    (response) => {
                        // Determinar el estado basado en si hay errores o no
                        const estado = (response.mensajesErrores && response.mensajesErrores.length > 0) 
                            ? 'CARGUE FALLIDO' 
                            : 'CARGUE EXITOSO';
    
                        // Capturando y procesando los datos del backend
                        const detalleCargue = [
                            `Total espacios físicos procesados: ${response.totalEspaciosFisicos || 0}`,
                            `Total espacios creados: ${response.totalEspaciosCreados || 0}`,
                            `Total espacios duplicados: ${response.totalEspaciosDuplicados || 0}`,
                            ...(response.mensajesErrores || []), // Agregar los errores si existen
                        ];
    
                        // Abrir el modal con los datos recibidos
                        this.dialog.open(ModalDetalleCargueComponent, {
                            header: 'Información detalle cargue',
                            width: '50%',
                            data: {
                                archivo: response.archivo || file.name,
                                facultad: 'FIET - Facultad de Ingeniería Electrónica y Telecomunicaciones',
                                estado,
                                detalleCargue,
                            },
                        });
    
                        // Actualizar la lista de espacios físicos
                        this.consultarEspaciosFisicos();
                    },
                    (error) => {
                        // Manejo de errores en el backend
                        const detalleError =
                            error.error?.mensajesErrores || ['Ocurrió un error inesperado al procesar el archivo.'];
    
                        // Mostrar modal con los errores
                        this.dialog.open(ModalDetalleCargueComponent, {
                            header: 'Información detalle cargue',
                            width: '50%',
                            data: {
                                archivo: file.name,
                                facultad: 'FIET - Facultad de Ingeniería Electrónica y Telecomunicaciones',
                                estado: 'FALLO CARGUE',
                                detalleCargue: detalleError,
                            },
                        });
    
                        console.error('Errores en el backend:', detalleError); // Logging para depuración
                    }
                );
            }
        };
    
        input.click(); // Abrir el selector de archivos
    }    
    
}