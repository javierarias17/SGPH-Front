import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from 'src/app/componentes/servicios/facultad.servicio';
import { ProgramaServicio } from 'src/app/componentes/servicios/programa.servicio';
import { ProgramaOutDTO } from 'src/app/componentes/dto/programa/out/programa.out.dto';

import { SharedService } from 'src/app/shared/service/shared.service';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { DocenteOutDTO } from 'src/app/componentes/dto/docente/out/docente.out.dto';
import { DocenteServicio } from 'src/app/componentes/servicios/docente.servicio';
import { TipoIdentificacionOutDTO } from 'src/app/componentes/dto/usuario/out/tipo.identificacion.out.dto';
import { UsuarioServicio } from 'src/app/componentes/servicios/usuario.servicio';
import { EstadoDocenteEnum } from 'src/app/componentes/enum/estado.docente.enum';

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
    private docenteService: DocenteServicio,
    private fb: FormBuilder,
    private messageSerivce: ShowMessageService,
    private usuarioService: UsuarioServicio
  ) {}
  ngOnInit(): void {
    this.obtenerIdentificaciones()
    this.lectura = this.config.data.lectura
    this.inicializarFormulario()
    if (this.config.data?.idTipoIdentificacion) {
      this.docenteService.consultarDocentePorIdentificacion(this.config.data?.idTipoIdentificacion, this.config.data?.numeroIdentificacion).subscribe(r => {
        this.docente = r
        console.log(r)
        if (!this.lectura) {
          this.asignarDatosFormulario()
        }
      })
    }
  }
  obtenerIdentificaciones() {
    this.usuarioService.consultarTiposIdentificacion().subscribe(
      (lstTipoIdentificacionOutDTO: TipoIdentificacionOutDTO[]) => {               
          this.tiposIdentificacion = lstTipoIdentificacionOutDTO;
      },
      (error) => {
        console.error(error);
      }
    )
  }

  asignarDatosFormulario() {
    this.idTipoIdentificacion().setValue(this.docente.idTipoIdentificacion)
    this.numeroIdentificacion().setValue(this.docente.numeroIdentificacion)
    this.primerNombre().setValue(this.docente.primerNombre)
    this.segundoNombre().setValue(this.docente.segundoNombre)
    this.primerApellido().setValue(this.docente.primerApellido)
    this.segundoApellido().setValue(this.docente.segundoApellido)
    this.email().setValue(this.docente.email)
  }
  inicializarFormulario() {
    this.formulario = this.fb.group({
      idTipoIdentificacion: [null, Validators.required],
      numeroIdentificacion: [null, Validators.required],
      primerNombre: [null, Validators.required],
      segundoNombre: [null],
      primerApellido: [null, Validators.required],
      segundoApellido: [null],
      email: [null, Validators.required],
    })
  }
  
  limpiar() {
    this.formulario.reset()
  }
   guardardocente() {
    if (this.formulario.valid) {
      this.docente = this.formulario.value
      this.docente.idPersona = this.config.data?.id
      this.docente.estado = EstadoDocenteEnum.ACTIVO
      this.docenteService.guardarDocente(this.docente).subscribe({
        next: (r) => {
          this.messageSerivce.showMessage("success", "Docente guardado")
          this.ref.close()
          console.log(r)
        },
        error: (r) => {
          this.messageSerivce.showMessage("error", "Error al guardar")
          console.log(r)
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
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
}
