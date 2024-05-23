import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { GrupoService } from '../../services/grupo.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EspacioFisicoServicio } from 'src/app/componentes/servicios/espacio.fisico.servicio';

@Component({
  selector: 'app-asignar-espacio-fisico',
  templateUrl: './asignar-espacio-fisico.component.html',
  styleUrls: ['./asignar-espacio-fisico.component.scss']
})
export class AsignarEspacioFisicoComponent implements OnInit {

  grupoSeleccionado: AgrupadorEspacioFiscioDTO

  listaTipoEspacioFisico: TipoEspacioFisicoOutDTO[] = []
  
  espaciosFisicosDisponibles: any[] = []
  espasciosFisicosAsignados: any[] = []

  listaDeGruposNuevos: any = []
  listaDeGruposQuitados: any = []
  lstUbicacion: string[] = [];

  filtro: any = {
    ubicacion: "",
    tipo: "",
    nombre: "",
    idAgrupador: null
  } as any

  constructor(private config: DynamicDialogConfig,
    private grupoService: GrupoService,
    private ref: DynamicDialogRef,
    private mensajeService: ShowMessageService,
    private espacioFisicoServicio: EspacioFisicoServicio
  ) {}
  ngOnInit(): void {
    this.obtenerUbicaciones()
    this.grupoSeleccionado = this.config.data?.grupo
    this.grupoService.obtenerEspacioFiscioAgrupador(this.grupoSeleccionado.idAgrupadorEspacioFisico).subscribe({
      next: (r) =>
        this.espasciosFisicosAsignados = r
    })
    this.filtrarEspacios()
  }

  obtenerTipos() {
    let ubicaciones: string[] = []
    ubicaciones.push(this.filtro.ubicacion)
    this.espacioFisicoServicio.consultarTiposEspaciosFisicosPorUbicaciones(ubicaciones).subscribe(r => {
      this.listaTipoEspacioFisico = r
    })
  }

  obtenerUbicaciones() {
    this.espacioFisicoServicio.consultarUbicaciones().subscribe(
      (lstUbicacion: string[]) => {
          this.lstUbicacion = lstUbicacion;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  inicializarFormulario() {
  }

  filtrarEspacios() {
    this.filtro.idAgrupador = this.grupoSeleccionado.idAgrupadorEspacioFisico
    this.grupoService.obtenerEspacioFiscioDispinibleFiltro(this.filtro).subscribe({
      next: (r) => {
        this.espaciosFisicosDisponibles = r
        this.espaciosFisicosDisponibles = this.espaciosFisicosDisponibles.concat(this.listaDeGruposQuitados)
        this.espaciosFisicosDisponibles = this.quitarRepetidos(this.espaciosFisicosDisponibles)
      }
    })
  }

  onChangeUbicacion() {
    if (this.filtro.ubicacion) {
      this.obtenerTipos()
      this.filtro.tipo = ""
      this.filtrarEspacios()
    } else {
      this.filtro.ubicacion = ""
      this.filtro.tipo = ""
    }
  }
  guardar() {
    const asignacionDTO = {
      quitados: this.listaDeGruposQuitados,
      agregados: this.listaDeGruposNuevos,
      idGrupo: this.grupoSeleccionado.idAgrupadorEspacioFisico
    }
    this.grupoService.guardarAsignacion(asignacionDTO).subscribe(r => {
      if (r && r.error) {
        this.mensajeService.showMessage("error", r.descripcion)
      } else {
        this.mensajeService.showMessage("success", r.descripcion)
      }
      this.ref.close()
    })
  }
  salir() {
    this.ref.close()
  }
  handleMoveToTarget($event: any) {
    this.listaDeGruposNuevos = this.listaDeGruposNuevos.concat($event.items)
    this.listaDeGruposNuevos = this.quitarRepetidos(this.listaDeGruposNuevos);
  }
  handleMoveToSource($event: any) {
    this.listaDeGruposQuitados = this.listaDeGruposQuitados.concat($event.items)
    this.listaDeGruposQuitados = this.quitarRepetidos(this.listaDeGruposQuitados);
  }
  
  quitarRepetidos(lista: any[]): any[] {
    const map = new Map();
    lista.forEach(salon => {
        map.set(salon.idEspacioFisico, salon);
    });

    return Array.from(map.values());
  }

}
