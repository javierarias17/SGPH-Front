import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignaturaOutDTO } from '../../model/asignatura-dto';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearEditarAsignaturaComponent } from '../../componentes/crear-editar-asignatura/crear-editar-asignatura.component';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { FiltroAsignaturasDTO } from '../../model/filtro-asignaturas';
import { ProgramaOutDTO } from 'src/app/componentes/dto/programa/out/programa.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EstadoDocenteEnum } from 'src/app/componentes/enum/estado.docente.enum';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { AsignaturaService } from 'src/app/componentes/servicios/asignatura.service';
import { ProgramaService } from 'src/app/componentes/servicios/programa.service';
import { FacultadService } from 'src/app/componentes/servicios/facultad.service';
@Component({
  selector: 'app-bandeja-principal-asignatura',
  templateUrl: './bandeja-principal-asignatura.component.html',
  styleUrls: ['./bandeja-principal-asignatura.component.scss']
})
export class BandejaPrincipalAsignaturaComponent implements OnInit {
  mostrarDialogoBandera: boolean = false
  base64String: any;
  @ViewChild('fileUpload') fileUpload: FileUpload;
  public facultadesSeleccionadas: number[] = [];
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  public listaProgramas: any[] = [];
  public programasSeleccionados: number[] = [];
  public numeroSemestre:number
  public listaEstados:{ label: string; value: string }[] = [];
  public estado: string
  constructor(public dialog: DialogService, 
    private asignaturaService: AsignaturaService,
    private facultadService: FacultadService,
    private programaService: ProgramaService,
    private confirmationService: ConfirmationService,
    private mensageService: ShowMessageService,
    private translateService: TranslateService
  ) {}

  asignaturas: AsignaturaOutDTO[] = [{
  } as AsignaturaOutDTO]
  totalRecords: number
  cargando: boolean
  filtro: FiltroAsignaturasDTO

  ngOnInit(): void {
    this.listaEstadosCrear()
    this.consultarFacultades()
    this.listarAsignaturasBase()
  }
  listaEstadosCrear() {
    Object.keys(EstadoDocenteEnum).forEach(key => {
      const translatedLabel = this.translateService.instant('estado.' + key);
      this.listaEstados.push({ label: translatedLabel, value: key });
  });
  }

  consultarFacultades() {
    this.facultadService.consultarFacultades().subscribe(
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
        semestre: this.numeroSemestre,
        estado: this.estado
    }
    this.asignaturaService.filtrarAsignaturas(this.filtro).subscribe(asignaturas => {
      this.asignaturas = asignaturas.content
      this.totalRecords = asignaturas.totalElements
      this.cargando = false;
    })
  }

  listarAsignaturas($event: LazyLoadEvent) {
    this.filtro = {
      pageNumber: Math.floor($event.first / $event.rows),
      pageSize: $event.rows,
      idFacultades: this.facultadesSeleccionadas,
      idProgramas: this.programasSeleccionados,
      semestre: this.numeroSemestre,
      estado: this.estado
    };
    this.asignaturaService.filtrarAsignaturas(this.filtro).subscribe(asignaturas => {
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
      closable: false,
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
      closable: false,
      data: {
        id: id,
        lectura: false
      }
    },)
    ref.onClose.subscribe(r => {
      this.listarAsignaturasBase()
    })
  }
  inactivarAsignatura(asignatura: AsignaturaOutDTO) {

		this.confirmationService.confirm({
      message: `¿Está seguro que desea ${asignatura.estado == 'ACTIVO'? 'inactiva' : 'activar'} la asignatura?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {       
        this.asignaturaService.inactivarAsignatura(asignatura.idAsignatura).subscribe({
          next: (r) => {
            if (r) {
              this.mensageService.showMessage('success', `Asignatura ${asignatura.estado == 'ACTIVO'? 'inactivada' : 'activada'}`);
              this.listarAsignaturasBase()
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
      closable: false,
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
      this.programaService.consultarProgramasPorIdFacultad(this.facultadesSeleccionadas.map(facultad => facultad)).subscribe(
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
    this.asignaturas = []
   }
 }
 cargarArchivo() {
  this.mostrarDialogoBandera = true
 }
 onEstadoChange() {

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
 cancelar() {
  this.mostrarDialogoBandera = false
  this.base64String = null
  this.fileUpload.clear();
 }
 cargar() {
  this.asignaturaService.cargaMasiva({ base64: this.base64String} as any).subscribe(r => {
    if (r && !r.error) {
      this.cancelar()
      this.mensageService.showMessage("success", "Asignaturas guardadas correctamente")
      this.listarAsignaturasBase()
    } else {
      this.cancelar()
      this.mensageService.showMessage("error", r.descripcion)
    }
  })
 }
 onUpload(event: any) {
  const file = event.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    this.base64String = e.target.result.split(',')[1];
  };
  reader.readAsDataURL(file);
}
}
