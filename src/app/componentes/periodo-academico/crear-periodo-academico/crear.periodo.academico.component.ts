import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
    selector: 'app-crear-periodo-academico',
    templateUrl: './crear.periodo.academico.component.html',
    styleUrls: ['./crear.periodo.academico.component.css'],
    providers: [ConfirmationService, MessageService]
})
export class CrearPeriodoAcademicoComponent {

    public formulario: FormGroup;

    constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }

    public ngOnInit(): void {
        this.formulario = this.formBuilder.group({
            fechaInicio: [null, Validators.required],
            fechaFin: [null, Validators.required],
            anioPeriodo: [null, Validators.compose([Validators.required, Validators.min(2020), Validators.max(2050)])],
            numeroPeriodo: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])]
        });
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