import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonaService } from 'src/app/componentes/common/services/persona.service';
import { PersonaOutDTO } from '../../model/out/persona.out.dto';

@Component({
  selector: 'app-crear-editar-consultar-eliminar-persona',
  templateUrl: './crear.editar.consultar.eliminar.persona.html',
})
export class CrearEditarPersonaComponent implements OnInit {
  formulario: FormGroup;
  listaTiposIdentificacion: any[] = [];
  lectura: boolean
  persona: PersonaOutDTO;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private personaService: PersonaService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    this.lectura = this.config.data.lectura || false; 
    this.inicializarFormulario();
    this.cargarTiposIdentificacion();
    if(this.config.data?.id  ){
      this.cargarPersona(this.config.data.id);
    }
    
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      idPersona: [null],
      tipoIdentificacion: [null, Validators.required],
      numeroIdentificacion: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(15)],
      ],
      primerNombre: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
      segundoNombre: ['', [Validators.maxLength(50)]],
      primerApellido: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
      segundoApellido: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  cargarTiposIdentificacion() {
    this.personaService.consultarTiposIdentificacion().subscribe({
      next: (data) => {
        this.listaTiposIdentificacion = data.map((tipo) => ({
          idTipoIdentificacion: tipo.idTipoIdentificacion,
          descripcion: tipo.tipoIdentificacion,
        }));
      },
      error: (err) => {
        console.error('Error al cargar tipos de identificación:', err);
      },
    });
  }

  guardarPersona() {
    if (this.formulario.valid) {
      const persona = this.formulario.getRawValue();
      console.log("PERSONA", persona);
      const esEdicion = !!persona.idPersona;
  
      const personaPayload = {
        ...this.formulario.value,
        idTipoIdentificacion: persona.tipoIdentificacion,
      };
      console.log("Payload enviado:", personaPayload);
      if (esEdicion) { 
        personaPayload.idPersona = this.persona.idPersona; 
      }
      this.personaService.guardarPersona(personaPayload).subscribe({
        next: () => {
          const mensaje = esEdicion
            ? 'Persona actualizada exitosamente'
            : 'Persona creada exitosamente';
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: mensaje,
          });
          this.ref.close();
        },
        error: (err) => {
          const errorMessage = Object.values(err.error).join(', ');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage || 'Error al guardar la persona',
          });
          console.error(err);
        },
      });
    } else {
      this.formulario.markAllAsTouched();
    }
  }
  
  

  cargarPersona(idPersona: number) {
    console.log('Obteniendo persona con id:', idPersona);
    this.personaService.obtenerPersona(idPersona).subscribe({
      next: (persona: any) => {
        console.log('Datos recibidos de la persona:', persona);

        const personaOutDTO: PersonaOutDTO = {
          idPersona: persona.idPersona,
          idTipoIdentificacion: persona.tipoIdentificacion?.idTipoIdentificacion || null,
          codigoTipoIdentificacion: persona.tipoIdentificacion?.codigoTipoIdentificacion || '',
          numeroIdentificacion: persona.numeroIdentificacion || '',
          primerNombre: persona.primerNombre || '',
          segundoNombre: persona.segundoNombre || '',
          primerApellido: persona.primerApellido || '',
          segundoApellido: persona.segundoApellido || '',
          email: persona.email || '',
          sinReferencia: persona.sinReferencia || false,
        };
  
        this.persona = personaOutDTO;
  
        if (!this.lectura) {
          this.formulario.patchValue({
            idPersona: persona.idPersona,
            tipoIdentificacion: personaOutDTO.idTipoIdentificacion,
            numeroIdentificacion: personaOutDTO.numeroIdentificacion,
            primerNombre: personaOutDTO.primerNombre,
            segundoNombre: personaOutDTO.segundoNombre,
            primerApellido: personaOutDTO.primerApellido,
            segundoApellido: personaOutDTO.segundoApellido,
            email: personaOutDTO.email,
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar la persona:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información de la persona',
        });
      },
    });
  }  

  salir() {
    this.ref.close();
  }
}
