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
import { MessageService } from 'primeng/api';

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
  listaGrupos: string[] = ["A", "B", "C", "D"]
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
    private periodoAcademicoSharedService: PeriodoAcademicoSharedService,
    private message: MessageService,
  ) {}
  ngOnInit(): void {
    this.lectura = this.config.data.lectura
    this.obtenerFacultades()
    this.inicializarFormulario()
    // Suscribir a los cambios en el valor de la facultad
    this.idFacultad().valueChanges.subscribe((idFacultad) => {
      this.onFacultadChange(idFacultad);
    });
    this.idPrograma().valueChanges.subscribe((idPrograma) => {
      this.onProgramaChange(idPrograma);
    });
    
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
    // Asignar facultad y cargar programas
    this.idFacultad().setValue(this.curso.idFacultad, { emitEvent: false });
  
    this.programaService.consultarProgramasPorIdFacultad([this.curso.idFacultad]).subscribe((programas) => {
      this.listaProgramas = programas;
      this.idPrograma().setValue(this.curso.idPrograma, { emitEvent: false });
  
      this.asignaturaService.consultarAsignaturasActivasPorIdPrograma(this.curso.idPrograma).subscribe((asignaturas) => {
        this.listaAsignaturas = asignaturas;
  
        // Convertir el idAsignatura del curso a número
        const idAsignaturaCurso = Number(this.curso.idAsignatura);
  
        // Verificar si la asignatura seleccionada está en la lista
        const asignaturaSeleccionada = asignaturas.find((a) => a.idAsignatura === idAsignaturaCurso);
  
        if (!asignaturaSeleccionada) {
          // Si no está, agregarla manualmente
          const asignaturaDelCurso: AsignaturaOutDTO = {
            idAsignatura: idAsignaturaCurso, // Convertido a número
            nombre: this.curso.nombreCurso, // Nombre de la asignatura desde el curso
            codigoAsignatura: this.curso.OIDAsignatura || '', // Código de la asignatura o vacío
            oid: '', // Valor predeterminado
            semestre: null, // Valor predeterminado
            pensum: '', // Valor predeterminado
            horasSemana: null, // Valor predeterminado
            idPrograma: this.curso.idPrograma, // ID del programa asociado al curso
            nombreFacultad: this.curso.nombreFacultad || '', // Nombre de la facultad
            nombrePrograma: this.curso.nombrePrograma || '', // Nombre del programa
            lstIdAgrupadorEspacioFisico: [], // Lista vacía predeterminada
            agrupadores: [], // Lista vacía predeterminada
            idFacultad: String(this.curso.idFacultad), // Convertir idFacultad a string
            estado: 'activo', // Valor predeterminado
            aplicaEspacioSecundario: false, // Valor predeterminado
          };
  
          this.listaAsignaturas.push(asignaturaDelCurso);
        }
  
        // Asignar la asignatura al formulario
        this.idAsignatura().setValue(idAsignaturaCurso, { emitEvent: false });
      });
    });
  
    this.grupo().setValue(this.curso.grupo, { emitEvent: false });
    this.cupo().setValue(this.curso.cupo, { emitEvent: false });
  }
  

  obtenerGrupoSeleccionado(grupoSeleccionado: AgrupadorEspacioFisicoDTO[]) {
    	if (grupoSeleccionado) {
        this.idGrupoSeleccionado = grupoSeleccionado.map(g => g.idAgrupadorEspacioFisico);
      }
  }
  obtenerFacultades() {
    this.facultadService.consultarFacultades().subscribe((lstFacultadOutDTO) => {
      this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultad) => ({
        abreviatura: facultad.abreviatura,
        nombre: facultad.nombre,
        idFacultad: facultad.idFacultad,
      }));
    });
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
  
  setupFormListeners() {
    this.idFacultad().valueChanges.subscribe((value) => {
      if (value !== null) {
        this.programaService.consultarProgramasPorIdFacultad([value]).subscribe((programas) => {
          this.listaProgramas = programas;
          this.idPrograma().setValue(null, { emitEvent: false });
          this.listaAsignaturas = [];
          this.idAsignatura().setValue(null, { emitEvent: false });
        });
      } else {
        this.listaProgramas = [];
        this.listaAsignaturas = [];
        this.formulario.reset({ idFacultad: null, idPrograma: null, idAsignatura: null }, { emitEvent: false });
      }
    });

    this.idPrograma().valueChanges.subscribe((value) => {
      if (value !== null) {
        this.asignaturaService.consultarAsignaturasActivasPorIdPrograma(value).subscribe((asignaturas) => {
          this.listaAsignaturas = asignaturas;
          this.idAsignatura().setValue(null, { emitEvent: false });
        });
      } else {
        this.listaAsignaturas = [];
        this.idAsignatura().setValue(null, { emitEvent: false });
      }
    });
  }


  onFacultadChange(idFacultad: any) {
    if (idFacultad) {
      this.programaService.consultarProgramasPorIdFacultad([idFacultad]).subscribe(
        (programas: ProgramaOutDTO[]) => {
          this.listaProgramas = programas;
  
          // Restablecer programa y asignatura si cambia la facultad
          this.idPrograma().setValue(null, { emitEvent: false });
          this.listaAsignaturas = [];
          this.idAsignatura().setValue(null, { emitEvent: false });
        },
        (error) => {
          console.error('Error al consultar programas:', error);
        }
      );
    } else {
      this.listaProgramas = [];
      this.listaAsignaturas = [];
      this.formulario.reset({ idFacultad: null, idPrograma: null, idAsignatura: null }, { emitEvent: false });
    }
  }
  
  limpiar() {
    this.formulario.reset()
  }

  onProgramaChange(idPrograma: any) {
    if (idPrograma) {
      this.asignaturaService.consultarAsignaturasActivasPorIdPrograma(idPrograma).subscribe(
        (asignaturas: AsignaturaOutDTO[]) => {
          this.listaAsignaturas = asignaturas;
  
          // Restablecer la asignatura si cambia el programa
          this.idAsignatura().setValue(null, { emitEvent: false });
        },
        (error) => {
          console.error('Error al consultar asignaturas:', error);
        }
      );
    } else {
      this.listaAsignaturas = [];
      this.idAsignatura().setValue(null, { emitEvent: false });
    }
  }
  
  
  onAsignaturaChange(event: AsignaturaOutDTO) {
    this.asignaturaSeleccionada = null
    if (this.listaAsignaturas.length > 0 && this.idAsignatura().value) {
      this.asignaturaSeleccionada = this.listaAsignaturas.find(a => a.idAsignatura === this.idAsignatura().value)
    }
  }
  guardarcurso() {
    this.periodoAcademicoControl().setValue(this.periodoAcademicoId);
    if (this.formulario.valid) {
      this.curso = this.formulario.value;
      this.curso.idCurso = this.config.data?.id;
      this.curso.esValidar = false;
      this.curso.periodoAcademico = this.periodoAcademico;
      console.log("PERIODO", this.curso.periodoAcademico);
      this.cursoService.guardarCurso(this.curso).subscribe({
        next: () => {
          console.log('Curso guardado correctamente');
          this.messageSerivce.showMessage('success', 'Curso guardado');
          this.ref.close('success'); // Cambia a 'success' (coincide con el padre)
        },
        error: (error) => {
          if (error.error && Array.isArray(error.error)) {
            const mensajes = error.error
              .map((err: any) =>
                `${err.field ? `${err.field}: ` : ''}${err.defaultMessage}`
              )
              .join('. ');
            this.message.add({
              severity: 'error',
              summary: 'Errores de validación',
              detail: mensajes,
            });
            this.ref.close({ status: 'error', detail: mensajes });
          } else {
            const mensaje = 'Ocurrió un error inesperado';
            this.message.add({ severity: 'error', summary: 'Error', detail: mensaje });
            this.ref.close({ status: 'error', detail: mensaje });
          }
        },
      });
    } else {
      console.log('Errores en el formulario:', this.formulario.errors);
      this.formulario.markAllAsTouched();
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
