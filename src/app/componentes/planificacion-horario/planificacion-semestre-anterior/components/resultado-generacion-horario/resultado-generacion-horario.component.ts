import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-resultado-generacion-horario',
  templateUrl: './resultado-generacion-horario.component.html',
  styleUrls: ['./resultado-generacion-horario.component.css']
})
export class ResultadoGeneracionHorarioComponent implements OnInit{

	public listaErrores: string[]=[];
    public cantidadCursosActualizados: number=0;
    public cantidadCursosNoCorrelacionados: number=0;

	constructor(private config: DynamicDialogConfig){

	}
	public ngOnInit():void{
		this.listaErrores=this.config.data.listaErrores;
		this.cantidadCursosActualizados = this.config.data.cantidadCursosActualizados;
		this.cantidadCursosNoCorrelacionados=this.config.data.cantidadCursosNoCorrelacionados;		
	}

}
