import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroUsuarioDTO } from '../dto/usuario/in/filtro.usuario.dto';
import { TipoIdentificacionOutDTO } from '../dto/usuario/out/tipo.identificacion.out.dto';
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
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
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
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @param usuarioInDTO
	 * @return
	 */
	public guardarUsuario(usuarioInDTO: UsuarioInDTO) {
		const url = `${environment.url}${this.urlUsuario}/guardarUsuario`;
        return this.http.post<UsuarioOutDTO>(url, usuarioInDTO);   
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
		const url = `${environment.url}${this.urlUsuario}/consultarTiposIdentificacion`;
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
		const url = `${environment.url}${this.urlUsuario}/consultarRoles`;
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
		const url = `${environment.url}${this.urlUsuario}/consultarEstadosUsuario`;
        return this.http.get<string[]>(url);
    }  	

	/**
	 * Método encargado de consultar todos los estados de usuario
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
	public cambiarEstadoUsuarioPorIdUsuario(idUsuario:number) {
		const params = new HttpParams().set('idUsuario', idUsuario.toString());
		const url = `${environment.url}${this.urlUsuario}/cambiarEstadoUsuarioPorIdUsuario`;
		return this.http.get<UsuarioOutDTO>(url, { params });
    }  
}