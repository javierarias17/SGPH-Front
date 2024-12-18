import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FacultadOutDTO } from 'src/app/componentes/common/model/facultad/out/facultad.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { FacultadService } from 'src/app/componentes/common/services/facultad.service';
import { AgrupadorService } from '../../services/agrupador.service';
import { catchError, map, Observable, of } from 'rxjs';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/agrupador.espacio.fisico.dto';

@Component({
    selector: 'app-crear-editar-grupo',
    templateUrl: './crear-editar-grupo.component.html'
})
export class CrearEditarGrupoComponent implements OnInit {
    lectura: boolean;
    formulario: FormGroup;
    grupo: AgrupadorEspacioFisicoDTO;
    public lstFacultadOutDTO: FacultadOutDTO[] = [];
    constructor(
        private facultadService: FacultadService,
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        private agrupadorService: AgrupadorService,
        private messageService: ShowMessageService,
        private ref: DynamicDialogRef
    ) {}
    ngOnInit(): void {
        this.inicializarFormulario();
        this.obtenerFacultades();
        this.grupo = this.config.data?.grupo;
        if (this.grupo) {
            this.lectura = false;
            this.setDatosFormulario();
        }
    }

    private existeNombreAgrupadorValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            
            if (!this.formulario) {
                return of(null); 
            }
            
            let grupo: AgrupadorEspacioFisicoDTO = this.formulario.value;
            grupo.nombre = this.nombre().value;
            grupo.observacion = this.observacion().value;
            grupo.idFacultad = this.idFacultad().value;
            grupo.idAgrupadorEspacioFisico =
                this.grupo?.idAgrupadorEspacioFisico;
            grupo.esValidar = true;            
            
            return this.agrupadorService.guardarGrupo(grupo).pipe(
                map(() => null),  // Si no hay error, la validación pasa
                catchError((error) => {
                    if (error.status === 400) {  // Si es un BadRequest (400) se procesa el error
                        for (let key in error.error) {  // Accedemos a error.error para obtener los detalles
                            if (key === 'ExisteNombreAgrupador') {
                                return of({ "ExisteNombreAgrupador": error.error[key] });
                            }
                        }
                    }
                    return of(null);  // En caso de otros errores, devolvemos null
                })
            );
        };
    }  

    public  validarCamposBackendUsuarioYPersona():void{
        this.formulario.controls['lstIdPrograma'].updateValueAndValidity();
    }

    onFacultadChange() {
        if (this.idFacultad().value !== null) {
        } else {
            this.limpiar();
        }
    }
    setDatosFormulario() {
        this.nombre().setValue(this.grupo.nombre);
        this.idFacultad().setValue(this.grupo.idFacultad);
        this.observacion().setValue(this.grupo.observacion);
    }
    inicializarFormulario() {
        this.formulario = this.fb.group({
            idFacultad: [{ value: '' }, Validators.required],
            nombre: [{ value: '' }, Validators.required, this.existeNombreAgrupadorValidator()],
            observacion: [{ value: '' }, Validators.required],
        });
    }
    limpiar() {
        this.formulario.reset();
    }
    obtenerFacultades() {
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
    guardarGrupo() {
        if (this.formulario.valid) {
            let grupo: AgrupadorEspacioFisicoDTO = this.formulario.value;
            grupo.idAgrupadorEspacioFisico =
                this.grupo?.idAgrupadorEspacioFisico;
            grupo.esValidar = false;
            this.agrupadorService.guardarGrupo(grupo).subscribe({
                next: (r) => {
                    if (r) {
                        this.messageService.showMessage(
                            'success',
                            'Agrupador guardado correctamente'
                        );
                        this.ref.close();
                    }
                },
            });
        } else {
            this.formulario.markAllAsTouched();
        }
    }
    salir() {
        this.ref.close();
    }
    guardar() {}

    idFacultad(): FormControl {
        return this.formulario.get('idFacultad') as FormControl;
    }
    nombre(): FormControl {
        return this.formulario.get('nombre') as FormControl;
    }
    observacion(): FormControl {
        return this.formulario.get('observacion') as FormControl;
    }
}
