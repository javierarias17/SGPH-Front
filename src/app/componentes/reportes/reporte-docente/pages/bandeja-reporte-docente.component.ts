
import { Component, ViewChild } from '@angular/core';
import { FiltroDocenteDTO } from '../../../datos/gestionar-docente/model/in/filtro.docente.dto';
import { DocenteOutDTO } from '../../../datos/gestionar-docente/model/out/docente.out.dto';
import { HorarioDocenteComponent } from '../horario-docente/horario.docente.component';
import { EstadoDocenteEnum } from '../../../common/enum/estado.docente.enum';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { DocenteService } from '../../../common/services/docente.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

@Component({
  selector: 'bandeja-reporte-docente',
  templateUrl: './bandeja-reporte-docente.component.html',
  styleUrls: ['./bandeja-reporte-docente.component.css'],
  providers: [DocenteService]
})
export class BandejaReporteDocenteComponent {

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
	
	//Referencias componentes hijos
	@ViewChild('horarioDocente') horarioDocente: HorarioDocenteComponent;

	public messages: Message[] = null;
  
	constructor(private docenteService:DocenteService,
		private translateService: TranslateService,  
		public periodoAcademicoSharedService:PeriodoAcademicoSharedService) {
	}

	public ngOnInit() { 
		this.consultarPeriodoAcademicoVigente(); 
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
				this.consultarPeriodoAcademicoVigente();  
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

	public onPageChange(event: any) {
		this.filtroDocenteDTO.pagina =event.page;     
		this.consultarDocentes();
	}
				
	/*Horario docente*/
	public abrirModalHorarioDocente(docenteOutDTOSeleccionado: DocenteOutDTO) {
		if (this.horarioDocente) {
			this.horarioDocente.abrirModal(docenteOutDTOSeleccionado);
		}      
	}

	private consultarPeriodoAcademicoVigente():void{
        this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
            (r: any) => {
                if(r){
                    this.messages=null;
                }else{
                    this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá visualizar los horarios de los docentes." }];
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }
}

