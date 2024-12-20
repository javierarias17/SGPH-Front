import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import * as XLSX from 'xlsx';

import { TipoIdentificacionOutDTO } from '../../../seguridad/gestionar-usuario/model/out/tipo.identificacion.out.dto';
import { PersonaService } from '../../../common/services/persona.service';
import { DocenteOutDTO } from 'src/app/componentes/datos/gestionar-docente/model/out/docente.out.dto';
import { EstadoDocenteEnum } from 'src/app/componentes/common/enum/estado.docente.enum';
import { DocenteService } from 'src/app/componentes/common/services/docente.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { FiltroDocenteDTO } from 'src/app/componentes/datos/gestionar-docente/model/in/filtro.docente.dto';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';
import { HorarioDocenteComponent } from '../../ver-horario-docente/components/horario-docente/horario.docente.component';
import { PlanificacionManualService } from 'src/app/componentes/common/services/planificacion.manual.service';
import { FranjaHorariaDocenteDTO } from 'src/app/componentes/datos/gestionar-docente/model/out/franja.horaria.docente.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
@Component({
  selector: 'app-generar-reporte-docente',
  templateUrl: './generar.reporte.docente.component.html',
  styleUrls: ['./generar.reporte.docente.component.css']
})
export class GenerarReporteDocenteComponent implements OnInit {

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
		private ref: DynamicDialogRef,   
		private translateService: TranslateService,  
		private sharedService: SharedService,
		public periodoAcademicoSharedService:PeriodoAcademicoSharedService,
		private planificacionManualService: PlanificacionManualService,
		private messageService: ShowMessageService,
		private cdr: ChangeDetectorRef) {
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
		this.consultarPeriodoAcademicoVigente();  
		this.docenteService.consultarDocentes(this.filtroDocenteDTO).subscribe(
			(response: any) => {
				this.listaDocenteOutDTO = response.content;
				this.totalRecords= response.totalElements;
        console.log('RESPONSE', response);
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
					this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá acceder a esta funcionalidad si no existe un periodo académico abierto." }];
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }

	private DescargarHorarioDocente(docenteOutDTOSeleccionado: DocenteOutDTO): void {
		if (!docenteOutDTOSeleccionado.idPersona) {
			console.error('El docente seleccionado no tiene un ID válido.');
			return;
		}
	
		this.planificacionManualService.consultarFranjasDocentePorIdPersona(docenteOutDTOSeleccionado.idPersona).subscribe(
			(listaFranjaHorariaDocenteDTO: FranjaHorariaDocenteDTO[]) => {
				if (!listaFranjaHorariaDocenteDTO || listaFranjaHorariaDocenteDTO.length === 0) {
					this.messageService.showMessage("warn", "No se encontraron franjas horarias para el docente seleccionado.");
					return;
				}
	
				const filtro = {
					tipoIdentificacion: docenteOutDTOSeleccionado.codigoTipoIdentificacion,
					numeroIdentificacion: docenteOutDTOSeleccionado.numeroIdentificacion,
					primerNombre: docenteOutDTOSeleccionado.primerNombre,
					segundoNombre: docenteOutDTOSeleccionado.segundoNombre,
					primerApellido: docenteOutDTOSeleccionado.primerApellido,
					segundoApellido: docenteOutDTOSeleccionado.segundoApellido,
					cursos: listaFranjaHorariaDocenteDTO.map(franja => ({
						grupo: franja.nombreCurso,
						nombreprograma: franja.nombreCurso,
						nombreAsignatura: franja.nombreCurso,
						horarios: [
							{
								dia: franja.dia,
								horarioInicio: franja.horaInicio,
								horaFin: franja.horaFin,
								salon: franja.salon
							}
						]
					}))
				};
	
				this.sharedService.descargarHorarioDocente(filtro).subscribe(
					(response: any) => {
						console.log('Respuesta cruda del servidor:', response);
				
						try {
							const jsonResponse = JSON.parse(response); // Decodifica el JSON manualmente
							console.log('Respuesta decodificada:', jsonResponse);
				
							if (jsonResponse.archivoBase64) {
								const base64Data = jsonResponse.archivoBase64;
								const binaryData = atob(base64Data);
								const byteArray = new Uint8Array(binaryData.length);
								for (let i = 0; i < binaryData.length; i++) {
									byteArray[i] = binaryData.charCodeAt(i);
								}
				
								const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
								const url = window.URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = url;
								a.download = 'Horario_Docente.xlsx';
								a.click();
								window.URL.revokeObjectURL(url);
								this.messageService.showMessage("success", "El archivo se ha descargado correctamente");
							} else {
								console.error('No se recibió el archivo en la respuesta.');
							}
						} catch (error) {
							console.error('Error al decodificar la respuesta JSON:', error);
						}
					},
					(error) => {
						console.error('Error descargando el horario:', error);
					}
				);				
			},
			(error) => {
				console.error('Error consultando las franjas horarias del docente:', error);
			}
		);
	}	

}