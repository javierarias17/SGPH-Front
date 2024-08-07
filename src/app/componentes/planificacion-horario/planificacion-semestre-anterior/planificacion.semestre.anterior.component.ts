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
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PlanificacionManualService } from '../../servicios/planificacion.manual.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgramaService } from '../../servicios/programa.service';
import { AsignaturaService } from '../../servicios/asignatura.service';
import { ResultadoGeneracionHorarioComponent } from './resultado-generacion-horario/resultado-generacion-horario.component';
import { FacultadService } from '../../servicios/facultad.service';

@Component({
    selector: 'app-planificacion-semestre-anterior',
    templateUrl: './planificacion.semestre.anterior.component.html',
    styleUrls: ['./planificacion.semestre.anterior.component.css'],
	providers: [PlanificacionManualService, AsignaturaService]
})
export class PlanificacionSemestreAnteriorComponent {
    public formulario: FormGroup;
    public isLoading: boolean = false;
    public ocultarResultadoGeneracion:boolean =true;

    public listaProgramas: ProgramaOutDTO[] = [];
    public lstFacultadOutDTO: FacultadOutDTO[] = [];
	public lstPeriodoAcademicosTodos: PeriodoAcademicoOutDTO[] = [];
    public lstPeriodoAcademicosSinVigente: PeriodoAcademicoOutDTO[] = [];
	public listaAsignaturas: any[] = [];
    public messages: Message[] = null;

    public periodoAcademicoVigente: PeriodoAcademicoOutDTO;

    constructor(
        private fb: FormBuilder,
        private programaService: ProgramaService,
        private facultadService: FacultadService,
        private dialogService: DialogService,
        private planificacionManualService: PlanificacionManualService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public periodoAcademicoService: PeriodoAcademicoService,
		private asignaturaService:AsignaturaService
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
        this.facultadService.consultarFacultades().subscribe(
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
            this.programaService
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
			this.asignaturaService.consultarAsignaturasPorIdPrograma(this.idPrograma().value).subscribe(
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
                    this.planificacionManualService.generarHorarioBasadoEnSemestreAnteriorPorPrograma(generarHorarioBaseInDTO)
                    .subscribe(
                        (generarHorarioBaseOutDTO: any) => {
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
        this.periodoAcademicoService.consultarPeriodoAcademicoVigente().subscribe(
                (periodoAcademicoVigente: PeriodoAcademicoOutDTO) => {
                    if (periodoAcademicoVigente) {
						this.periodoAcademicoVigente = periodoAcademicoVigente;            
						this.periodo().setValue(this.periodoAcademicoVigente.idPeriodoAcademico);
                        this.lstPeriodoAcademicosSinVigente = this.lstPeriodoAcademicosSinVigente.filter(periodo => periodo.idPeriodoAcademico!==this.periodoAcademicoVigente.idPeriodoAcademico);
                    }else{
                        this.periodoAcademicoVigente = undefined;
                        this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá visualizar esta funcionalidad si no existe un periodo académico abierto." }];
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    private mostrarResultadoGeneracion(listaErrores: string[],cantidadCursosActualizados: number,cantidadCursosNoCorrelacionados: number):void  {
        const ref = this.dialogService.open(ResultadoGeneracionHorarioComponent, {
          height: 'auto',
          width: '800px',
          header: 'Resultado generación horario',
          closable: true,
          data: {
            listaErrores: listaErrores,
            cantidadCursosActualizados: cantidadCursosActualizados,
            cantidadCursosNoCorrelacionados: cantidadCursosNoCorrelacionados
          }
        },)
    }
}
