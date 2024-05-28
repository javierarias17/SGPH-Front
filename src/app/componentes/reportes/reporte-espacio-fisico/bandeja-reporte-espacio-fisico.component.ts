import { Component, ViewChild } from '@angular/core';
import { EspacioFisicoServicio } from '../../servicios/espacio.fisico.servicio';
import { FiltroEspacioFisicoDTO } from '../../dto/espacio-fisico/in/filtro.espacio.fisico.dto';
import { EstadoEspacioFisicoEnum } from '../../enum/estado.espacio.fisico.enum';
import { TipoEspacioFisicoOutDTO } from '../../dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoDTO } from '../../dto/espacio-fisico/out/espacio.fisico.dto';
import { TranslateService } from '@ngx-translate/core';
import { UbicacionOutDTO } from '../../dto/espacio-fisico/out/ubicacion.out.dto';
import { HorarioEspacioFisicoComponent } from './horario-espacio-fisico/horario.espacio.fisico.component';

@Component({
  selector: 'bandeja-reporte-espacio-fisico',
  templateUrl: './bandeja-reporte-espacio-fisico.component.html',
  styleUrls: ['./bandeja-reporte-espacio-fisico.component.css'],
  providers: [EspacioFisicoServicio]
})
export class BandejaReporteEspacioFisicoComponent {

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

    @ViewChild('horarioEspacioFisico') horarioEspacioFisico: HorarioEspacioFisicoComponent;
  
	constructor(private espacioFisicoServicio:EspacioFisicoServicio,
        private translateService: TranslateService
    ) {
	}

	public ngOnInit():void {          
        this.filtroEspacioFisicoDTO.registrosPorPagina = this.registrosPorPagina;         

        this.espacioFisicoServicio.consultarUbicaciones().subscribe(
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
        if(this.filtroEspacioFisicoDTO.listaIdUbicacion!==null && this.filtroEspacioFisicoDTO.listaIdUbicacion.length !== 0){
            this.espacioFisicoServicio.consultarTiposEspaciosFisicosPorUbicaciones(this.filtroEspacioFisicoDTO.listaIdUbicacion).subscribe(
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
	
    /*Horario aula*/
	public abrirModalHorarioAula(aulaDTOSeleccionado: EspacioFisicoDTO):void {
		if (this.horarioEspacioFisico) {
			this.horarioEspacioFisico.abrirModal(aulaDTOSeleccionado);
		}      
	} 
}