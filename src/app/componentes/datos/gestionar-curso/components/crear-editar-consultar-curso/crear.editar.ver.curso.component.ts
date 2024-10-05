import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacultadOutDTO } from 'src/app/componentes/common/model/facultad/out/facultad.out.dto';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { CursoService} from 'src/app/componentes/common/services/curso.service';
import { ProgramaService } from 'src/app/componentes/common/services/programa.service';
import { FacultadService } from 'src/app/componentes/common/services/facultad.service';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/agrupador.espacio.fisico.dto';
import { AsignaturaOutDTO } from '../../../gestionar-asignatura/model/asignatura-dto';
import { CursoDTO } from '../../model/curso-dto';
import { ProgramaOutDTO } from 'src/app/componentes/common/model/programa/out/programa.out.dto';
import { AsignaturaService } from 'src/app/componentes/common/services/asignatura.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

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
    private facultadService: FacultadService,
    private programaService: ProgramaService,
    private cursoService: CursoService,
    private asignaturaService: AsignaturaService,
    private periodoAcademicoSharedService: PeriodoAcademicoSharedService
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
    this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(r =>{
      if(r){
          this.periodoAcademicoId = r.idPeriodoAcademico
          this.periodoAcademico = r.anio+"-"+r.periodo;
      }else{
          this.periodoAcademicoSharedService=null;
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
