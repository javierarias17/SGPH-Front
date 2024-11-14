import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-informacion-detalle-cargue',
    templateUrl: './informacion-detalle-cargue.component.html',
    styleUrls: ['./informacion-detalle-cargue.component.scss'],
})
export class InformacionDetalleCargueComponent implements OnInit {
    detalleCargue: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        const data = this.config.data;
        console.log(data);
    }

    closeModal() {
        this.ref.close();
    }
}
