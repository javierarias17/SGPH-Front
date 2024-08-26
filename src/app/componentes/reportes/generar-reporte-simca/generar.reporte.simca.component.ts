import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from '../../servicios/programa.service';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../dto/facultad/out/facultad.out.dto';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService } from 'primeng/dynamicdialog';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import * as XLSX from 'xlsx';
import { PeriodoAcademicoService } from 'src/app/shared/service/periodo.academico.service';
import { PeriodoAcademicoOutDTO } from '../../dto/periodo-academico/periodo-academico-out-dto';
import { FacultadService } from '../../servicios/facultad.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';
@Component({
  selector: 'app-generar-reporte-simca',
  templateUrl: './generar.reporte.simca.component.html',
  styleUrls: ['./generar.reporte.simca.component.css']
})
export class GenerarReporteSimcaComponent implements OnInit {

  formulario: FormGroup
  listaProgramas: ProgramaOutDTO[]
  base64: string
  public lstFacultadOutDTO: FacultadOutDTO[] = [];
  periodosAcademicos: PeriodoAcademicoOutDTO[] = [];
  isLoading: boolean = false
  constructor(private fb: FormBuilder,
     private programaService: ProgramaService,
     private facultadService: FacultadService,
     private sharedService: SharedService,
     private dialogService: DialogService,
     private periodoAcademicoService: PeriodoAcademicoService
    ) {

  }

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerPeriodoAcademico()

    this.programaService.consultarProgramasPermitidosPorUsuario().subscribe(
      (lstProgramaOutDTO: ProgramaOutDTO[]) => {
          if(lstProgramaOutDTO.length === 0){
              this.listaProgramas=[];
          }else{
              this.listaProgramas=lstProgramaOutDTO;
          }
      },
      (error) => {
          console.error(error);
      }
    );

    this.limpiar();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      periodo: [{value: null}, Validators.required],
      idPrograma: [{value: null}, Validators.required],
    })
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
            idPeriodo: this.periodo().value
        }
        this.sharedService.obtenerReporteSimca(filtro).subscribe(r => {
            this.isLoading = false
            if (r) {
                this.base64 = r.archivoBase64
                this.dialogService.open(VisualizadorExcelComponent, {
                    height: '90vh',
                    width: '95%',
                    header: 'Reporte SIMCA',
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
        this.idPrograma().value
        this.periodo().value
        let filtro = {
            idPrograma: this.idPrograma().value,
            idPeriodo: this.periodo().value
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
  idPrograma(): FormControl {
    return this.formulario.get("idPrograma") as FormControl
  }

}