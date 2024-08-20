import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ProgramaService } from '../../servicios/programa.service';
import { PlanificacionManualService } from '../../servicios/planificacion.manual.service';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { PeriodoAcademicoOutDTO } from '../../dto/periodo-academico/periodo-academico-out-dto';
import { FacultadService } from '../../servicios/facultad.service';

@Component({
    selector: 'app-eliminar-horario-programa',
    templateUrl: './eliminar-horario-programa.component.html',
    styleUrls: ['./eliminar-horario-programa.component.scss'],
    providers: [PlanificacionManualService],
})
export class EliminarHorarioProgramaComponent {
    public formulario: FormGroup;
    public isLoading: boolean = false;

    public listaProgramas: ProgramaOutDTO[] = [];
    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    private periodoAcademicoVigente:PeriodoAcademicoOutDTO;

    public mostrarAlerta: boolean = false;
    public messages: Message[] = null;

    constructor(
        private fb: FormBuilder,
        private programaService: ProgramaService,
        private facultadService: FacultadService,
        private planificacionManualService: PlanificacionManualService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public periodoAcademicoService:PeriodoAcademicoService
    ) {}

    public ngOnInit(): void {
        this.consultarPeriodoAcademicoVigente();
        this.inicializarFormulario();
        this.obtenerFacultades();
    }

    private inicializarFormulario() {
        this.formulario = this.fb.group({
            idFacultad: [{ value: null }, Validators.required],
            idPrograma: [{ value: null }, Validators.required],
        });
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

    private limpiar() {
        this.formulario.reset();
    }

    public idFacultad(): FormControl {
        return this.formulario.get('idFacultad') as FormControl;
    }
    public idPrograma(): FormControl {
        return this.formulario.get('idPrograma') as FormControl;
    }

    public eliminar(): void {
        if (this.formulario.valid) {
            let eliminarHorarioInDTO = {
                idPrograma: this.idPrograma().value,
            };


            let programaOutDTO:ProgramaOutDTO = this.listaProgramas.find(programaOutDTO=> {
                return programaOutDTO.idPrograma===eliminarHorarioInDTO.idPrograma
            });

            this.confirmationService.confirm({
                message:
                    (`¿Está seguro que desea eliminar todo el horario <strong>${this.periodoAcademicoVigente.anio}-${this.periodoAcademicoVigente.periodo}</strong> para el programa <strong>${programaOutDTO.nombre}</strong>?`),
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.isLoading = true;
                    this.planificacionManualService
                        .eliminarHorarioPrograma(eliminarHorarioInDTO)
                        .subscribe(
                            (r: Boolean) => {
                                this.isLoading = false;
                                if (r === true) {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: 'Se eliminó el horario del programa con éxito.',
                                        life: 5000,
                                    });
                                }
                            },
                            (httpErrorResponse: HttpErrorResponse) => {
                                this.isLoading = false;
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Fallido',
                                    detail:
                                        'Se produjo un error al eliminar el horario del programa: ' +
                                        httpErrorResponse.error.message,
                                    life: 9000,
                                });
                            }
                        );
                },
                reject: () => {
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

    private consultarPeriodoAcademicoVigente():void{
        this.periodoAcademicoService.consultarPeriodoAcademicoVigente().subscribe(
            (periodoAcademicoVigente: PeriodoAcademicoOutDTO) => {
                if(periodoAcademicoVigente){
                    this.periodoAcademicoVigente = periodoAcademicoVigente;
                    this.mostrarAlerta = false;
                }else{
                    this.mostrarAlerta = true;
                    this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá visualizar esta funcionalidad si no existe un periodo académico abierto." }];
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }
}
