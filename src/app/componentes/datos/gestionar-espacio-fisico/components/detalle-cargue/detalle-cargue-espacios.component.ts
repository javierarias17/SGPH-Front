import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-detalle-cargue',
  templateUrl: './detalle-cargue-espacios.component.html',
  styleUrls: ['./detalle-cargue-espacios.component.css']
})
export class ModalDetalleCargueComponent implements OnInit {
  archivo: string;
  facultad: string;
  detalleCargue: string[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // Extraer los datos pasados al modal desde el `data` del config
    const data = this.config.data;
    this.archivo = data.archivo;
    this.facultad = data.facultad;
    this.detalleCargue = data.detalleCargue;
  }

  cerrarModal(): void {
    this.ref.close();
  }
}
