import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { AgrupadorEspacioFiscioDTO } from '../../model/AgrupadorEspacioFisicoDTO';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { AgrupacionPorFacultad } from 'src/app/componentes/datos/gestionar-asignatura/model/agrupacion-por-facultad';

@Component({
  selector: 'app-filtro-grupo-espacio-fisico',
  templateUrl: './filtro-grupo-espacio-fisico.component.html',
  styleUrls: ['./filtro-grupo-espacio-fisico.component.scss']
})
export class FiltroGrupoEspacioFisicoComponent implements OnInit {

  @Output() emitirGrupoSeleccionado = new EventEmitter<AgrupadorEspacioFiscioDTO[]>();
  @Input() lectura: boolean
  @Input() agrupadoresLectura: AgrupacionPorFacultad[]
  lstFacultadOutDTO: FacultadOutDTO[]
  idFacultadesSeleccionadas: number[]
  agrupadoresSeleccionados: AgrupadorEspacioFiscioDTO[]
  listaAgrupadores: AgrupadorEspacioFiscioDTO[]
  constructor(private sharedService: SharedService,
  ) {}
  ngOnInit(): void {
    this.obtenerFacultades()
  }

  obtenerFacultades() {
    this.sharedService.consultarFacultades().subscribe(r => {
      this.lstFacultadOutDTO = r
    })
  }
  onChangeFacultad() {
    if (this.idFacultadesSeleccionadas != null) {
      this.sharedService.obtenerAgrupadorEspacioFisico(this.idFacultadesSeleccionadas).subscribe(r => {
        this.listaAgrupadores = r
      })
    } else {
      this.listaAgrupadores = []
    }
  }
  onChangeAgrupador() {
    this.emitirGrupoSeleccionado.emit(this.agrupadoresSeleccionados)
  }
}
