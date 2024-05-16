import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from 'src/app/componentes/servicios/facultad.servicio';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { GrupoService } from '../../services/grupo.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
  selector: 'app-crear-editar-grupo',
  templateUrl: './crear-editar-grupo.component.html',
  styleUrls: ['./crear-editar-grupo.component.scss']
})
export class CrearEditarGrupoComponent implements OnInit {
  lectura: boolean
  formulario: FormGroup
  grupo: AgrupadorEspacioFiscioDTO
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  constructor(private facultadService: FacultadServicio, 
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private grupoService: GrupoService,
    private messageService: ShowMessageService,
    private ref: DynamicDialogRef
  ) {}
  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerFacultades()
    this.grupo = this.config.data?.grupo
    if (this.grupo) {
      this.lectura = false
      this.setDatosFormulario()
    }
  }
  onFacultadChange() {
    if (this.idFacultad().value!==null) {
   } else {
    this.limpiar()
   }
  }
  setDatosFormulario() {
    this.nombre().setValue(this.grupo.nombre)
    this.idFacultad().setValue(this.grupo.idFacultad)
    this.observacion().setValue(this.grupo.observacion)
  }
  inicializarFormulario() {
    this.formulario = this.fb.group({
      idFacultad: [{value : ""}, Validators.required],
      nombre: [{value: ""}, Validators.required],
      observacion: [{value: ""}, Validators.required],
    })
  }
  limpiar() {
    this.formulario.reset()
  }
  obtenerFacultades() {
    this.facultadService.consultarFacultades().subscribe(
      (lstFacultadOutDTO: FacultadOutDTO[]) => {
          this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
      },
      (error) => {
        console.error(error);
      }
  ); 
  }
  guardarGrupo() {
    if (this.formulario.valid) {
      let grupo: AgrupadorEspacioFiscioDTO = this.formulario.value
      grupo.idAgrupadorEspacioFisico = this.grupo?.idAgrupadorEspacioFisico
      this.grupoService.guardarGrupo(grupo).subscribe({
        next: (r) => {
          if (r) {
            this.messageService.showMessage("success", "Agrupador guardado correctamente")
            this.ref.close()
          }
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  idFacultad(): FormControl {
    return this.formulario.get('idFacultad') as FormControl
   }
   nombre(): FormControl {
    return this.formulario.get('nombre') as FormControl
   }
   observacion(): FormControl {
    return this.formulario.get('observacion') as FormControl
   }
}
