import { Component, OnInit } from '@angular/core';
import { DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EspacioFisicoDTO } from 'src/app/componentes/dto/espacio-fisico/out/espacio.fisico.dto';
import { EspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/espacio.fisico.out.dto';
import { EspacioFisicoServicio } from 'src/app/componentes/servicios/espacio.fisico.servicio';
import { AgrupacionPorFacultad } from '../../gestionar-asignatura/model/agrupacion-por-facultad';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UbicacionOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/ubicacion.out.dto';
import { EdificioOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/edificio.out.dto';

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
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private espacioFisicoService: EspacioFisicoServicio,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerUbicaciones()
    this.obtenerRecursos()
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
  inicializarFormulario() {
    this.formulario = this.fb.group({
      idUbicacion: ['', Validators.required],
      idEdificio: ['', Validators.required],
      salon: ['', Validators.required],
      estado: ['', Validators.required],
      capacidad: ['', Validators.required],
      recursos: ['', Validators.required],
    })
  }
  infoEspacioFisico() {
    this.espacioFisicoService.consultarEspacioFisicoPorIdEspacioFisico(this.config.data.idEspacioFisico).subscribe(r => {
      this.espacio = r
      if (r) {
        this.agrupadores()
      }
    })
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
}
