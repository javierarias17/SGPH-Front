import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService } from 'primeng/dynamicdialog';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import * as XLSX from 'xlsx';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { PeriodoAcademicoOutDTO } from '../../dto/periodo-academico/periodo-academico-out-dto';
@Component({
  selector: 'app-generar-reporte-simca',
  templateUrl: './generar.reporte.simca.component.html',
  styleUrls: ['./generar.reporte.simca.component.css']
})
export class GenerarReporteSimcaComponent implements OnInit {

  formulario: FormGroup
  listaPeriodo: string[] = ["2023-01", "2023-02"];
  listaProgramas: ProgramaOutDTO[]
  base64: string
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  periodosAcademicos: PeriodoAcademicoOutDTO[] = [];
  isLoading: boolean = false
  constructor(private fb: FormBuilder,
     private programaServicio: ProgramaServicio,
     private facultadServicio: FacultadServicio,
     private sharedService: SharedService,
     private dialogService: DialogService,
     private periodoAcademicoService: PeriodoAcademicoService
    ) {

  }

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerFacultades()
    this.obtenerPeriodoAcademico()
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      periodo: [{value: null}, Validators.required],
      idFacultad: [{value: null}],
      idPrograma: [{value: null}],
    })
  }
  obtenerPeriodosAbiertos() {

  }
  obtenerFacultades() {
    this.facultadServicio.consultarFacultades().subscribe(
      (lstFacultadOutDTO: FacultadOutDTO[]) => {
          this.lstFacultadOutDTO = lstFacultadOutDTO.map((facultadOutDTO: FacultadOutDTO) => ({ abreviatura: facultadOutDTO.abreviatura, nombre:facultadOutDTO.nombre, idFacultad:facultadOutDTO.idFacultad }));
      },
      (error) => {
        console.error(error);
      }
  ); 
  }
  obtenerPeriodoAcademico() {
    this.periodoAcademicoService.consultarPeriodosAcademicos({} as any).subscribe(r => {
      this.periodosAcademicos = r.content
      this.periodosAcademicos = this.periodosAcademicos.map(periodo => ({
        ...periodo,
        anioPeriodo: `${periodo.anio} - ${periodo.periodo}`
    }));
    })
  }
  onFacultadChange() {
    if (this.idFacultad().value!==null) {
      this.programaServicio.consultarProgramasPorIdFacultad([this.idFacultad().value]).subscribe(
          (r: ProgramaOutDTO[]) => {
              this.listaProgramas = r
          },
          (error) => {
              console.error(error);
          }
        );
        let idFacultades: number[] = []
        idFacultades.push(this.idFacultad().value)
   } else {
    this.limpiar()
   }
  }
  limpiar() {
    this.formulario.reset()
  }
  visualizar() {
    if (this.formulario.valid) {
      this.isLoading = true
      this.idPrograma().value
      this.periodo().value
      let filtro = {
        idPrograma: this.idPrograma().value,
        idPeriodo: this.periodo().value,
        idFacultad: this.idFacultad().value
      }
      this.sharedService.obtenerReporteSimca(filtro).subscribe(r => {
        this.isLoading = false
        if (r) {
          this.base64 = r.archivoBase64
          this.dialogService.open(VisualizadorExcelComponent, {
            height: '700px',
            width: '95%',
            header: 'Reporte Simca',
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
      this.idPrograma().value
      this.periodo().value
      let filtro = {
        idPrograma: this.idPrograma().value,
        idPeriodo: this.periodo().value,
        idFacultad: this.idFacultad().value
      }
      this.isLoading = true
      this.sharedService.obtenerReporteSimca(filtro).subscribe(r => {
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
    link.download = 'reporteSimca.xlsx';

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

  periodo(): FormControl {
    return this.formulario.get("periodo") as FormControl
  }
  idFacultad(): FormControl {
    return this.formulario.get("idFacultad") as FormControl
  }
  idPrograma(): FormControl {
    return this.formulario.get("idPrograma") as FormControl
  }

}
