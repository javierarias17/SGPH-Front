import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../services/grupo.service';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from 'src/app/componentes/servicios/facultad.servicio';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { CrearEditarGrupoComponent } from '../../components/crear-editar-grupo/crear-editar-grupo.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { AsignarEspacioFisicoComponent } from '../../components/asignar-espacio-fisico/asignar-espacio-fisico.component';

@Component({
  selector: 'app-bandeja-grupos',
  templateUrl: './bandeja-grupos.component.html',
  styleUrls: ['./bandeja-grupos.component.scss']
})
export class BandejaGruposComponent implements OnInit {
  public facultadesSeleccionadas: number[] = [];
  public lstFacultadOutDTO: FacultadOutDTO[] = [];

  grupos: AgrupadorEspacioFiscioDTO[]

  totalRecords: number
  cargando: boolean
  filtro: any
  constructor(private grupoService: GrupoService,
    private facultadServicio: FacultadServicio,
    private dialog: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: ShowMessageService
  ) {

  }
  ngOnInit(): void {
    this.consultarFacultades()
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

  onChangeFacultad() {
    if (this.facultadesSeleccionadas!==null && this.facultadesSeleccionadas.length !== 0) { 
      this.listarGruposBase()
   } else {
   }
 }

 listarGruposBase() {
  if (this.facultadesSeleccionadas.length > 0) {
    this.cargando = true;
    this.filtro = {
        pageNumber: 0,
        pageSize: 10,
        listaIdFacultades: this.facultadesSeleccionadas
    }
    this.grupoService.obtenerAgrupadorEspacioFisico(this.filtro).subscribe(r => {
      this.grupos = r.content
      this.totalRecords = r.totalElements
      this.cargando = false;
    })
  }
 }

 listarGrupos($event : LazyLoadEvent) {
  if (this.facultadesSeleccionadas.length > 0) {
    this.filtro = {
      pageNumber: Math.floor($event.first / $event.rows),
      pageSize: $event.rows,
      idFacultades: this.facultadesSeleccionadas
    };
    this.grupoService.obtenerAgrupadorEspacioFisico(this.filtro).subscribe(r => {
      this.grupos = r.content
      this.totalRecords = r.totalElements
      this.cargando = false;
    })
  }
 }

 verGrupo(id: number) {
  const ref = this.dialog.open(CrearEditarGrupoComponent, {
    height: 'auto',
    width: '800px',
    header: 'Información Grupo',
    closable: false,
    data: {
      id: id,
      lectura: true
    }
  },)
}

editarGrupo(grupo: AgrupadorEspacioFiscioDTO) {
  const ref = this.dialog.open(CrearEditarGrupoComponent, {
    height: 'auto',
    width: '800px',
    header: 'Editar Grupo',
    closable: false,
    data: {
      grupo: grupo
    }
  },)
  ref.onClose.subscribe(r => {
    this.listarGruposBase()
  })
}
asignarEspacioFisico(grupo: AgrupadorEspacioFiscioDTO) {
  const ref = this.dialog.open(AsignarEspacioFisicoComponent, {
    height: 'auto',
    width: '920px',
    header: 'Asignar espacio fisico',
    closable: false,
    data: {
      grupo: grupo
    }
  },)
}

registrarGrupo() {
  const ref = this.dialog.open(CrearEditarGrupoComponent, {
    height: 'auto',
    width: '800px',
    header: 'Registrar Grupo',
    closable: false,
    data: {
      lectura: false
    }
  },)
  ref.onClose.subscribe(r => {
    this.listarGruposBase()
  })
}




}
