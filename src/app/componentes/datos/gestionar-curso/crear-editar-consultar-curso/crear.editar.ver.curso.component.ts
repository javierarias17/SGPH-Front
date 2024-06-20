import { Component, ViewChild } from '@angular/core';
import { CursoPlanificacionOutDTO } from '../../../dto/curso/out/curso.planificacion.out.dto';
import { CursoDTO } from 'src/app/componentes/dto/curso/curso-dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { ProgramaOutDTO } from 'src/app/componentes/dto/programa/out/programa.out.dto';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FacultadServicio } from 'src/app/componentes/servicios/facultad.servicio';
import { ProgramaServicio } from 'src/app/componentes/servicios/programa.servicio';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { CursoServicio } from 'src/app/componentes/servicios/curso.servicio';
import { AsignaturaServicio } from 'src/app/componentes/servicios/asignatura.servicio';
import { AsignaturaOutDTO } from '../../gestionar-asignatura/model/asignatura-dto';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';

@Component({
  selector: 'app-crear-editar-ver-curso',
  templateUrl: './crear.editar.ver.curso.component.html',
  styleUrls: ['./crear.editar.ver.curso.component.css']
})
export class CrearEditarVerCursoComponent {

  
  curso: CursoDTO
  formulario: FormGroup
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  listaProgramas: ProgramaOutDTO[]
  idGrupoSeleccionado: number[]
  lectura: boolean
  agrupadores: any[]
  listaAsignaturas: AsignaturaOutDTO[] = []
  asignaturaSeleccionada: AsignaturaOutDTO
  listaGrupos: string[] = ["A", "B"]
  periodoAcademico: string
  periodoAcademicoId: number
  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,     
    private config: DynamicDialogConfig,
    private messageSerivce: ShowMessageService,
    private facultadServicio: FacultadServicio,
    private programaServicio: ProgramaServicio,
    private cursoService: CursoServicio,
    private asignaturaService: AsignaturaServicio,
    private periodoService: PeriodoAcademicoService
  ) {}
  ngOnInit(): void {
    this.lectura = this.config.data.lectura
    this.obtenerFacultades()
    this.inicializarFormulario()
    console.log(this.config.data)
    if (this.config.data?.id) {
      this.cursoService.consultarCursoPorId(this.config.data.id).subscribe(r => {
        this.curso = r
        this.asignarDatosFormulario()
      })
    }
    this.periodoService.consultarPeriodoAcademicoVigente().subscribe(r =>{
      if(r){
          this.periodoAcademicoId = r.idPeriodoAcademico
          this.periodoAcademico = r.anio+"-"+r.periodo;
      }else{
          this.periodoService=null;
      }
  });
  }
  

  asignarDatosFormulario() {
    this.idPrograma().setValue(this.curso.idPrograma)
    this.idFacultad().setValue(this.curso.idFacultad)
    this.idAsignatura().setValue(this.curso.idAsignatura)
    this.grupo().setValue(this.curso.grupo)
    this.cupo().setValue(this.curso.cupo)

  }

  obtenerGrupoSeleccionado(grupoSeleccionado: AgrupadorEspacioFiscioDTO[]) {
    	if (grupoSeleccionado) {
        this.idGrupoSeleccionado = grupoSeleccionado.map(g => g.idAgrupadorEspacioFisico);
      }
  }
  obtenerFacultades() {
    this.facultadServicio.consultarFacultades().subscribe(
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
      idPrograma: [{value: null}, Validators.required],
      idFacultad: [{value : ""}, Validators.required],
      idAsignatura: [null, Validators.required],
      grupo: [null, Validators.required],
      cupo: [null, Validators.required],
      idPeriodoAcademico: []
    })
  }
  
  onFacultadChange() {
    if (this.idFacultad().value!==null) {
      this.programaServicio.consultarProgramasPorIdFacultad([this.idFacultad().value]).subscribe(
          (r: ProgramaOutDTO[]) => {
              this.listaProgramas = r
          },
          (error) => {
              console.error(error);
          }
        );
        let idFacultades: number[] = []
        idFacultades.push(this.idFacultad().value)
   } else {
    this.limpiar()
   }
  }
  limpiar() {
    this.formulario.reset()
  }
  onProgramaChange() {
    if (this.idPrograma().value!==null) {
      this.asignaturaService.consultarAsignaturasPorIdPrograma(this.idPrograma().value).subscribe(r => {
        this.listaAsignaturas = r
        this.asignaturaSeleccionada = null
      })
    }
  }
  onAsignaturaChange(event: AsignaturaOutDTO) {
    this.asignaturaSeleccionada = null
    if (this.listaAsignaturas.length > 0 && this.idAsignatura().value) {
      this.asignaturaSeleccionada = this.listaAsignaturas.find(a => a.idAsignatura === this.idAsignatura().value)
    }
  }
   guardarcurso() {
    this.periodoAcademicoControl().setValue(this.periodoAcademicoId)
    if (this.formulario.valid) {
      this.curso = this.formulario.value
      this.curso.idCurso = this.config.data?.id
      this.cursoService.guardarCurso(this.curso).subscribe({
        next: (r) => {
          this.messageSerivce.showMessage('success', "Curso guardado")
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
   idAsignatura(): FormControl {
    return this.formulario.get('idAsignatura') as FormControl
   }
   grupo(): FormControl {
    return this.formulario.get('grupo') as FormControl
   }
   cupo(): FormControl {
    return this.formulario.get('cupo') as FormControl
   }
   periodoAcademicoControl() {
    return this.formulario.get("idPeriodoAcademico") as FormControl
   }
}
