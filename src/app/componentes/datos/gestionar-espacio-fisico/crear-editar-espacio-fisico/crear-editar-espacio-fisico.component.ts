import { Component, OnInit } from '@angular/core';
import { DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EspacioFisicoDTO } from 'src/app/componentes/dto/espacio-fisico/out/espacio.fisico.dto';
import { EspacioFisicoOutDTO } from 'src/app/componentes/dto/espacio-fisico/out/espacio.fisico.out.dto';
import { EspacioFisicoServicio } from 'src/app/componentes/servicios/espacio.fisico.servicio';
import { AgrupacionPorFacultad } from '../../gestionar-asignatura/model/agrupacion-por-facultad';

@Component({
  selector: 'app-crear-editar-espacio-fisico',
  templateUrl: './crear-editar-espacio-fisico.component.html',
  styleUrls: ['./crear-editar-espacio-fisico.component.scss']
})
export class CrearEditarEspacioFisicoComponent implements OnInit {
  espacio: EspacioFisicoOutDTO = {} as EspacioFisicoOutDTO
  agrupadoresLectura: AgrupacionPorFacultad[]
  lectura: boolean
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private espacioFisicoService: EspacioFisicoServicio
  ) {}

  ngOnInit(): void {
    this.lectura = this.config.data?.lectura
    if (this.config.data?.idEspacioFisico) {
      this.infoEspacioFisico()
    }
  }
  infoEspacioFisico() {
    this.espacioFisicoService.consultarEspacioFisicoPorIdEspacioFisico(this.config.data.idEspacioFisico).subscribe(r => {
      this.espacio = r
      if (r) {
        this.agrupadores()
      }
    })
  }

  agrupadores() {
    const agrupacionPorFacultad: AgrupacionPorFacultad[] = this.espacio.lstIdAgrupadorEspacioFisico.reduce((acc: AgrupacionPorFacultad[], agrupador) => {
      const existingGroup = acc.find(group => group.idFacultad === agrupador.idFacultad);
      if (existingGroup) {
          existingGroup.agrupadorDTOs.push(agrupador);
      } else {
          acc.push({ idFacultad: agrupador.idFacultad, nombreFacultad: agrupador.nombreFacultad, agrupadorDTOs: [agrupador] });
      }
      return acc;
    }, []);
    this.agrupadoresLectura = agrupacionPorFacultad
  }


  salir() {
    this.ref.close()
  }
  guardar() {
    
  }
}
