import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/espacio.fisico.out.dto';
import { AgrupacionPorFacultad } from '../../gestionar-asignatura/model/agrupacion-por-facultad';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UbicacionOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/ubicacion.out.dto';
import { EdificioOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/edificio.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoService } from 'src/app/componentes/servicios/espacio.fisico.service';

@Component({
  selector: 'app-crear-editar-espacio-fisico',
  templateUrl: './crear-editar-espacio-fisico.component.html',
  styleUrls: ['./crear-editar-espacio-fisico.component.scss']
})
export class CrearEditarEspacioFisicoComponent implements OnInit {
  espacio: EspacioFisicoOutDTO = {} as EspacioFisicoOutDTO
  agrupadoresLectura: AgrupacionPorFacultad[]
  lectura: boolean
  formulario: FormGroup
  ubicaciones: UbicacionOutDTO[]
  edificios: EdificioOutDTO[]
  estados: string[] = ['ACTIVO', 'INACTIVO']
  recursosLista: any[] = []
  gruposSeleccionados: number[]
  lstTipoEspacioFisicoOutDTO: TipoEspacioFisicoOutDTO[] = [];
  recursosActuales: any[]
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private espacioFisicoService: EspacioFisicoService,
    private fb: FormBuilder,
    private messageService: ShowMessageService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerUbicaciones()
    this.obtenerRecursos()
    this.obtenerTipos()
    this.lectura = this.config.data?.lectura
    if (this.config.data?.idEspacioFisico) {
      this.infoEspacioFisico()
    }
  }
  obtenerUbicaciones() {
    this.espacioFisicoService.consultarUbicaciones().subscribe(r => this.ubicaciones = r)
  }
  obtenerEdificios() {
    let ubicacion = []
    ubicacion.push(this.idUbicacion().value)
    this.espacioFisicoService.consultarEdificiosPorUbicacion(ubicacion).subscribe(r => this.edificios)
  }
  obtenerRecursos() {
    this.espacioFisicoService.obtenerListaRecursos().subscribe(r => this.recursosLista = r)
  }
  onChangeUbicacion() {
    if (this.idUbicacion().value) {
      this.obtenerEdificios()

    }
  }
  obtenerTipos() {
      let ubicaciones: any[] = []
      ubicaciones.push(this.idUbicacion().value)
      this.espacioFisicoService.consultarTiposEspaciosFisicos().subscribe(
        (lstTipoEspacioFisicoOutDTO: TipoEspacioFisicoOutDTO[]) => {
            if(lstTipoEspacioFisicoOutDTO.length === 0) {
                this.lstTipoEspacioFisicoOutDTO=[];
            }else{
                this.lstTipoEspacioFisicoOutDTO = lstTipoEspacioFisicoOutDTO;
            }
        },
        (error) => {
            console.error(error);
        }
        ); 
  }
  inicializarFormulario() {
    this.formulario = this.fb.group({
      idUbicacion: ['', Validators.required],
      idEdificio: ['', ],
      salon: ['', Validators.required],
      estado: ['', Validators.required],
      capacidad: ['', Validators.required],
      recursos: ['', Validators.required],
      tipo: ['', Validators.required]
    })
  }
  infoEspacioFisico() {
    this.espacioFisicoService.consultarEspacioFisicoPorIdEspacioFisico(this.config.data.idEspacioFisico).subscribe(r => {
      this.espacio = r
      if (r) {
        this.recursosActuales = r.recursos
        this.agrupadores()
        if (!this.lectura) {
          this.setFormulario()
        }
      }
    })
  }
  setFormulario() {
    this.idEdificio().setValue(this.espacio.idEdificio)
    this.idUbicacion().setValue(this.espacio.idUbicacion)
    this.salon().setValue(this.espacio.salon)
    this.estado().setValue(this.espacio.estado)
    this.capacidad().setValue(this.espacio.capacidad)
    this.tipo().setValue(this.espacio.idTipoEspacioFisico)
    this.recursos().setValue(this.espacio.recursos.map(r => r.idRecurso))
  }

  agrupadores() {
    const agrupacionPorFacultad: AgrupacionPorFacultad[] = this.espacio.lstIdAgrupadorEspacioFisico.reduce((acc: AgrupacionPorFacultad[], agrupador) => {
      const existingGroup = acc.find(group => group.idFacultad === agrupador.idFacultad);
      if (existingGroup) {
          existingGroup.agrupadorDTOs.push(agrupador);
      } else {
          acc.push({ idFacultad: agrupador.idFacultad, nombreFacultad: agrupador.nombreFacultad, agrupadorDTOs: [agrupador] });
      }
      return acc;
    }, []);
    this.agrupadoresLectura = agrupacionPorFacultad
  }


  salir() {
    this.ref.close()
  }
  guardar() {
    if (this.formulario.valid) {
      let espacioSave: EspacioFisicoOutDTO = this.formulario.value
      espacioSave.idEspacioFisico = this.espacio.idEspacioFisico
      espacioSave.idTipoEspacioFisico = this.tipo().value
      this.espacioFisicoService.guardarEspacioFisico(
        espacioSave
      ).subscribe(r => {
        if (r) {
          this.messageService.showMessage("success","Espacio fisico guardado correctamente")
          this.ref.close()
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
  getAgrupadoresSeleccionados(r: number[]) {
    console.log(r)
    this.gruposSeleccionados = r
  }
  idUbicacion(): FormControl {
    return this.formulario.get('idUbicacion') as FormControl
   }
   idEdificio(): FormControl {
    return this.formulario.get('idEdificio') as FormControl
   }
   salon(): FormControl {
    return this.formulario.get('salon') as FormControl
   }
   estado(): FormControl {
    return this.formulario.get('estado') as FormControl
   }
   capacidad(): FormControl {
    return this.formulario.get('capacidad') as FormControl
   }
   recursos(): FormControl {
    return this.formulario.get('recursos') as FormControl
   }
   tipo(): FormControl {
    return this.formulario.get('tipo') as FormControl
   }
}
