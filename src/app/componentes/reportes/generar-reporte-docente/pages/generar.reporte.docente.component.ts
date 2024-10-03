import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from '../../../common/services/programa.service';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../../common/model/facultad/out/facultad.out.dto';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService } from 'primeng/dynamicdialog';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import * as XLSX from 'xlsx';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { PeriodoAcademicoOutDTO } from '../../../periodo-academico/gestionar-periodo-academico/model/out/periodo-academico-out-dto';
import { FacultadService } from '../../../common/services/facultad.service';
import { UsuarioService } from '../../../common/services/usuario.service';
import { TipoIdentificacionOutDTO } from '../../../seguridad/gestionar-usuario/model/out/tipo.identificacion.out.dto';
import { PersonaService } from '../../../common/services/persona.service';
@Component({
  selector: 'app-generar-reporte-docente',
  templateUrl: './generar.reporte.docente.component.html',
  styleUrls: ['./generar.reporte.docente.component.css']
})
export class GenerarReporteDocenteComponent implements OnInit {

  formulario: FormGroup

  base64: string
  listaTipoIdentificacion: TipoIdentificacionOutDTO[] = [];
  isLoading: boolean = false
  constructor(private fb: FormBuilder,
     private personaService: PersonaService,
     private sharedService: SharedService,
     private dialogService: DialogService,

    ) {

  }

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerTipoDoc()

  }
  obtenerTipoDoc() {
    this.personaService.consultarTiposIdentificacion().subscribe(r => {
      this.listaTipoIdentificacion = r
    })
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      tipoIdentificacion: [null],
      primerNombre: [null],
      segundoNombre: [null],
      primerApellido: [null],
      segundoApellido: [null],
      numeroIdentificacion: [null]
    })
  }

  limpiar() {
    this.formulario.reset()
  }
  visualizar() {
    if (this.formulario.valid) {
      this.isLoading = true
      let filtro = this.formulario.value
      this.sharedService.obtenerReporteDocente(filtro).subscribe(r => {
        this.isLoading = false
        if (r) {
          this.base64 = r.archivoBase64
          this.dialogService.open(VisualizadorExcelComponent, {
            height: '90vh',
            width: '95%',
            header: 'Reporte docente',
            contentStyle: { 'overflow': 'hidden' },
            data: {
              base64: this.base64
            }
          });
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
  descargar() {
    if (this.formulario.valid) {
      let filtro = this.formulario.value
      this.isLoading = true
      this.sharedService.obtenerReporteDocente(filtro).subscribe(r => {
        this.isLoading = false
        if (r) {
          this.base64 = r.archivoBase64
          this.downloadExcelFile()
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
  downloadExcelFile() {
    const buffer = this.base64ToArrayBuffer(this.base64);
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Genera un Blob a partir de los datos del archivo Excel
    const excelBlob = new Blob([this.arrayBufferToBlob(buffer)], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(excelBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportedocente.xlsx';

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

  tipoIdentificacion(): FormControl {
    return this.formulario.get("tipoIdentificacion") as FormControl
  }

}