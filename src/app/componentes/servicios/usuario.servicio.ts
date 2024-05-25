import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroUsuarioDTO } from '../dto/usuario/in/filtro.usuario.dto';
import { TipoIdentificacionOutDTO } from '../dto/usuario/out/tipo.identificacion.out.dto';
import { UsuarioInDTO } from '../dto/usuario/in/usuario.in.dto';
import { UsuarioOutDTO } from '../dto/usuario/out/usuario.out.dto';
import { RolOutDTO } from '../dto/usuario/out/rol.out.dto';

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

	/**
	 * Método encargado de guardar o actualizar un usuario
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @param usuarioInDTO
	 * @return
	 */
	public guardarUsuario(usuarioInDTO: UsuarioInDTO) {
		return this.http.post<UsuarioOutDTO>("http://localhost:8081/AdministrarUsuario/guardarUsuario",usuarioInDTO);
	}

	/**
	 * Método encargado de consultar todos los tipos de identificación de
	 * persona.
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
	public consultarTiposIdentificacion() {
		const url = `http://localhost:8081/AdministrarUsuario/consultarTiposIdentificacion`;
        return this.http.get<TipoIdentificacionOutDTO[]>(url);
    }  

	/**
	 * Método encargado de consultar todos los roles de usuario
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
	public consultarRoles() {
		const url = `http://localhost:8081/AdministrarUsuario/consultarRoles`;
        return this.http.get<RolOutDTO[]>(url);
    }  

	/**
	 * Método encargado de consultar todos los estados de usuario
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
	public consultarEstadosUsuario() {
		const url = `http://localhost:8081/AdministrarUsuario/consultarEstadosUsuario`;
        return this.http.get<string[]>(url);
    }  	

	/**
	 * Método encargado de consultar todos los estados de usuario
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
	public consultarPersonaPorIdentificacion(idTipoIdentificacion:number, numeroIdentificacion:string) {
	const url = `http://localhost:8081/AdministrarUsuario/consultarPersonaPorIdentificacion?idTipoIdentificacion=${idTipoIdentificacion}&numeroIdentificacion=${numeroIdentificacion}`;
		return this.http.get<UsuarioOutDTO>(url);
	}  	

}