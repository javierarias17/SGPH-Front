import { Component, ViewChild} from '@angular/core';
import { DocenteOutDTO } from 'src/app/componentes/dto/docente/out/docente.out.dto';

@Component({
	selector: 'app-crear-editar-ver-docente',
	templateUrl: './crear-editar-ver-docente.component.html',
	styleUrls: ['./crear-editar-ver-docente.component.css']
})
export class CrearEditarVerDocenteComponent {

	@ViewChild('crearEditarVerDocente') crearEditarVerDocente: CrearEditarVerDocenteComponent;

	public visible: boolean = false;

	public tituloModal: string = "Editar curso";

	public abrirModal(DocenteOutDTOSeleccionado:DocenteOutDTO, tituloModal: string) {
		this.DocenteOutDTOSeleccionado = DocenteOutDTOSeleccionado;
		this.tituloModal = tituloModal;
		this.visible=true;
	}

	/*Generales*/    
	public DocenteOutDTOSeleccionado:DocenteOutDTO;
}
