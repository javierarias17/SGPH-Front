import { Component } from '@angular/core';
import { PeriodoAcademicoOutDTO } from '../../dto/periodo-academico/periodo-academico-out-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PlanificacionManualServicio } from '../../servicios/planificacion.manual.servicio';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedService } from 'src/app/shared/service/shared.service';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { AsignaturaServicio } from '../../servicios/asignatura.servicio';

@Component({
    selector: 'app-planificacion-semestre-anterior',
    templateUrl: './planificacion.semestre.anterior.component.html',
    styleUrls: ['./planificacion.semestre.anterior.component.css'],
	providers: [PlanificacionManualServicio, AsignaturaServicio]
})
export class PlanificacionSemestreAnteriorComponent {
    public formulario: FormGroup;
    public isLoading: boolean = false;

    public listaProgramas: ProgramaOutDTO[] = [];
    public lstFacultadOutDTO: FacultadOutDTO[] = [];
	public lstPeriodoAcademicosTodos: PeriodoAcademicoOutDTO[] = [];
    public lstPeriodoAcademicosSinVigente: PeriodoAcademicoOutDTO[] = [];
	public listaAsignaturas: any[] = [];

    private periodoAcademicoVigente: PeriodoAcademicoOutDTO;

    constructor(
        private fb: FormBuilder,
        private programaServicio: ProgramaServicio,
        private facultadServicio: FacultadServicio,
        private sharedService: SharedService,
        private dialogService: DialogService,
        private planificacionManualServicio: PlanificacionManualServicio,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public periodoAcademicoService: PeriodoAcademicoService,
		private asignaturaServicio:AsignaturaServicio
    ) {}

    public ngOnInit(): void {
		this.inicializarFormulario();
        this.obtenerFacultades();
		this.obtenerPeriodoAcademico();
    }

    private inicializarFormulario() {
        this.formulario = this.fb.group({
			periodo: [{value: null, disabled: true}],
			periodoAnterior: [{value: null}, Validators.required],
            idFacultad: [{ value: null }, Validators.required],
            idPrograma: [{ value: null }, Validators.required],
            lstIdAsignatura: [{ value: null }]
        });
    }

	private obtenerPeriodoAcademico() {
		this.periodoAcademicoService.consultarPeriodosAcademicos({} as any).subscribe(r => {
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

    private obtenerFacultades() {
        this.facultadServicio.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.lstFacultadOutDTO = lstFacultadOutDTO.map(
                    (facultadOutDTO: FacultadOutDTO) => ({
                        abreviatura: facultadOutDTO.abreviatura,
                        nombre: facultadOutDTO.nombre,
                        idFacultad: facultadOutDTO.idFacultad,
                    })
                );
            },
            (error) => {
                console.error(error);
            }
        );
    }

    public onFacultadChange() {
        if (this.idFacultad().value !== null) {
            this.programaServicio
                .consultarProgramasPorIdFacultad([this.idFacultad().value])
                .subscribe(
                    (r: ProgramaOutDTO[]) => {
                        this.listaProgramas = r;
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            let idFacultades: number[] = [];
            idFacultades.push(this.idFacultad().value);
        } else {
            this.limpiar();
        }
    }

	public onProgramasChange(){        
		if(this.idPrograma().value){
			this.asignaturaServicio.consultarAsignaturasPorIdPrograma(this.idPrograma().value).subscribe(
				(response: any) => {
					if(response.length === 0){
						this.listaAsignaturas=[];
					}else{
						this.listaAsignaturas = response.map((asignatura: any) => ({ nombre: asignatura.nombre, semestre: asignatura.semestre, idAsignatura:asignatura.idAsignatura }));
					}
				},
				(error) => {
					console.error(error);
				}
				);
		}else{
			this.listaAsignaturas=[];
		}  
    }

    private limpiar() {
        this.idFacultad().reset();
        this.idPrograma().reset();
        this.lstIdAsignatura().reset();
    }
	public periodo(): FormControl {
		return this.formulario.get("periodo") as FormControl
	}
	public periodoAnterior(): FormControl {
		return this.formulario.get("periodoAnterior") as FormControl
	}
    public idFacultad(): FormControl {
        return this.formulario.get('idFacultad') as FormControl;
    }
    public idPrograma(): FormControl {
        return this.formulario.get('idPrograma') as FormControl;
    }
    public lstIdAsignatura(): FormControl {
        return this.formulario.get('lstIdAsignatura') as FormControl;
    }

    public listaErrores: string[]=[];
    public cantidadCursosActualizados: number=0;
    public cantidadCursosNoCorrelacionados: number=0;
    public generarHorario(): void {
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
                    this.planificacionManualServicio.generarHorarioBasadoEnSemestreAnteriorPorPrograma(generarHorarioBaseInDTO)
                    .subscribe(
                        (generarHorarioBaseOutDTO: any) => {
                                this.isLoading = false;
                                this.listaErrores=generarHorarioBaseOutDTO.lstMensajesDelProceso;
                                this.cantidadCursosActualizados = generarHorarioBaseOutDTO.cantidadCursosActualizados;
                                this.cantidadCursosNoCorrelacionados=generarHorarioBaseOutDTO.cantidadCursosNoCorrelacionados;
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Se generó el horario base del programa con éxito.',
                                    life: 5000,
                                });
                                
                            },
                            (httpErrorResponse: HttpErrorResponse) => {
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
        this.periodoAcademicoService
            .consultarPeriodoAcademicoVigente()
            .subscribe(
                (periodoAcademicoVigente: PeriodoAcademicoOutDTO) => {
                    if (periodoAcademicoVigente) {
						this.periodoAcademicoVigente = periodoAcademicoVigente;            
						this.periodo().setValue(this.periodoAcademicoVigente.idPeriodoAcademico);
                        this.lstPeriodoAcademicosSinVigente = this.lstPeriodoAcademicosSinVigente.filter(periodo => periodo.idPeriodoAcademico!==this.periodoAcademicoVigente.idPeriodoAcademico);
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
    }
}
