import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-visualizador-excel',
  templateUrl: './visualizador-excel.component.html',
  styleUrls: ['./visualizador-excel.component.scss']
})
export class VisualizadorExcelComponent implements OnInit {

  data: any[][] = [];
  base64: string
  headers: string[] = [];
  selectedRow: any;
  constructor(private config: DynamicDialogConfig) {

  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
  }

  ngOnInit(): void {
    this.base64 = this.config.data.base64
    this.processDataFromBase64(this.base64);
  }
  processDataFromBase64(base64String: string) {
    this.data = this.readExcelFromBase64(base64String);
    this.headers = this.data.shift() || [];
  }
  public readExcelFromBase64(base64String: string): any[][] {
    const buffer = this.base64ToArrayBuffer(base64String);
    const wb: XLSX.WorkBook = XLSX.read(buffer, { type: 'array' });
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    return XLSX.utils.sheet_to_json(ws, { header: 1 });
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

}
