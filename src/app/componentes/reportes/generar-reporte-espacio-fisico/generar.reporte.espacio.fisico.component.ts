import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService } from 'primeng/dynamicdialog';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import * as XLSX from 'xlsx';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';

@Component({
  selector: 'app-generar-reporte-espacio-fisico',
  templateUrl: './generar.reporte.espacio.fisico.component.html',
  styleUrls: ['./generar.reporte.espacio.fisico.component.css']
})
export class GenerarReporteEspacioFisicoComponent implements OnInit {
  formulario: FormGroup;
  base64: string;
  isLoading: boolean = false;
  resultados: any[] = [];
  messages: any[] = [];
  // Declarar las propiedades
  ubicaciones: { label: string; value: any }[] = [];
  estados: { label: string; value: string }[] = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];
  tipos: { label: string; value: any }[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private espacioFisicoService: EspacioFisicoService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUbicaciones();
    this.cargarTiposEspaciosFisicos();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      ubicacion: [null],
      estado: [null],
      tipo: [null],
      nombre: [null]
    });
  }

  cargarUbicaciones() {
    this.espacioFisicoService.consultarUbicaciones().subscribe((ubicaciones) => {
      this.ubicaciones = ubicaciones.map((u) => ({
        label: u.nombre,
        value: u.idUbicacion
      }));
    });
  }

  cargarTiposEspaciosFisicos() {
    this.espacioFisicoService.consultarTiposEspaciosFisicos().subscribe((tipos) => {
      this.tipos = tipos.map((t) => ({
        label: t.tipo,
        value: t.tipo
      }));
    });
  }

  limpiar() {
    this.formulario.reset();
  }

  visualizar() {
    const filtro = {
      idUbicacion: this.formulario.value.ubicacion,
      idEdificio: null,
      tipoEspacio: this.formulario.value.tipo,
      nombreEspacio: this.formulario.value.nombre,
      estado: this.formulario.value.estado
    };    
    this.realizarBusqueda(filtro, true);
  }

  descargar() {
    const filtro = {
      idUbicacion: this.formulario.value.ubicacion,
      idEdificio: null,
      tipoEspacio: this.formulario.value.tipo,
      nombreEspacio: this.formulario.value.nombre,
      estado: this.formulario.value.estado
    };
    this.realizarBusqueda(filtro, false);
  }

  realizarBusqueda(filtro: any, isVisualizar: boolean) {
    console.log("Filtro recibido: {}", filtro);
  
    this.isLoading = true;
    this.sharedService.obtenerReporteEspacioFisico(filtro).subscribe(
      (r) => {
        this.isLoading = false;
        if (r) {
          this.resultados = r; // Almacena los datos recibidos para visualización
          this.base64 = r.archivoBase64;
          console.log("respuesta: {}", r);
          if (isVisualizar) {
            this.dialogService.open(VisualizadorExcelComponent, {
              height: '90vh',
              width: '95%',
              header: 'Reporte espacio físico',
              contentStyle: { overflow: 'hidden' },
              data: {
                base64: this.base64
              }
            });
          } else {
            this.downloadExcelFile();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al generar el reporte:', error);
  
        // Mostrar mensaje con formato si no hay registros disponibles
        if (error.error && error.error.message === "No hay espacios físicos disponibles para generar el reporte.") {
          this.messages = [
            {
              severity: 'error',
              summary: 'No existen registros para los filtros seleccionados',
              detail: 'Por favor, intente con diferentes filtros.'
            }
          ];
        } else {
          // Mensaje genérico en caso de otro error
          this.messages = [
            {
              severity: 'error',
              summary: 'Error al generar el reporte',
              detail: 'Ocurrió un problema inesperado. Intente nuevamente más tarde.'
            }
          ];
        }
      }
    );
  }
  

  downloadExcelFile() {
    const buffer = this.base64ToArrayBuffer(this.base64);
    const workbook = XLSX.read(buffer, { type: 'array' });

    const excelBlob = new Blob([this.arrayBufferToBlob(buffer)], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(excelBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte_espacios_fisicos.xlsx';

    link.click();
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  arrayBufferToBlob(buffer: ArrayBuffer): Blob {
    return new Blob([new Uint8Array(buffer)]);
  }

  mostrarMensaje(mensaje: string) {
    alert(mensaje);
  }
  
}

