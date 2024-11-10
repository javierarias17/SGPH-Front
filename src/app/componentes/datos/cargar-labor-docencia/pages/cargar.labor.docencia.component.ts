import { Component, OnInit } from '@angular/core';
import { ProgramaService } from '../../../common/services/programa.service';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import { SharedService } from 'src/app/shared/service/shared.service';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import { DialogService } from 'primeng/dynamicdialog';
import { archivoBase64 } from 'src/app/shared/Constantes';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/periodo-academico/gestionar-periodo-academico/model/out/periodo-academico-out-dto';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-cargar-labor-docencia',
  templateUrl: './cargar.labor.docencia.component.html',
  styleUrls: ['./cargar.labor.docencia.component.css']
})
export class CargarLaborDocenciaComponent implements OnInit {

	cargar: boolean = false
	eliminar: boolean = false
	listaProgramas: ProgramaOutDTO[]
	programa: ProgramaOutDTO
	base64: number

	mensajesError:string = "";
	public messages: Message[] = null;

	constructor(private programaService: ProgramaService,
				private sharedService: SharedService,
				private dialogService: DialogService,
				private messageService: ShowMessageService,
				public periodoAcademicoSharedService:PeriodoAcademicoSharedService
	) {

	}
	ngOnInit(): void {
		this.consultarPeriodoAcademicoVigente();
		this.cargarProgramas()
	}
	cargarLabor() {
		this.cargar = !this.cargar
	}
	cargarProgramas() {
		this.programaService.consultarProgramasPermitidosPorUsuario().subscribe(
		(r: ProgramaOutDTO[]) => {
			this.listaProgramas = r
		},
		(error) => {
			console.error(error);
		}
		);
	}
	guardar() {
		// MOCK BASE 64
		this.sharedService.cargarLaborDocente({
		idPrograma: this.programa.idPrograma,
		nombrePrograma: this.programa.nombre,
		archivoBase64: archivoBase64
		}).subscribe(r => {
		if (r && r.error) {
			this.mensajesError = r.descripcion;
			this.messageService.showMessage("error", r.descripcion)
		} else {
			this.messageService.showMessage("success", r.descripcion)
		}
		})
	}
	visualizar() {
		// MOCK BASE64
		this.sharedService.obtenerVisualizarLaborDocente({
		idPrograma: this.programa.idPrograma,
		nombrePrograma: this.programa.nombre,
		archivoBase64: archivoBase64
		}).subscribe(r => {
		if (r) {
			this.base64 = r.archivoBase64
			this.dialogService.open(VisualizadorExcelComponent, {
			height: '90vh',
			width: '95%',
			header: 'Visualizar labor docente',
			contentStyle: { 'overflow': 'hidden' },
			data: {
				base64: this.base64
			}
			});
		}
		})
	}

  	private consultarPeriodoAcademicoVigente():void{
		this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
			(periodoAcademicoVigente: PeriodoAcademicoOutDTO) => {
				if(periodoAcademicoVigente){
					this.messages=null;
				}else{
					this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá visualizar esta funcionalidad si no existe un periodo académico abierto." }];
				}
			},
			(error) => {
				console.error(error);
			}
		);        
	}
}
