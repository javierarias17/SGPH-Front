import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/dto/periodo-academico/periodo-academico-out-dto';

@Component({
  selector: 'app-crear-editar-periodo-academico',
  templateUrl: './crear-editar-periodo-academico.component.html',
  styleUrls: ['./crear-editar-periodo-academico.component.scss']
})
export class CrearEditarPeriodoAcademicoComponent implements OnInit {

    public formulario: FormGroup;
    public periodoAcademico: PeriodoAcademicoOutDTO;

    constructor(private formBuilder: FormBuilder,
         private confirmationService: ConfirmationService, 
         private messageService: MessageService) { }

    public ngOnInit(): void {
        this.inicializarFormulario();
    }

    public asignarDatosFormulario():void{
        this.fechaInicioPeriodo().setValue(this.periodoAcademico.fechaInicioPeriodo);
        this.fechaFinPeriodo().setValue(this.periodoAcademico.fechaFinPeriodo);
        this.anio().setValue(this.periodoAcademico.anio);
        this.periodo().setValue(this.periodoAcademico.periodo);
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            fechaInicioPeriodo: [null, Validators.required],
            fechaFinPeriodo: [null, Validators.required],
            anio: [null, Validators.compose([Validators.required, Validators.min(2020), Validators.max(2050)])],
            periodo: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])]
        })
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