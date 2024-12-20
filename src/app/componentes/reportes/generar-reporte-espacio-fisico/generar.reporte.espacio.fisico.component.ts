import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { 
  SharedService } from 'src/app/shared/service/shared.service';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';
import { EstadoEspacioFisicoEnum } from '../../common/enum/estado.espacio.fisico.enum';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { EspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/out/espacio.fisico.dto';
import { TipoEspacioFisicoOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/tipo.espacio.fisico.out.dto';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { HorarioEspacioFisicoComponent } from '../ver-horario-espacio-fisico/components/horario-espacio-fisico/horario.espacio.fisico.component';
import { PlanificacionManualService } from '../../common/services/planificacion.manual.service';
import { FranjaHorariaEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/out/franja.horaria.espacio.fisico.dto';
import { EspacioFisicoOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/espacio.fisico.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
  selector: 'app-generar-reporte-espacio-fisico',
  templateUrl: './generar.reporte.espacio.fisico.component.html',
  styleUrls: ['./generar.reporte.espacio.fisico.component.css']
})
export class GenerarReporteEspacioFisicoComponent implements OnInit {
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
		    public periodoAcademicoSharedService:PeriodoAcademicoSharedService,
        private planificacionManualService: PlanificacionManualService,
        private messageService: ShowMessageService,
        private sharedService: SharedService
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
        this.messages = [];

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
				this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá acceder a esta funcionalidad si no existe un periodo académico abierto." }];
               }
           },
           (error) => {
               console.error(error);
           }
      );        
  }

  public DescargarHorarioEspacioFisico(aulaDTOSeleccionado: EspacioFisicoOutDTO): void {
    if (!aulaDTOSeleccionado.idEspacioFisico) {
        console.error('El espacio físico seleccionado no tiene un ID válido.');
        return;
    }

    this.planificacionManualService.consultarFranjasEspacioFisicoPorIdEspacioFisico(aulaDTOSeleccionado.idEspacioFisico).subscribe(
        (listaFranjaHorariaAulaDTO: FranjaHorariaEspacioFisicoDTO[]) => {
            if (!listaFranjaHorariaAulaDTO || listaFranjaHorariaAulaDTO.length === 0) {
                this.messageService.showMessage("warn", "No se encontraron franjas horarias para el espacio físico seleccionado.");
                this.limpiarMessages();
                return;
            }

            const filtro = {
                idEspacioFisico: aulaDTOSeleccionado.idEspacioFisico,
                nombreEspacio: aulaDTOSeleccionado.salon,
                ubicacion: aulaDTOSeleccionado.nombreEdificio,
                estado: aulaDTOSeleccionado.estado,
                tipoEspacio: aulaDTOSeleccionado.idTipoEspacioFisico,
                horarios: listaFranjaHorariaAulaDTO.map(franja => ({
                    dia: franja.dia,
                    horarioInicio: franja.horaInicio,
                    horaFin: franja.horaFin,
                    salon: franja.nombreCurso,
                }))
            };

            this.sharedService.descargarHorarioEspacioFisico(filtro).subscribe(
                (response: any) => {
                    try {
                        const jsonResponse = JSON.parse(response);
                        if (jsonResponse.archivoBase64) {
                            this.descargarArchivo(jsonResponse.archivoBase64, 'Horario_Espacio_Fisico.xlsx');
                            this.messageService.showMessage("success", "El archivo se ha descargado correctamente");
                            this.limpiarMessages();
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
            console.error('Error consultando las franjas horarias del espacio físico:', error);
        }
    );
  }

  private limpiarMessages(): void {
      setTimeout(() => {
          this.messages = null;
      }, 3000); // Puedes ajustar el tiempo según sea necesario
  }

  private descargarArchivo(base64Data: string, nombreArchivo: string): void {
      const binaryData = atob(base64Data);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
  }
  
}

