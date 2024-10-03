import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroUsuarioDTO } from '../../seguridad/gestionar-usuario/model/in/filtro.usuario.dto';
import { UsuarioInDTO } from '../../seguridad/gestionar-usuario/model/in/usuario.in.dto';
import { UsuarioOutDTO } from '../../seguridad/gestionar-usuario/model/out/usuario.out.dto';
import { RolOutDTO } from '../../seguridad/gestionar-usuario/model/out/rol.out.dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsuarioService{

	urlUsuario: string = "AdministrarUsuario"
    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de obtener los usuarios dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author apedro
	 * 
	 * @param filtroDocenteDTO
	 * @return
	 */
    public consultarUsuariosPorFiltro(filtroUsuarioDTO:FiltroUsuarioDTO): Observable<any>{
		const url = `${environment.url}${this.urlUsuario}/consultarUsuariosPorFiltro`;

		 let params = new HttpParams();

		 if (filtroUsuarioDTO.nombre) {
			 params = params.set('nombre', filtroUsuarioDTO.nombre);
		 }
		 if (filtroUsuarioDTO.numeroIdentificacion) {
			 params = params.set('numeroIdentificacion', filtroUsuarioDTO.numeroIdentificacion);
		 }
		 if (filtroUsuarioDTO.estado !== null && filtroUsuarioDTO.estado !== undefined) {
			 params = params.set('estado', filtroUsuarioDTO.estado.toString()); // Convertir el estado booleano a string
		 }
		 params = params.set('pagina', filtroUsuarioDTO.pagina?.toString() || '0');
		 params = params.set('registrosPorPagina', filtroUsuarioDTO.registrosPorPagina?.toString() || '10');
	 
		 return this.http.get<any>(url, { params });
    } 

	/**
	 * Método encargado de guardar o actualizar un usuario
	 * 
	 * @author apedro
	 * 
	 * @param usuarioInDTO
	 * @return
	 */
	public guardarUsuario(usuarioInDTO: UsuarioInDTO) {
		const url = `${environment.url}${this.urlUsuario}/guardarUsuario`;
        return this.http.post<UsuarioOutDTO>(url, usuarioInDTO);   
	}

	/**
	 * Método encargado de consultar todos los roles de usuario
	 * 
	 * @author apedro
	 * 
	 * @return
	 */
	public consultarRoles() {
		const url = `${environment.url}${this.urlUsuario}/consultarRoles`;
        return this.http.get<RolOutDTO[]>(url);
    }  

	/**
	 * Método encargado de consultar todos los estados de usuario
	 * 
	 * @author apedro
	 * 
	 * @return
	 */
	public consultarEstadosUsuario() {
		const url = `${environment.url}${this.urlUsuario}/consultarEstadosUsuario`;
        return this.http.get<string[]>(url);
    }  	

	/**
	 * Método encargado de cambiar el estado de usuario
	 * 
	 * @author apedro
	 * 
	 * @return
	 */
	public cambiarEstadoUsuarioPorIdUsuario(idUsuario:number) {
		const params = new HttpParams().set('idUsuario', idUsuario.toString());
		const url = `${environment.url}${this.urlUsuario}/cambiarEstadoUsuarioPorIdUsuario`;
		return this.http.patch<UsuarioOutDTO>(url, {}, { params });
    } 

	public consultarUsuarioActivoPorIdPersona(idPersona:number) {
		const params = new HttpParams().set('idPersona', idPersona.toString());
		const url = `${environment.url}${this.urlUsuario}/consultarUsuarioPorIdPersona`;
		return this.http.get<UsuarioOutDTO>(url, { params });
    }  
}