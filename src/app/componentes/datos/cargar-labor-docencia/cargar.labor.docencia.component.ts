import { Component, OnInit } from '@angular/core';
import { ProgramaService } from '../../servicios/programa.service';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { SharedService } from 'src/app/shared/service/shared.service';
import { VisualizadorExcelComponent } from 'src/app/shared/components/visualizador-excel/visualizador-excel.component';
import { DialogService } from 'primeng/dynamicdialog';
import { archivoBase64 } from 'src/app/shared/Constantes';
import { MessageService } from 'primeng/api';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
  selector: 'app-cargar-labor-docencia',
  templateUrl: './cargar.labor.docencia.component.html',
  styleUrls: ['./cargar.labor.docencia.component.css']
})
export class CargarLaborDocenciaComponent implements OnInit {

  cargar: boolean = false
  eliminar: boolean = false
  listaProgramas: ProgramaOutDTO[]
  programa: ProgramaOutDTO
  base64: number
  constructor(private programaService: ProgramaService,
              private sharedService: SharedService,
              private dialogService: DialogService,
              private messageService: ShowMessageService
  ) {

  }
  ngOnInit(): void {
    this.cargarProgramas()
  }
  cargarLabor() {
    this.cargar = !this.cargar
  }
  cargarProgramas() {
    this.programaService.consultarProgramas().subscribe(
      (r: ProgramaOutDTO[]) => {
          this.listaProgramas = r
      },
      (error) => {
          console.error(error);
      }
    );
  }
  guardar() {
    // MOCK BASE 64
    this.sharedService.cargarLaborDocente({
      idPrograma: this.programa.idPrograma,
      nombrePrograma: this.programa.nombre,
      archivoBase64: archivoBase64
    }).subscribe(r => {
      if (r && r.error) {
        this.messageService.showMessage("error", r.descripcion)
      } else {
        this.messageService.showMessage("success", r.descripcion)
      }
    })
  }
  visualizar() {
    // MOCK BASE64
    this.sharedService.obtenerVisualizarLaborDocente({
      idPrograma: this.programa.idPrograma,
      nombrePrograma: this.programa.nombre,
      archivoBase64: archivoBase64
    }).subscribe(r => {
      if (r) {
        this.base64 = r.archivoBase64
        this.dialogService.open(VisualizadorExcelComponent, {
          height: '90vh',
          width: '95%',
          header: 'Visualizar labor docente',
          contentStyle: { 'overflow': 'hidden' },
          data: {
            base64: this.base64
          }
        });
      }
    })
  }
}
