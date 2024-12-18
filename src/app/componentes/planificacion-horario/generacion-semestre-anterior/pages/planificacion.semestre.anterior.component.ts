import { Component } from '@angular/core';
import { PeriodoAcademicoOutDTO } from '../../../periodo-academico/gestionar-periodo-academico/model/out/periodo-academico-out-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FacultadOutDTO } from '../../../common/model/facultad/out/facultad.out.dto';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PlanificacionManualService } from '../../../common/services/planificacion.manual.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgramaService } from '../../../common/services/programa.service';
import { AsignaturaService } from '../../../common/services/asignatura.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

@Component({
    selector: 'app-planificacion-semestre-anterior',
    templateUrl: './planificacion.semestre.anterior.component.html',
    styleUrls: ['./planificacion.semestre.anterior.component.css'],
	providers: [PlanificacionManualService, AsignaturaService]
})
export class PlanificacionSemestreAnteriorComponent {
    
    public mostrarModalError: boolean = false;
    public tieneCursosAsociados: boolean = false;
	public mensajeError: string = '';

    public formulario: FormGroup;
    public isLoading: boolean = false;
    public ocultarResultadoGeneracion:boolean =true;

    public listaProgramas: ProgramaOutDTO[] = [];
    public lstFacultadOutDTO: FacultadOutDTO[] = [];
	public lstPeriodoAcademicosTodos: PeriodoAcademicoOutDTO[] = [];
    public lstPeriodoAcademicosSinVigente: PeriodoAcademicoOutDTO[] = [];
	public listaAsignaturas: any[] = [];

    public messages: Message[] = null;

    private periodoAcademicoVigente: PeriodoAcademicoOutDTO;

    constructor(
        private fb: FormBuilder,
        private programaService: ProgramaService,
        private planificacionManualService: PlanificacionManualService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public periodoAcademicoSharedService: PeriodoAcademicoSharedService,
		private asignaturaService:AsignaturaService,
        private spinnerService: SpinnerService
    ) {}

    public ngOnInit(): void {
        this.inicializarFormulario();
        this.obtenerPeriodoAcademico();

        this.programaService.consultarProgramasPermitidosPorUsuario().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                if(lstProgramaOutDTO.length === 0){
                    this.listaProgramas=[];
                }else{
                    this.listaProgramas=lstProgramaOutDTO;
                }
            },
            (error) => {
                console.error(error);
            }
        );
        this.limpiar();
    }

    private inicializarFormulario() {
        this.formulario = this.fb.group({
			periodo: [{value: null, disabled: true}],
			periodoAnterior: [{value: null}, Validators.required],
            idPrograma: [{ value: null }, Validators.required],
            lstIdAsignatura: [{ value: null, disabled: this.listaAsignaturas.length === 0 }]
        });
    }

	private obtenerPeriodoAcademico() {
		this.periodoAcademicoSharedService.consultarPeriodosAcademicos({} as any).subscribe(r => {
			this.lstPeriodoAcademicosTodos = r.content
            this.lstPeriodoAcademicosTodos = this.lstPeriodoAcademicosTodos.map(periodo => ({
                ...periodo,
                anioPeriodo: `${periodo.anio} - ${periodo.periodo}`
            }));

            //El periodo vigente se elimina de la lista cuando se consulta el vigente
            this.lstPeriodoAcademicosSinVigente = this.lstPeriodoAcademicosTodos.map(periodo => ({
                ...periodo,
                anioPeriodo: `${periodo.anio} - ${periodo.periodo}`
            }));		
            
            this.consultarPeriodoAcademicoVigente();
		})
	}

	public onProgramasChange(){      
        this.lstIdAsignatura().reset();  
		if(this.idPrograma().value){
			this.asignaturaService.consultarAsignaturasDeLosCursosPorIdPrograma(this.idPrograma().value).subscribe(
				(response: any) => {
					if(response.length === 0){
						this.listaAsignaturas=[];
                        this.formulario.get('lstIdAsignatura').disable();
                        
                        // Modal de error
                        this.mensajeError = 'No hay cursos asociados al programa seleccionado. Para continuar, realice primero la carga de labor docente para el programa.';
					    this.mostrarModalError = true;
                        this.tieneCursosAsociados = false;
					}else{
						this.listaAsignaturas = response.map((asignatura: any) => ({ nombre: asignatura.nombre, semestre: asignatura.semestre, idAsignatura:asignatura.idAsignatura }));
                        this.formulario.get('lstIdAsignatura').enable();

                        // Modal de error
                        this.mensajeError = '';                     
                        this.mostrarModalError = false;
                        this.tieneCursosAsociados = true;
                    }
				},
				(error) => {
					console.error(error);
                    this.tieneCursosAsociados = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Ocurrió un error al consultar los cursos del programa.',
                        detail: error.error.message,
                        life: 4000,
                    });
				}
				);
		}else{
			this.listaAsignaturas=[];
            this.formulario.get('lstIdAsignatura').disable();
		}  
    }

    private limpiar() {
        this.idPrograma().reset();
        this.lstIdAsignatura().reset();
        this.periodoAnterior().reset();
    }
	public periodo(): FormControl {
		return this.formulario.get("periodo") as FormControl
	}
	public periodoAnterior(): FormControl {
		return this.formulario.get("periodoAnterior") as FormControl
	}
    public idPrograma(): FormControl {
        return this.formulario.get('idPrograma') as FormControl;
    }
    public lstIdAsignatura(): FormControl {
        return this.formulario.get('lstIdAsignatura') as FormControl;
    }

    public lstMensajesDelProceso: string[]=[];
    public cantidadCursosHorarioCompleto: number=0;
    public cantidadCursosHorarioParcial: number=0;
    public cantidadCursosSinHorario: number=0;
    public cantidadCursosNoCorrelacionados: number=0;

    public generarHorario(): void {
        this.ocultarResultadoGeneracion=true;    
        if (this.formulario.valid) {
            this.isLoading = true
            let generarHorarioBaseInDTO = {
                idPrograma: this.idPrograma().value,
				idPeriodoAcademicoBase:this.periodoAnterior().value,
				lstIdAsignaturaExcluir:this.lstIdAsignatura().value,
            };

            let programaOutDTO: ProgramaOutDTO = this.listaProgramas.find(
                (programaOutDTO) => {
                    return (
                        programaOutDTO.idPrograma === generarHorarioBaseInDTO.idPrograma
                    );
                }
            );

            this.confirmationService.confirm({
                message: `¿Está seguro que desea generar el horario basado en el semestre anterior <strong>${this.periodoAcademicoVigente.anio}-${this.periodoAcademicoVigente.periodo}</strong> para el programa <strong>${programaOutDTO.nombre}</strong>?`,
                header: 'Confirmar generación',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.isLoading = true;
                    this.spinnerService.show("Generando horario, esto puede tardar unos minutos...");
                    this.planificacionManualService.generarHorarioBasadoEnSemestreAnteriorPorPrograma(generarHorarioBaseInDTO)
                    .subscribe(
                        (generarHorarioBaseOutDTO: any) => {
                                this.spinnerService.hide();
                                this.ocultarResultadoGeneracion=false;    
                                this.isLoading = false;
                                this.cantidadCursosHorarioCompleto=generarHorarioBaseOutDTO.cantidadCursosHorarioCompleto;
                                this.cantidadCursosHorarioParcial=generarHorarioBaseOutDTO.cantidadCursosHorarioParcial;
                                this.cantidadCursosSinHorario=generarHorarioBaseOutDTO.cantidadCursosSinHorario;
                                this.cantidadCursosNoCorrelacionados=generarHorarioBaseOutDTO.cantidadCursosNoCorrelacionados;
                                this.lstMensajesDelProceso=generarHorarioBaseOutDTO.lstMensajesDelProceso;
                                //this.mostrarResultadoGeneracion(this.listaErrores,this.cantidadCursosActualizados, this.cantidadCursosNoCorrelacionados);
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Se generó el horario base del programa con éxito.',
                                    life: 5000,
                                });
                                
                            },
                            (httpErrorResponse: HttpErrorResponse) => {
                                this.spinnerService.hide();
                                this.isLoading = false;
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error generación',
                                    detail: httpErrorResponse.error.message,
                                    life: 9000,
                                });
                            }
                        );
                },
                reject: () => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Operación cancelada',
                        detail: '',
                        life: 3000,
                    });
                },
                acceptLabel: 'Sí',
                rejectLabel: 'No',
            });
        } else {
            this.formulario.markAllAsTouched();
        }
    }

    private consultarPeriodoAcademicoVigente(): void {
        this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
                (periodoAcademicoVigente: PeriodoAcademicoOutDTO) => {
                    if (periodoAcademicoVigente) {
                        this.messages=null;
						this.periodoAcademicoVigente = periodoAcademicoVigente;            
						this.periodo().setValue(this.periodoAcademicoVigente.idPeriodoAcademico);
                        this.lstPeriodoAcademicosSinVigente = this.lstPeriodoAcademicosSinVigente.filter(periodo => periodo.idPeriodoAcademico!==this.periodoAcademicoVigente.idPeriodoAcademico);
                    }else{
                        this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá acceder a esta funcionalidad si no existe un periodo académico abierto." }];
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    public cerrarModalError() {
		this.mostrarModalError = false;
	}
}
