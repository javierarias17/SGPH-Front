import { Component, ViewChild } from '@angular/core';
import { CursoPlanificacionOutDTO } from '../../../dto/curso/out/curso.planificacion.out.dto';

@Component({
  selector: 'app-crear-editar-ver-curso',
  templateUrl: './crear-editar-ver-curso.component.html',
  styleUrls: ['./crear-editar-ver-curso.component.css']
})
export class CrearEditarVerCursoComponent {

    @ViewChild('crearEditarVerCurso') crearEditarVerCurso: CrearEditarVerCursoComponent;

    public visible: boolean = false;

    public tituloModal: string = "Editar curso";

    public abrirModal(cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO, tituloModal: string) {
        this.cursoPlanificacionOutDTOSeleccionado = cursoPlanificacionOutDTOSeleccionado;
        this.tituloModal = tituloModal;
        this.visible=true;
    }

    /*Generales*/    
    public cursoPlanificacionOutDTOSeleccionado:CursoPlanificacionOutDTO;
}
