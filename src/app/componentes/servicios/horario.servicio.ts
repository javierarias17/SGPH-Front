import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CrearActualizarHorarioCursoInDTO } from '../dto/horario/in/crea.actualizar.horario.curso.in.dto';
import { CrearActualizarHorarioCursoOutDTO } from '../dto/horario/out/crea.actualizar.horario.curso.out.dto';
import { FiltroFranjaHorariaDisponibleCursoDTO } from '../dto/horario/in/filtro.franja.horaria.disponible.curso.dto';
import { CrearActualizarDocentesCursoOutDTO } from '../dto/horario/out/crea.actualizar.docentes.curso.out.dto';
import { CrearActualizarDocentesCursoInDTO } from '../dto/horario/in/crea.actualizar.docentes.curso.in.dto';
import { FranjaHorariaCursoDTO } from '../dto/curso/out/franja.horaria.curso.dto';

@Injectable()
export class HorarioServicio{

    constructor(private http: HttpClient) {
    }

    
}
