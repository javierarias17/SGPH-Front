import { Component, ViewChild } from '@angular/core';
import { EspacioFisicoService } from '../../../common/services/espacio.fisico.service';
import { FiltroEspacioFisicoDTO } from '../../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { EstadoEspacioFisicoEnum } from '../../../common/enum/estado.espacio.fisico.enum';
import { TipoEspacioFisicoOutDTO } from '../../../datos/gestionar-espacio-fisico/model/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoDTO } from '../../../datos/gestionar-espacio-fisico/model/out/espacio.fisico.dto';
import { TranslateService } from '@ngx-translate/core';
import { UbicacionOutDTO } from '../../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { HorarioEspacioFisicoComponent } from '../horario-espacio-fisico/horario.espacio.fisico.component';
import { Message } from 'primeng/api';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

@Component({
  selector: 'bandeja-reporte-espacio-fisico',
  templateUrl: './bandeja-reporte-espacio-fisico.component.html',
  providers: [EspacioFisicoService]
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

    public messages: Message[] = null;

    @ViewChild('horarioEspacioFisico') horarioEspacioFisico: HorarioEspacioFisicoComponent;
  
	constructor(private espacioFisicoService:EspacioFisicoService,
        private translateService: TranslateService,
		public periodoAcademicoSharedService:PeriodoAcademicoSharedService
    ) {
	}

	public ngOnInit():void {    
        this.consultarPeriodoAcademicoVigente();       
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
                this.consultarPeriodoAcademicoVigente(); 
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
	
    /*Horario aula*/
	public abrirModalHorarioAula(aulaDTOSeleccionado: EspacioFisicoDTO):void {
		if (this.horarioEspacioFisico) {
			this.horarioEspacioFisico.abrirModal(aulaDTOSeleccionado);
		}      
	} 

    private consultarPeriodoAcademicoVigente():void{
        this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
            (r: any) => {
                if(r){
                    this.messages=null;
                }else{
                    this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá visualizar los horarios de los espacios físicos." }];
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }
}