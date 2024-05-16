import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { GrupoService } from '../../services/grupo.service';

@Component({
  selector: 'app-asignar-espacio-fisico',
  templateUrl: './asignar-espacio-fisico.component.html',
  styleUrls: ['./asignar-espacio-fisico.component.scss']
})
export class AsignarEspacioFisicoComponent implements OnInit {

  grupoSeleccionado: AgrupadorEspacioFiscioDTO

  listaFacultadoes: FacultadOutDTO[] = []
  listaTipoEspacioFisico: TipoEspacioFisicoOutDTO[] = []
  
  espaciosFisicosDisponibles: any = []
  espasciosFisicosAsignados: any = []

  filtro: any = {
    idUbicacion: "",
    idTipo: "",
    nombre: ""
  } as any

  constructor(private config: DynamicDialogConfig,
    private grupoService: GrupoService
  ) {}
  ngOnInit(): void {
    this.grupoSeleccionado = this.config.data?.grupo
    this.grupoService.obtenerEspacioFiscioAgrupador(this.grupoSeleccionado.idAgrupadorEspacioFisico).subscribe({
      next: (r) =>
        this.espasciosFisicosAsignados = r
    })
    this.grupoService.obtenerEspacioFiscioSinAsignarAlGrupo(this.grupoSeleccionado.idAgrupadorEspacioFisico).subscribe({
      next: (r) =>
        this.espaciosFisicosDisponibles = r
    })
  }
  inicializarFormulario() {
  }

}
