import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { AgrupacionPorFacultad } from 'src/app/componentes/datos/gestionar-asignatura/model/agrupacion-por-facultad';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/dto/espacio-fisico/out/agrupador.espacio.fisico.dto';


@Component({
  selector: 'app-filtro-grupo-espacio-fisico',
  templateUrl: './filtro-grupo-espacio-fisico.component.html',
  styleUrls: ['./filtro-grupo-espacio-fisico.component.scss']
})
export class FiltroGrupoEspacioFisicoComponent implements OnInit {

  @Output() emitirGrupoSeleccionado = new EventEmitter<number[]>();
  @Input() lectura: boolean
  @Input() agrupadoresLectura: AgrupacionPorFacultad[]
  @Input() facultadSeleccionada: number
  lstFacultadOutDTO: FacultadOutDTO[]
  idFacultadesSeleccionadas: number[]
  agrupadoresSeleccionados: number[]
  listaAgrupadores: AgrupadorEspacioFisicoDTO[]
  constructor(private sharedService: SharedService,
  ) {}
  ngOnInit(): void {
    this.obtenerFacultades()
  }

  obtenerFacultades() {
    this.sharedService.consultarFacultades().subscribe(r => {
      this.lstFacultadOutDTO = r
      if (this.facultadSeleccionada) {
        this.idFacultadesSeleccionadas = []
        this.idFacultadesSeleccionadas.push(this.facultadSeleccionada)
        this.onChangeFacultad()
      }
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
    console.log(this.agrupadoresSeleccionados)
    this.emitirGrupoSeleccionado.emit(this.agrupadoresSeleccionados)
  }
}
