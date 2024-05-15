import { Component, OnInit } from '@angular/core';
import { AsignaturaOutDTO } from '../../model/asignatura-dto';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearEditarAsignaturaComponent } from '../../componentes/crear-editar-asignatura/crear-editar-asignatura.component';
import { FiltroBase } from 'src/app/componentes/dto/filtro-base';
import { AsignaturaServicio } from 'src/app/componentes/servicios/asignatura.servicio';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from 'src/app/componentes/servicios/facultad.servicio';
import { FiltroAsignaturasDTO } from '../../model/filtro-asignaturas';
import { ProgramaOutDTO } from 'src/app/componentes/dto/programa/out/programa.out.dto';
import { ProgramaServicio } from 'src/app/componentes/servicios/programa.servicio';
import { FormControl } from '@angular/forms';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
@Component({
  selector: 'app-bandeja-principal-asignatura',
  templateUrl: './bandeja-principal-asignatura.component.html',
  styleUrls: ['./bandeja-principal-asignatura.component.scss']
})
export class BandejaPrincipalAsignaturaComponent implements OnInit {
  public facultadesSeleccionadas: number[] = [];
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  public listaProgramas: any[] = [];
  public programasSeleccionados: number[] = [];
  public numeroSemestre:number
  constructor(public dialog: DialogService, 
    private asignaturaServicio: AsignaturaServicio,
    private facultadServicio: FacultadServicio,
    private programaServicio: ProgramaServicio,
    private confirmationService: ConfirmationService,
    private mensageService: ShowMessageService
  ) {}

  asignaturas: AsignaturaOutDTO[] = [{
  } as AsignaturaOutDTO]
  totalRecords: number
  cargando: boolean
  filtro: FiltroAsignaturasDTO

  ngOnInit(): void {
    this.consultarFacultades()
    this.listarAsignaturasBase()
  }

  consultarFacultades() {
    this.facultadServicio.consultarFacultades().subscribe(
      (lstFacultadOutDTO: FacultadOutDTO[]) => {
          this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
      },
      (error) => {
          console.error(error);
      }
    );  
  }

  listarAsignaturasBase() {
    this.cargando = true;
    this.filtro = {
        pageNumber: 0,
        pageSize: 10,
        idFacultades: this.facultadesSeleccionadas,
        idProgramas: this.programasSeleccionados,
        semestre: this.numeroSemestre
    }
    this.asignaturaServicio.filtrarAsignaturas(this.filtro).subscribe(asignaturas => {
      console.log(asignaturas)
      this.asignaturas = asignaturas.content
      this.totalRecords = asignaturas.totalElements
      this.cargando = false;
    })
  }

  listarAsignaturas($event: LazyLoadEvent) {
    console.log($event)
    this.filtro = {
      pageNumber: Math.floor($event.first / $event.rows),
      pageSize: $event.rows,
      idFacultades: this.facultadesSeleccionadas,
      idProgramas: this.programasSeleccionados,
      semestre: this.numeroSemestre
    };
    this.asignaturaServicio.filtrarAsignaturas(this.filtro).subscribe(asignaturas => {
      console.log(asignaturas)
      this.asignaturas = asignaturas.content
      this.totalRecords = asignaturas.totalElements
      this.cargando = false;
    })
  }
  verAsignatura(id: number) {
    const ref = this.dialog.open(CrearEditarAsignaturaComponent, {
      height: 'auto',
      width: '800px',
      header: 'Información asignatura',
      data: {
        id: id,
        lectura: true
      }
    },)
  }

  editarAsignatura(id: number) {
    const ref = this.dialog.open(CrearEditarAsignaturaComponent, {
      height: 'auto',
      width: '800px',
      header: 'Editar asignatura',
      data: {
        id: id,
        lectura: false
      }
    },)
    ref.onClose.subscribe(r => {
      this.listarAsignaturasBase()
    })
  }
  eliminarAsignatura(id: number) {
		this.confirmationService.confirm({
      message: `¿Está seguro que desea inactivar la asignatura?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {       
        this.asignaturaServicio.inactivarAsignatura(id).subscribe({
          next: (r) => {
            if (r) {
              this.mensageService.showMessage('success', "Asignatura inactiva");
            }
          },
          error: () => {
            this.mensageService.showMessage('error', "Error al inactivar");
          }
        })
      },
      reject: () => {
        this.mensageService.showMessage('error', "Inactivado cancelado");
      }
    }); 
  }
  registrarAsignatura() {
    const ref = this.dialog.open(CrearEditarAsignaturaComponent, {
      height: 'auto',
      width: '800px',
      header: 'Registrar asignatura',
      data: {
        lectura: false
      }
    },)
    ref.onClose.subscribe(r => {
      this.listarAsignaturasBase()
    })
  }
  onChangeFacultad() {
    if (this.facultadesSeleccionadas!==null && this.facultadesSeleccionadas.length !== 0) {
      this.programaServicio.consultarProgramasPorIdFacultad(this.facultadesSeleccionadas.map(facultad => facultad)).subscribe(
          (lstProgramaOutDTO: ProgramaOutDTO[]) => {
              if(lstProgramaOutDTO.length === 0){
                  this.listaProgramas=[];
              } else {
                  this.programasSeleccionados=null;
                  this.listaProgramas = lstProgramaOutDTO.map((programa: any) => ({ abreviatura: programa.abreviatura, nombre: programa.nombre, idPrograma:programa.idPrograma }));
              }
              this.listarAsignaturasBase()
          },
          (error) => {
              console.error(error);
          }
        );   
   } else {
    this.limpiar()
    this.listarAsignaturasBase()
   }
 }
 limpiar() {
  this.programasSeleccionados = null
  this.facultadesSeleccionadas = null
  this.numeroSemestre = null
 }
 onProgramasChange() {
  this.listarAsignaturasBase()
 }
 public onSemestreChange() {        
  this.listarAsignaturasBase()
 }
}
