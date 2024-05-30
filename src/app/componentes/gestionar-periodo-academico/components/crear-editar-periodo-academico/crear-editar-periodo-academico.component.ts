import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/dto/periodo-academico/periodo-academico-out-dto';

@Component({
  selector: 'app-crear-editar-periodo-academico',
  templateUrl: './crear-editar-periodo-academico.component.html',
  styleUrls: ['./crear-editar-periodo-academico.component.scss']
})
export class CrearEditarPeriodoAcademicoComponent {

    public formulario: FormGroup;
    public periodoAcademico: PeriodoAcademicoOutDTO;


    constructor(private formBuilder: FormBuilder,
         private confirmationService: ConfirmationService, 
         private messageService: MessageService) { }

    public ngOnInit(): void {
        this.inicializarFormulario();
        this.formulario = this.formBuilder.group({
            
        });
    }


    public asignarDatosFormulario():void{
        this.fechaInicio().setValue(this.periodoAcademico.fechaInicioPeriodo);
        this.fechaFin().setValue(this.periodoAcademico.fechaFinPeriodo);
        this.anioPeriodo().setValue(this.periodoAcademico.anio);
        this.numeroPeriodo().setValue(this.periodoAcademico.periodo);
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            fechaInicio: [null, Validators.required],
            fechaFin: [null, Validators.required],
            anioPeriodo: [null, Validators.compose([Validators.required, Validators.min(2020), Validators.max(2050)])],
            numeroPeriodo: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])]
        })
    }

    private fechaInicio():FormControl{
        return this.formulario.get("fechaInicio") as FormControl;
    }
    private fechaFin():FormControl{
        return this.formulario.get("fechaFin") as FormControl;
    }
    private anioPeriodo():FormControl{
        return this.formulario.get("anioPeriodo") as FormControl;
    }
    private numeroPeriodo():FormControl{
        return this.formulario.get("numeroPeriodo") as FormControl;
    }
    
    public onSubmit() {
        if (this.formulario.valid) {          
            this.confirmationService.confirm({
                message: '¿Estás seguro de que quieres crear este periodo académico?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  // Aquí pones el código para crear el periodo académico
                  console.log('Creando periodo académico...');
                  this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                },
                reject: () => {
                  this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                  // Aquí pones el código que quieres ejecutar si se rechaza la confirmación
                  console.log('Operación cancelada');
                }
              });       
        }else{
            console.log('Formulario Inválido. Datos:', this.formulario.value);
        }
    }
}