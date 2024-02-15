import { Component, ViewChild } from '@angular/core';
import { CursoPlanificacionOutDTO } from 'src/app/componentes/dto/curso/out/curso.planificacion.out.dto';

@Component({
  selector: 'app-crear-editar-consultar-curso',
  templateUrl: './crear-editar-consultar-curso.component.html',
  styleUrls: ['./crear-editar-consultar-curso.component.css']
})
export class CrearEditarConsultarCursoComponent {

    @ViewChild('crearEditarConsultarCurso') crearEditarConsultarCurso: CrearEditarConsultarCursoComponent;

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
