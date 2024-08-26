import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroUsuarioDTO } from '../dto/usuario/in/filtro.usuario.dto';
import { UsuarioInDTO } from '../dto/usuario/in/usuario.in.dto';
import { UsuarioOutDTO } from '../dto/usuario/out/usuario.out.dto';
import { RolOutDTO } from '../dto/usuario/out/rol.out.dto';
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
        return this.http.post<any>(url, filtroUsuarioDTO);   
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
	 * Método encargado de consultar todos los estados de usuario
	 * 
	 * @author apedro
	 * 
	 * @return
	 */
	public cambiarEstadoUsuarioPorIdUsuario(idUsuario:number) {
		const params = new HttpParams().set('idUsuario', idUsuario.toString());
		const url = `${environment.url}${this.urlUsuario}/cambiarEstadoUsuarioPorIdUsuario`;
		return this.http.get<UsuarioOutDTO>(url, { params });
    }  
	public consultarUsuarioActivoPorIdPersona(idPersona:number) {
		const params = new HttpParams().set('idPersona', idPersona.toString());
		const url = `${environment.url}${this.urlUsuario}/consultarUsuarioPorIdPersona`;
		return this.http.get<UsuarioOutDTO>(url, { params });
    }  
}