import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroUsuarioDTO } from '../dto/usuario/filtro.usuario.dto';

@Injectable()
export class UsuarioServicio{

    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de obtener los usuarios dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param filtroDocenteDTO
	 * @return
	 */
    public consultarUsuariosPorFiltro(filtroUsuarioDTO:FiltroUsuarioDTO): Observable<any>{
        return this.http.post<any>("http://localhost:8081/AdministrarUsuario/consultarUsuariosPorFiltro",filtroUsuarioDTO);
    }  

}