import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { PlanificacionManualServicio } from '../../servicios/planificacion.manual.servicio';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { PeriodoAcademicoOutDTO } from '../../dto/periodo-academico/periodo-academico-out-dto';

@Component({
    selector: 'app-eliminar-horario-programa',
    templateUrl: './eliminar-horario-programa.component.html',
    styleUrls: ['./eliminar-horario-programa.component.scss'],
    providers: [PlanificacionManualServicio],
})
export class EliminarHorarioProgramaComponent {
    public formulario: FormGroup;
    public isLoading: boolean = false;

    public listaProgramas: ProgramaOutDTO[] = [];
    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    private periodoAcademicoVigente:PeriodoAcademicoOutDTO;

    constructor(
        private fb: FormBuilder,
        private programaServicio: ProgramaServicio,
        private facultadServicio: FacultadServicio,
        private sharedService: SharedService,
        private dialogService: DialogService,
        private planificacionManualServicio: PlanificacionManualServicio,
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
            let eliminarHorarioDTO = {
                idPrograma: this.idPrograma().value,
            };


            let programaOutDTO:ProgramaOutDTO = this.listaProgramas.find(programaOutDTO=> {
                return programaOutDTO.idPrograma===eliminarHorarioDTO.idPrograma
            });

            this.confirmationService.confirm({
                message:
                    (`¿Está seguro que desea eliminar todo el horario <strong>${this.periodoAcademicoVigente.anio}-${this.periodoAcademicoVigente.periodo}</strong> para el programa <strong>${programaOutDTO.nombre}</strong>?`),
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.isLoading = true;
                    this.planificacionManualServicio
                        .eliminarHorarioPrograma(eliminarHorarioDTO)
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
                }
            },
            (error) => {
                console.error(error);
            }
        );        
    }
}
