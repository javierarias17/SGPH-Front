import { Component, Input, SimpleChanges } from '@angular/core';
import { ReservaTemporalService } from '../../common/services/reserva.temporal.service';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';

@Component({
  selector: 'app-detalles-reserva-temporal',
  templateUrl: './detalles.reserva.temporal.component.html',
  styleUrls: ['./detalles.reserva.temporal.component.css']
})
export class DetallesReservaTemporalComponent {
  @Input() reserva: any; // Datos de la reserva seleccionada
  @Input() mostrarDialogo: boolean = false; // Controla la visibilidad del diálogo

  usuario: any = null;
  ubicacion: string = null;
  
  constructor(private reservaService: ReservaTemporalService,
    private espacioFisicoService: EspacioFisicoService
  ) {}

  get esReservaValida(): boolean {
    return this.reserva && Object.keys(this.reserva).length > 0;
  }
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reserva'] && changes['reserva'].currentValue) {
      this.cargarUsuario();
      this.consultarUbicacion();
      console.log("Reserva actualizada en el hijo:", changes['reserva'].currentValue);
    } else {
      console.warn("Reserva no inicializada correctamente en el hijo.");
    }
  }  

  cerrarDialogo(): void {
    this.mostrarDialogo = false;
  }

  cargarUsuario(): void {
    this.reservaService.cargarFormulario(this.reserva.usuario).subscribe((data) => {
      this.usuario = data.usuario;
    });
  }

  consultarUbicacion(): void{
    this.espacioFisicoService.consultarEspacioFisicoPorIdEspacioFisico(this.reserva.idEspacioFisico).subscribe((data) => {
      this.ubicacion = data.nombreUbicacion;
    })
  }
}
