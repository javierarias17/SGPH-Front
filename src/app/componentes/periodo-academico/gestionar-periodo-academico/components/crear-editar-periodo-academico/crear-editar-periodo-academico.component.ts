import { Component, OnInit} from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { PeriodoAcademicoInDTO } from '../../model/in/periodo-academico-in-dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EstadoPeriodoAcademicoEnum } from 'src/app/componentes/common/enum/estado.periodo.academico.enum';
import { Observable, of } from 'rxjs';
import {  catchError, map } from 'rxjs/operators';
import { PeriodoAcademicoService } from '../../services/periodo.academico.service';


@Component({
  selector: 'app-crear-editar-periodo-academico',
  templateUrl: './crear-editar-periodo-academico.component.html'
})
export class CrearEditarPeriodoAcademicoComponent implements OnInit  {

    public formulario: FormGroup;
    public periodoAcademicoInDTO: PeriodoAcademicoInDTO;

    constructor(private ref: DynamicDialogRef, 
         private config: DynamicDialogConfig,
         private formBuilder: FormBuilder,
         private messageService: ShowMessageService,
         private periodoAcademicoService:PeriodoAcademicoService) { }

    public ngOnInit(): void {
        this.periodoAcademicoInDTO=new PeriodoAcademicoInDTO();
        this.inicializarFormulario();
        if(this.config.data?.periodoAcademicoOutDTO){
            this.periodoAcademicoInDTO.idPeriodoAcademico = this.config.data.periodoAcademicoOutDTO.idPeriodoAcademico;
            this.periodoAcademicoInDTO.fechaInicioPeriodo = this.config.data.periodoAcademicoOutDTO.fechaInicioPeriodo;
            this.periodoAcademicoInDTO.fechaFinPeriodo = this.config.data.periodoAcademicoOutDTO.fechaFinPeriodo;
            this.periodoAcademicoInDTO.anio = this.config.data.periodoAcademicoOutDTO.anio;
            this.periodoAcademicoInDTO.periodo = this.config.data.periodoAcademicoOutDTO.periodo;
            this.periodoAcademicoInDTO.estado = this.config.data.periodoAcademicoOutDTO.estado;
        }else{
            this.periodoAcademicoInDTO.estado = EstadoPeriodoAcademicoEnum.ABIERTO;
        }
        this.asignarDatosFormulario();
    }

    public asignarDatosFormulario():void{
        this.fechaInicioPeriodo().setValue(this.periodoAcademicoInDTO.fechaInicioPeriodo? new Date(this.periodoAcademicoInDTO.fechaInicioPeriodo): null);
        this.fechaFinPeriodo().setValue(this.periodoAcademicoInDTO.fechaFinPeriodo? new Date(this.periodoAcademicoInDTO.fechaFinPeriodo):null);
        this.anio().setValue(this.periodoAcademicoInDTO.anio);
        this.periodo().setValue(this.periodoAcademicoInDTO.periodo);
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            fechaInicioPeriodo: [null, [Validators.required],[this.fechaInicioValidator()]],
            fechaFinPeriodo: [null, [Validators.required], [this.fechaFinValidator()]],
            anio: [null, [Validators.required, Validators.min(2020), Validators.max(2050)], [this.anioValidator()]],
            periodo: [ null, [Validators.required, Validators.min(0), Validators.max(2)],[this.anioValidator()]]
        })
    }
    
    private fechaInicioValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.periodoAcademicoService.guardarPeriodoAcademico(this.periodoAcademicoInDTO).pipe(
                map(() => null),  // Si no hay error, no hay validación que agregar
                catchError((error) => {
                    if (error.status === 400) {
                        for (let key in error.error) {  // Acceder a error.error para obtener el objeto de errores
                            if (key === 'FechaInicioGreaterThanUltimaFechaFin') {
                                return of({ "FechaInicioGreaterThanUltimaFechaFin": error.error[key] });
                            }
                        }
                    }
                    return of(null);  // En caso de otros errores, no validamos nada.
                })
            );
        };
    }

    private fechaFinValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.periodoAcademicoService.guardarPeriodoAcademico(this.periodoAcademicoInDTO).pipe(
                map(() => null),
                catchError((error) => {
                    if (error.status === 400) {
                        for (let key in error.error) {
                            if (key === 'FechaFinGreaterThanFechaInicio') {
                                return of({ "FechaFinGreaterThanFechaInicio": error.error[key] });
                            }
                        }
                    }
                    return of(null);
                })
            );
        };
    } 

    private anioValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.periodoAcademicoService.guardarPeriodoAcademico(this.periodoAcademicoInDTO).pipe(
                map(() => null),
                catchError((error) => {
                    if (error.status === 400) {
                        for (let key in error.error) {
                            if (key === 'ExistsByAnioAndPeriodo') {
                                return of({ "ExistsByAnioAndPeriodo": error.error[key] });
                            }
                        }
                    }
                    return of(null);
                })
            );
        };
    }

    public fechaInicioPeriodo():FormControl{
        return this.formulario.get("fechaInicioPeriodo") as FormControl;
    }
    public fechaFinPeriodo():FormControl{
        return this.formulario.get("fechaFinPeriodo") as FormControl;
    }
    public anio():FormControl{
        return this.formulario.get("anio") as FormControl;
    }
    public periodo():FormControl{
        return this.formulario.get("periodo") as FormControl;
    }
    
    public validarYGuardarPeriodoAcademico() {

        if (this.formulario.valid) { 
            this.periodoAcademicoInDTO.esValidar=false;
            this.periodoAcademicoInDTO.fechaInicioPeriodo = this.fechaInicioPeriodo().value;
            this.periodoAcademicoInDTO.fechaFinPeriodo = this.fechaFinPeriodo().value;
            this.periodoAcademicoInDTO.anio = this.anio().value;
            this.periodoAcademicoInDTO.periodo = this.periodo().value;            
            this.guardarPeriodoAcademico();     
        }else{
            this.formulario.markAllAsTouched();
        }
    }


    private guardarPeriodoAcademico():void{
        this.periodoAcademicoService.guardarPeriodoAcademico(this.periodoAcademicoInDTO).subscribe({
            next: (r) => {
                    this.messageService.showMessage("success", "Periodo Académico guardado")
                    this.ref.close()
            },
            error: (r) => {
                let errorMessages = 'Error al guardar: ';
                for (let key in r.error) {                    
                    if (r.error.hasOwnProperty(key)) {
                        errorMessages += `${r.error[key]} `;
                    }
                }
                this.messageService.showMessage("error", errorMessages.trim());
            }
        })
    }

    public  validarCamposBackendPeriodoAcademico():void{
        this.periodoAcademicoInDTO.esValidar=true;
        this.periodoAcademicoInDTO.fechaInicioPeriodo = this.fechaInicioPeriodo().value;
        this.periodoAcademicoInDTO.fechaFinPeriodo = this.fechaFinPeriodo().value;
        this.periodoAcademicoInDTO.anio = this.anio().value;
        this.periodoAcademicoInDTO.periodo = this.periodo().value;   

        this.formulario.controls['fechaInicioPeriodo'].updateValueAndValidity();
        this.formulario.controls['fechaFinPeriodo'].updateValueAndValidity();
        this.formulario.controls['anio'].updateValueAndValidity();
        this.formulario.controls['periodo'].updateValueAndValidity();
    }
   
    public salir() {
        this.ref.close()
    }
}