import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { ProgramaOutDTO } from 'src/app/componentes/dto/programa/out/programa.out.dto';
import { AgrupacionPorFacultad } from '../../model/agrupacion-por-facultad';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { AsignaturaOutDTO } from '../../model/asignatura-dto';
import { AsignaturaService } from 'src/app/componentes/servicios/asignatura.service';
import { ProgramaService } from 'src/app/componentes/servicios/programa.service';
import { FacultadService } from 'src/app/componentes/servicios/facultad.service';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/dto/espacio-fisico/out/agrupador.espacio.fisico.dto';

@Component({
  selector: 'app-crear-editar-asignatura',
  templateUrl: './crear-editar-asignatura.component.html',
  styleUrls: ['./crear-editar-asignatura.component.scss']
})
export class CrearEditarAsignaturaComponent implements OnInit {


  opcionesHabilitado: any[] = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];

  asignatura: AsignaturaOutDTO
  registrandoAsignatura: boolean
  formulario: FormGroup
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  listaProgramas: ProgramaOutDTO[]
  idGrupoSeleccionado: number[]
  lectura: boolean
  listaAgrupadores: AgrupadorEspacioFisicoDTO[]
  agrupadores: any[]
  constructor(
    private ref: DynamicDialogRef,     
    private config: DynamicDialogConfig,
    private asignaturaService: AsignaturaService,
    private fb: FormBuilder,
    private facultadService: FacultadService,
    private programaService: ProgramaService,
    private sharedService: SharedService,
    private messageSerivce: ShowMessageService
  ) {}
  ngOnInit(): void {
    this.lectura = this.config.data.lectura
    this.obtenerFacultades()
    this.inicializarFormulario()
    if (this.config.data?.id) {
      this.asignaturaService.consultarAsignaturaPorId(this.config.data.id).subscribe(r => {
        this.asignatura = r
        if (this.lectura) {
          this.agruparGruposPorFacultad()
        } else {
          this.asignarDatosFormulario()
        }
      })
    }
  }

  asignarDatosFormulario() {
    this.nombre().setValue(this.asignatura.nombre)
    this.codigoAsignatura().setValue(this.asignatura.codigoAsignatura)
    this.OID().setValue(this.asignatura.oid)
    this.semestre().setValue(this.asignatura.semestre)
    this.pensum().setValue(this.asignatura.pensum)
    this.horasSemana().setValue(this.asignatura.horasSemana)
    this.idPrograma().setValue(this.asignatura.idPrograma)
    this.idFacultad().setValue(this.asignatura.idFacultad)
    this.aplicaEspacioSecundario().setValue(this.asignatura.aplicaEspacioSecundario)
    this.agrupador().setValue(this.asignatura.agrupadores.map(a=> a.idAgrupadorEspacioFisico))
  }

  agruparGruposPorFacultad() {
    const agrupacionPorFacultad: AgrupacionPorFacultad[] = this.asignatura.agrupadores.reduce((acc: AgrupacionPorFacultad[], agrupador) => {
      const existingGroup = acc.find(group => group.idFacultad === agrupador.idFacultad);
      if (existingGroup) {
          existingGroup.agrupadorDTOs.push(agrupador);
      } else {
          acc.push({ idFacultad: agrupador.idFacultad, nombreFacultad: agrupador.nombreFacultad, agrupadorDTOs: [agrupador] });
      }
      return acc;
    }, []);
    this.agrupadores = agrupacionPorFacultad
  }

  obtenerGrupoSeleccionado(grupoSeleccionado: AgrupadorEspacioFisicoDTO[]) {
    	if (grupoSeleccionado) {
        this.idGrupoSeleccionado = grupoSeleccionado.map(g => g.idAgrupadorEspacioFisico);
      }
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

  inicializarFormulario() {
    this.formulario = this.fb.group({
      nombre: [{value: null}, Validators.required],
      codigoAsignatura: [{value: null}, Validators.required],
      oid: [{value: null}],
      semestre: [{value: null}, Validators.required],
      pensum: [{value: null}, Validators.required],
      horasSemana: [{value: null}, Validators.required],
      idPrograma: [{value: null}, Validators.required],
      lstIdAgrupadorEspacioFisico: [{value: null}, Validators.required],
      idFacultad: [{value : ""}, Validators.required],
      aplicaEspacioSecundario:[{value: null}, Validators.required],
      agrupadoresSeleccionados: [{value : ""}, Validators.required]
    })
  }
  
  onFacultadChange() {
    if (this.idFacultad().value!==null) {
      this.programaService.consultarProgramasPorIdFacultad([this.idFacultad().value]).subscribe(
          (r: ProgramaOutDTO[]) => {
              this.listaProgramas = r
          },
          (error) => {
              console.error(error);
          }
        );
        let idFacultades: number[] = []
        idFacultades.push(this.idFacultad().value)
        this.sharedService.obtenerAgrupadorEspacioFisico(idFacultades).subscribe(r => {
          this.listaAgrupadores = r
        })
   } else {
    this.limpiar()
   }
  }
  limpiar() {
    this.formulario.reset()
    this.listaAgrupadores = []
  }
   guardarAsignatura() {
    this.formulario.get("lstIdAgrupadorEspacioFisico").setValue(this.agrupador().value)
    if (this.formulario.valid) {
      this.asignatura = this.formulario.value
      this.asignatura.idAsignatura = this.config.data?.id
      this.asignaturaService.guardarAsignatura(this.asignatura).subscribe({
        next: (r) => {
          this.messageSerivce.showMessage("success", "Asignatura guardada")
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
  idFacultad(): FormControl {
    return this.formulario.get('idFacultad') as FormControl
   }
   idPrograma(): FormControl {
    return this.formulario.get('idPrograma') as FormControl
   }
   nombre(): FormControl {
    return this.formulario.get('nombre') as FormControl
   }
   codigoAsignatura(): FormControl {
    return this.formulario.get('codigoAsignatura') as FormControl
   }
   OID(): FormControl {
    return this.formulario.get('oid') as FormControl
   }
   semestre(): FormControl {
    return this.formulario.get('semestre') as FormControl
   }
   pensum(): FormControl {
    return this.formulario.get('pensum') as FormControl
   }
   horasSemana(): FormControl {
    return this.formulario.get('horasSemana') as FormControl
   }
   agrupador(): FormControl {
    return this.formulario.get('agrupadoresSeleccionados') as FormControl
   }
   aplicaEspacioSecundario(): FormControl {
    return this.formulario.get('aplicaEspacioSecundario') as FormControl
   }
}
