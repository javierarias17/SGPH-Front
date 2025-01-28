import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { DocenteOutDTO } from 'src/app/componentes/datos/gestionar-docente/model/out/docente.out.dto';
import { TipoIdentificacionOutDTO } from 'src/app/componentes/seguridad/gestionar-usuario/model/out/tipo.identificacion.out.dto';
import { UsuarioService } from 'src/app/componentes/common/services/usuario.service';
import { DocenteService } from 'src/app/componentes/common/services/docente.service';
import { PersonaService } from 'src/app/componentes/common/services/persona.service';
import { EstadoDocenteEnum } from 'src/app/componentes/common/enum/estado.docente.enum';
import { PersonaInDTO } from '../../../gestionar-persona/model/in/persona.in.dto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-crear-editar-docente',
  templateUrl: './crear-editar-docente.component.html',
  styleUrls: ['./crear-editar-docente.component.scss']
})
export class CrearEditardocenteComponent implements OnInit {


  docente: DocenteOutDTO
  registrandodocente: boolean
  formulario: FormGroup
  lectura: boolean
  tiposIdentificacion: TipoIdentificacionOutDTO[]
  constructor(
    private ref: DynamicDialogRef,     
    private config: DynamicDialogConfig,
    private docenteService: DocenteService,
    private fb: FormBuilder,
    private messageSerivce: ShowMessageService,
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private message: MessageService,
  ) {}

  ngOnInit(): void {
    console.log('Config data recibida en hijo:', this.config.data); // Depura para verificar los datos recibidos
    this.obtenerIdentificaciones();
    this.lectura = this.config.data.lectura;
    this.inicializarFormulario();
  
    // Solo en el modo edición (si se envían datos para editar)
    if (this.config.data?.idTipoIdentificacion) {
      this.docenteService
        .consultarDocentePorIdentificacion(
          this.config.data.idTipoIdentificacion,
          this.config.data.numeroIdentificacion
        )
        .subscribe({
          next: (docente) => {
            this.docente = docente;
            this.asignarDatosFormulario(); // Asignar datos al formulario en edición
          },
          error: (err) => console.error('Error al consultar docente:', err),
        });
    } else {
      console.log('Creación: No hay datos para asignar al formulario');
    }
  }
  
  obtenerIdentificaciones() {
    this.personaService.consultarTiposIdentificacion().subscribe(
      (lstTipoIdentificacionOutDTO: TipoIdentificacionOutDTO[]) => {               
          this.tiposIdentificacion = lstTipoIdentificacionOutDTO;
      },
      (error) => {
        console.error(error);
      }
    )
  }

  asignarDatosFormulario() {
    if (this.docente) {
      console.log('Asignando datos del docente al formulario:', this.docente);
      this.formulario.patchValue({
        idTipoIdentificacion: this.docente.idTipoIdentificacion,
        idDocente: this.docente.idDocente || null, // Opcional si se está creando
        numeroIdentificacion: this.docente.numeroIdentificacion,
        primerNombre: this.docente.primerNombre,
        segundoNombre: this.docente.segundoNombre,
        primerApellido: this.docente.primerApellido,
        segundoApellido: this.docente.segundoApellido,
        email: this.docente.email,
        codigo: this.docente.codigo
      });
    }
  }
  
  inicializarFormulario() {
    this.formulario = this.fb.group({
      idTipoIdentificacion: [null, Validators.required],
      numeroIdentificacion: [
        null,
        [Validators.required, Validators.pattern(/^\d+$/)], // Solo números
      ],
      primerNombre: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)], // Solo letras y espacios
      ],
      segundoNombre: [
        null,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), // Solo letras y espacios (opcional)
      ],
      primerApellido: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)], // Solo letras y espacios
      ],
      segundoApellido: [
        null,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), // Solo letras y espacios (opcional)
      ],
      codigo: [
        null,
        [Validators.required, Validators.pattern(/^\d+$/)], // Solo números
      ],
      email: [
        null,
        [Validators.required, Validators.email], // Formato de correo electrónico
      ],
    });
    
    console.log("Errores del formulario:", this.formulario.errors);
    console.log("Estado del formulario:", this.formulario.status);
    Object.keys(this.formulario.controls).forEach((key) => {
      const controlErrors = this.formulario.get(key)?.errors;
      if (controlErrors) {
        console.log(`Errores en ${key}:`, controlErrors);
      }
    });

  }
  
  limpiar() {
    this.formulario.reset()
  }
  
  guardardocente() {
    console.log('Estado del formulario:', this.formulario.valid); // Depura el estado del formulario
    console.log('Valores del formulario:', this.formulario.value); // Depura los valores actuales
  
    if (this.formulario.valid) {
      // Mapear datos del formulario a Docente
      this.docente = this.formulario.value;
      this.docente.idPersona = this.config.data?.id; // Puede ser null si es nuevo
      this.docente.estado = EstadoDocenteEnum.ACTIVO;
      this.docente.esValidar = false;
  
      // Verificar si la persona ya existe (idPersona no es null)
      if (!this.docente.idPersona) {
        // Mapear los datos del formulario a PersonaInDTO
        const personaInDTO: PersonaInDTO = {
          idPersona: null, // Es nuevo, no tiene id
          idTipoIdentificacion: this.docente.idTipoIdentificacion,
          numeroIdentificacion: this.docente.numeroIdentificacion,
          primerNombre: this.docente.primerNombre,
          segundoNombre: this.docente.segundoNombre,
          primerApellido: this.docente.primerApellido,
          segundoApellido: this.docente.segundoApellido,
          email: this.docente.email,
          esValidar: false,
        };
  
        console.log('Guardando nueva persona con datos:', personaInDTO);
  
        // Guardar la persona antes de guardar el docente
        this.personaService.guardarPersona(personaInDTO).subscribe({
          next: (personaOutDTO) => {
            console.log('Persona guardada correctamente:', personaOutDTO);
  
            // Asignar el ID de la persona recién creada al docente
            this.docente.idPersona = personaOutDTO.idPersona;
  
            // Proceder a guardar el docente
            this.guardarDocenteFinal(this.docente);
          },
          error: (error) => {
            if (error.error && Array.isArray(error.error)) {
              const mensajes = error.error
                .map((err: any) =>
                  `${err.field ? `${err.field}: ` : ''}${err.defaultMessage}`
                )
                .join(', ');
              this.message.add({
                severity: 'error',
                summary: 'Error al guardar persona',
                detail: mensajes,
              });
            } else {
              this.message.add({
                severity: 'error',
                summary: 'Error al guardar persona',
                detail: 'Ocurrió un error inesperado',
              });
            }
            console.error('Error al guardar persona:', error);
          },
        });
      } else {
        // Si la persona ya existe, solo guardar el docente
        console.log('Persona ya existe. Procediendo a guardar el docente:', this.docente);
        this.guardarDocenteFinal(this.docente);
      }
    } else {
      console.log('Formulario inválido. Corrige los errores:', this.formulario.errors);
      this.formulario.markAllAsTouched(); // Marca todos los campos para mostrar mensajes de error
    }
  }
  
  // Método para guardar el docente
  private guardarDocenteFinal(docente: DocenteOutDTO) {
    this.docenteService.guardarDocente(docente).subscribe({
      next: (r) => {
        this.messageSerivce.showMessage('success', 'Docente guardado');
        this.ref.close({ status: 'success' });
      },
      error: (error) => {
        if (error.error && Array.isArray(error.error)) {
          const mensajes = error.error
            .map((err: any) =>
              `${err.field ? `${err.field}: ` : ''}${err.defaultMessage}`
            )
            .join(', ');
          this.message.add({
            severity: 'error',
            summary: 'Error al guardar docente',
            detail: mensajes,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Error al guardar docente',
            detail: 'Ocurrió un error inesperado',
          });
        }
        console.error('Error al guardar docente:', error);
      },
    });
  }
  
   salir() {
    this.ref.close()
   }
   idTipoIdentificacion(): FormControl {
    return this.formulario.get('idTipoIdentificacion') as FormControl
   }
   numeroIdentificacion(): FormControl {
    return this.formulario.get('numeroIdentificacion') as FormControl
   }
   primerNombre(): FormControl {
    return this.formulario.get('primerNombre') as FormControl
   }
   segundoNombre(): FormControl {
    return this.formulario.get('segundoNombre') as FormControl
   }
   primerApellido(): FormControl {
    return this.formulario.get('primerApellido') as FormControl
   }
   segundoApellido(): FormControl {
    return this.formulario.get('segundoApellido') as FormControl
   }
   email(): FormControl {
    return this.formulario.get('email') as FormControl
   }
   validateOnlyNumbers(event: any, controlName: string) {
    const value = event.target.value;
    const regex = /^[0-9]*$/; // Solo números
    if (!regex.test(value)) {
        this.formulario.get(controlName)?.setErrors({ invalidCharacters: true });
    } else {
        this.formulario.get(controlName)?.setErrors(null);
    }
  }

  validateOnlyLetters(event: any, controlName: string) {
      const value = event.target.value;
      const regex = /^[a-zA-Z\s]*$/; // Solo letras y espacios
      if (!regex.test(value)) {
          this.formulario.get(controlName)?.setErrors({ invalidCharacters: true });
      } else {
          this.formulario.get(controlName)?.setErrors(null);
      }
  }

}
