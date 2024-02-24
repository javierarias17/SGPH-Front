import { Component, ViewChild } from '@angular/core';
import { UsuarioOutDTO } from '../../../dto/usuario/usuario.out.dto';

@Component({
  selector: 'app-crear-editar-ver-usuario',
  templateUrl: './crear-editar-ver-usuario.component.html',
  styleUrls: ['./crear-editar-ver-usuario.component.css']
})
export class CrearEditarVerUsuarioComponent {

  @ViewChild('crearEditarVerUsuario') crearEditarVerUsuario: CrearEditarVerUsuarioComponent;

	public visible: boolean = false;

	public tituloModal: string = "";

	public abrirModal(usuarioOutDTOSeleccionado: UsuarioOutDTO, tituloModal: string) {
		this.usuarioOutDTOSeleccionado = usuarioOutDTOSeleccionado;
		this.tituloModal = tituloModal;
		this.visible=true;
	}

	/*Generales*/    
	public usuarioOutDTOSeleccionado:UsuarioOutDTO;

}
