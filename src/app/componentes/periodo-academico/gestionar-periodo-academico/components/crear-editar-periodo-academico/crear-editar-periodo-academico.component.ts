import { Component, OnInit} from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/dto/periodo-academico/periodo-academico-out-dto';
import { PeriodoAcademicoInDTO } from '../../model/periodo-academico-in-dto';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EstadoPeriodoAcademicoEnum } from 'src/app/componentes/enum/estado.periodo.academico.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crear-editar-periodo-academico',
  templateUrl: './crear-editar-periodo-academico.component.html',
  styleUrls: ['./crear-editar-periodo-academico.component.scss']
})
export class CrearEditarPeriodoAcademicoComponent implements OnInit  {

    public formulario: FormGroup;
    public periodoAcademicoInDTO: PeriodoAcademicoInDTO;

    private fechaInicioGreaterThanUltimaFechaFin:string = null;
    private fechaFinGreaterThanFechaInicio:string = null;
    private existsByAnioAndPeriodo:string = null;

    private fechaInicioPeriodoAntes=null;
    private fechaFinPeriodoAntes=null;
    private anioAntes=null;
    private periodoAntes=null;

    constructor(private ref: DynamicDialogRef, 
         private config: DynamicDialogConfig,
         private formBuilder: FormBuilder,
         private confirmationService: ConfirmationService, 
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
            fechaInicioPeriodo: [null, [Validators.required, this.fechaInicioValidator()]],
            fechaFinPeriodo: [null, [Validators.required, this.fechaFinValidator()]],
            anio: [null, [Validators.required, Validators.min(2020), Validators.max(2050), this.anioValidator()]],
            periodo: [ null, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])]
        })
    }

    private fechaInicioValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: string} | null => {
                if(this.fechaInicioGreaterThanUltimaFechaFin !== null){
                return { 'FechaInicioGreaterThanUltimaFechaFin': this.fechaInicioGreaterThanUltimaFechaFin};       
            }         
            return null;
        };
    }

    private fechaFinValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: string}  | null => {
            if (this.fechaFinGreaterThanFechaInicio !== null) {
                return { 'FechaFinGreaterThanFechaInicio': this.fechaFinGreaterThanFechaInicio };
            }
            return null;
        };
    }

    private anioValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: string} | null => {
            if (this.existsByAnioAndPeriodo !== null) {
                return { 'ExistsByAnioAndPeriodo': this.existsByAnioAndPeriodo };
            }
            return null;
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
    
    public validarCamposBackendPeriodoAcademico(){
        this.periodoAcademicoInDTO.esValidar=true;

        if(this.anioAntes != this.anio().value ? this.anio().value:null){
            this.periodoAcademicoInDTO.anio = this.anio().value ? this.anio().value:null;
            this.anioAntes = this.periodoAcademicoInDTO.anio;
            this.guardarPeriodoAcademico(true);
        } 
        
        if( this.periodoAntes != this.periodo().value ? this.periodo().value:null ){
            this.periodoAcademicoInDTO.periodo = this.periodo().value ? this.periodo().value:null;
            this.periodoAntes =this.periodoAcademicoInDTO.periodo;
            this.guardarPeriodoAcademico(true);
        }
        
        if( this.fechaInicioPeriodoAntes != this.fechaInicioPeriodo().value? this.fechaInicioPeriodo().value.toString():null ){     
            this.periodoAcademicoInDTO.fechaInicioPeriodo = this.fechaInicioPeriodo().value? this.fechaInicioPeriodo().value:null;
            this.fechaInicioPeriodoAntes =this.periodoAcademicoInDTO.fechaInicioPeriodo;
            this.guardarPeriodoAcademico(true);
        }


        if( this.fechaFinPeriodoAntes != this.fechaFinPeriodo().value ?this.fechaFinPeriodo().value.toString():null ){
            this.periodoAcademicoInDTO.fechaFinPeriodo = this.fechaFinPeriodo().value ?this.fechaFinPeriodo().value:null;
            this.fechaFinPeriodoAntes =this.periodoAcademicoInDTO.fechaFinPeriodo;
            this.guardarPeriodoAcademico(true);
        }


    }

    public validarYGuardarPeriodoAcademico() {

        if (this.formulario.valid) { 
            this.periodoAcademicoInDTO.esValidar=false;
            this.periodoAcademicoInDTO.fechaInicioPeriodo = this.fechaInicioPeriodo().value;
            this.periodoAcademicoInDTO.fechaFinPeriodo = this.fechaFinPeriodo().value;
            this.periodoAcademicoInDTO.anio = this.anio().value;
            this.periodoAcademicoInDTO.periodo = this.periodo().value;            
            this.guardarPeriodoAcademico(false);     
        }else{
            this.formulario.markAllAsTouched();
        }
    }


    private guardarPeriodoAcademico(esValidacion:Boolean):void{
        this.fechaInicioGreaterThanUltimaFechaFin=null;
        this.fechaFinGreaterThanFechaInicio=null;
        this.existsByAnioAndPeriodo=null;
        this.periodoAcademicoService.guardarPeriodoAcademico(this.periodoAcademicoInDTO).subscribe({
            next: (r) => {
                if(esValidacion===false){
                    this.messageService.showMessage("success", "Periodo Académico guardado")
                    this.ref.close()
                }
            },
            error: (r) => {
                let errorMessages = 'Error al guardar: ';
                for (let key in r.error) {                    
                    if(key==="FechaInicioGreaterThanUltimaFechaFin"){
                        this.fechaInicioGreaterThanUltimaFechaFin = r.error[key];
                        //this.fechaInicioPeriodo().updateValueAndValidity();
                    }else if(key==="FechaFinGreaterThanFechaInicio"){
                        this.fechaFinGreaterThanFechaInicio = r.error[key];
                        //this.fechaFinPeriodo().updateValueAndValidity();
                    }else if(key==="ExistsByAnioAndPeriodo"){
                        this.existsByAnioAndPeriodo = r.error[key];
                        //this.anio().updateValueAndValidity();
                        //this.periodo().updateValueAndValidity();
                    }

                    if (r.error.hasOwnProperty(key)) {
                        errorMessages += `${r.error[key]} `;
                    }
                }

                if(esValidacion===false){
                    this.messageService.showMessage("error", errorMessages.trim());
                }
            }
        })
    }

   
    public salir() {
        this.ref.close()
    }



}