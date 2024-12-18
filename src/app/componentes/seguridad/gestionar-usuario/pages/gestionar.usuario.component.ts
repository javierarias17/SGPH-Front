import { Component, ViewChild } from '@angular/core';
import { UsuarioOutDTO } from '../model/out/usuario.out.dto';
import { EstadoUsuarioEnum } from '../../../common/enum/estado.usuario.enum';
import { FiltroUsuarioDTO } from '../model/in/filtro.usuario.dto';
import { UsuarioService } from '../../../common/services/usuario.service';
import { MessageService } from 'primeng/api';
import { ProgramaService } from '../../../common/services/programa.service';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import { CrearEditarVerUsuarioComponent } from '../components/crear-editar-ver-usuario/crear.editar.ver.usuario.component';
import { RolOutDTO } from '../model/out/rol.out.dto';
import { TranslateService } from '@ngx-translate/core';
import { LenguajeService } from '../../../common/services/lenguaje.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-gestionar-usuario',
    templateUrl: './gestionar.usuario.component.html',
    styleUrls: ['./gestionar.usuario.component.css'],
	providers:[UsuarioService, ProgramaService, LenguajeService]
})
export class GestionarUsuarioComponent {
    private readonly PAGINA_CERO: number = 0;

    private readonly REGISTROS_POR_PAGINA: number = 10;

    public pagina: number = this.PAGINA_CERO;

    public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;

    public totalRecords: number;

    public listaUsuarioOutDTO: UsuarioOutDTO[] = [];

    public listaEstados:{ label: string; value: string }[] = [];  

    public mapaProgramas: Map<number, ProgramaOutDTO> = new Map<number, ProgramaOutDTO>();

    /** Mapa de roles para accederlos rápidamente por el identificador*/
    public mapaRoles: Map<number, RolOutDTO> = new Map<number, RolOutDTO>();

    /*Filtro*/
    public filtroUsuarioDTO: FiltroUsuarioDTO = new FiltroUsuarioDTO();

    public usuarioOutDTOSeleccionado: UsuarioOutDTO = new UsuarioOutDTO();

    /*TEMPORALES*/
    inactivarUsuarioDialog: boolean = false;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private usuarioService: UsuarioService,
        private programaService: ProgramaService,
        private translateService: TranslateService,
        public dialog: DialogService
    ) {
    }

    public ngOnInit() {

        this.programaService.consultarProgramas().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {         
                lstProgramaOutDTO.forEach((programaOutDTO: ProgramaOutDTO) => {
                this.mapaProgramas.set(programaOutDTO.idPrograma, programaOutDTO);
              });
            },
            (error) => {
              console.error(error);
            }
        );

        this.usuarioService.consultarRoles().subscribe(
            (lstRolOutDTO: RolOutDTO[]) => {   
                let listaRoles:RolOutDTO[] = lstRolOutDTO;  
                //Se crea el mapa de roles  
                listaRoles.forEach(rolOutDTO =>{
                    this.mapaRoles.set(rolOutDTO.idRol, rolOutDTO);        
                });      
            },
            (error) => {
              console.error(error);
            }
        );  
      
        Object.keys(EstadoUsuarioEnum).forEach(key => {
            const translatedLabel = this.translateService.instant('gestionar.usuario.filtro.estado.usuario.' + key);
            this.listaEstados.push({ label: translatedLabel, value: key });
        });
        
        this.filtroUsuarioDTO.pagina = this.pagina;
        this.filtroUsuarioDTO.registrosPorPagina = this.registrosPorPagina;
        this.consultarUsuariosPorFiltro();
    }

    /**
     * Método encargado de invocar el servicio que permite consultar 
     * los usuarios por filtro
     *
     * @author parias 
     */
    private consultarUsuariosPorFiltro() {
        this.usuarioService
            .consultarUsuariosPorFiltro(this.filtroUsuarioDTO)
            .subscribe(
                (response: any) => {
                    this.listaUsuarioOutDTO = response.content;
                    this.totalRecords = response.totalElements;
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    /**
     * Método invocado por el paginador para consultar determinada
     * pagina de usuarios
     *
     * @author parias 
     */
    public onPageChange(event: any) {
        this.filtroUsuarioDTO.pagina = event.page;
        this.consultarUsuariosPorFiltro();
    }

    /**
     * Método invocado por los inputs de nombres y número de identificación 
     * para consultar consultar los usuarios por dichos criterios de busqueda
     *
     * @author parias 
     */
    public inputsChange(): void {
        if (this.filtroUsuarioDTO.numeroIdentificacion === '') {
            this.filtroUsuarioDTO.numeroIdentificacion = null;
        }
        if (this.filtroUsuarioDTO.nombre === null) {
            this.filtroUsuarioDTO.nombre = '';
        }
        this.consultarUsuariosPorFiltro();
    }

    /**
     * Método invocado por el botón activar/inactivar para mostrar el mensaje de confirmación
     * con el nombre del usuario que se ha seleccionado
     *
     * @author parias 
     */
    public obtenerNombreCompletoUsuarioSeleccionado(): string {
        return this.construirNombreCompletoUsuario(this.usuarioOutDTOSeleccionado);
    }

    /**
     * Método invocado por la tabla para obtener el nombre completo de cada usuario
     * que se mostrará en la pagina seleccionada
     *
     * @author parias 
     */
    public obtenerNombreCompletoUsuario(usuarioOutDTO:UsuarioOutDTO): string {
        return this.construirNombreCompletoUsuario(usuarioOutDTO);
    }

    private construirNombreCompletoUsuario(usuarioOutDTO:UsuarioOutDTO):string{
        return (
            (usuarioOutDTO.primerNombre ? usuarioOutDTO.primerNombre + ' ': '') +
            (usuarioOutDTO.segundoNombre ? usuarioOutDTO.segundoNombre + ' ': '') +
            (usuarioOutDTO.primerApellido ? usuarioOutDTO.primerApellido + ' ' : '') +
            (usuarioOutDTO.segundoApellido ? usuarioOutDTO.segundoApellido : '')
        );
    }

     /**
     * Método invocado por la tabla para obtener los nombres de los programas asociados
     * a cada usuario
     *
     * @author parias 
     */
    public obtenerNombrePrograma(idPrograma: number):string{
        const programa = this.mapaProgramas.get(idPrograma);
        if (programa) {
            return programa.nombre;
        }
        return "";
    }

     /**
     * Método invocado por la tabla para obtener los nombres de los roles asociados
     * a cada usuario
     *
     * @author parias 
     */
    public obtenerNombreRol(idRol: number):string{
        const rolOutDTO = this.mapaRoles.get(idRol);
        if (rolOutDTO) {
            return this.translateService.instant('gestionar.usuario.filtro.rol.usuario.' + rolOutDTO.rolUsuario);
        }
        return "";
    }

    /**
     * Método invocado por el botón Inactivar para cambiar el estado del usuario
     *
     * @author parias 
     */
    public cambiarEstadoUsuario(usuarioOutDTOSeleccionado: UsuarioOutDTO) {
        this.usuarioOutDTOSeleccionado = { ...usuarioOutDTOSeleccionado };
        this.inactivarUsuarioDialog = true;
    }

    /**
     * Método invocado por el modal de confirmación activar/inactivar 
     * para efectuar la actualización del estado
     *
     * @author parias 
     */
    public confirmarCambioEstado() {
        this.inactivarUsuarioDialog = false;
        this.usuarioOutDTOSeleccionado.estado = this.usuarioOutDTOSeleccionado.estado === EstadoUsuarioEnum.ACTIVO 
        ? EstadoUsuarioEnum.INACTIVO 
        : EstadoUsuarioEnum.ACTIVO;

        this.usuarioService.cambiarEstadoUsuarioPorIdUsuario(this.usuarioOutDTOSeleccionado.idUsuario).subscribe(
            (usuarioOutDTO: UsuarioOutDTO) => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario '+EstadoUsuarioEnum[this.usuarioOutDTOSeleccionado.estado]+' con éxito.' });
                this.consultarUsuariosPorFiltro();
            },
            (error) => {
              console.error(error);
            }
        ); 
    }

    /**
     * Método invocado por el modal de confirmación activar/inactivar 
     * para obtener el estado opuesto del usuario seleccionado
     *
     * @author parias 
     */
    public obtenerEstadoUsuarioContrario():string {
        return this.usuarioOutDTOSeleccionado.estado === EstadoUsuarioEnum.ACTIVO 
        ? this.translateService.instant('gestionar.usuario.accion.inactivar') 
        : this.translateService.instant('gestionar.usuario.accion.activar') ;
    }

     /**
     * Método invocado por el evento del componente hijo para refrescar 
     * la información de la tabla
     *
     * @author parias 
     */
    public actualizarInformacionUsuarios():void{
        this.consultarUsuariosPorFiltro();
    }


    public crearUsuario(){
        const ref = this.dialog.open(CrearEditarVerUsuarioComponent, {
            height: 'auto',
            width: '800px',
            header: 'Crear usuario',
            closable: false,
            data: {
              usuarioOutDTOSeleccionado: null,
              lectura: false
            }
          },)
          ref.onClose.subscribe(r => {
            this.consultarUsuariosPorFiltro();
          })
    }

    public editarUsuario(usuarioOutDTOSeleccionado:UsuarioOutDTO){
        const ref = this.dialog.open(CrearEditarVerUsuarioComponent, {
            height: 'auto',
            width: '800px',
            header: 'Editar usuario',
            closable: false,
            data: {
              usuarioOutDTOSeleccionado: usuarioOutDTOSeleccionado,
              lectura: false
            }
          },)
          ref.onClose.subscribe(r => {
            this.consultarUsuariosPorFiltro();
          })
    }

    public verUsuario(usuarioOutDTOSeleccionado:UsuarioOutDTO){
        const ref = this.dialog.open(CrearEditarVerUsuarioComponent, {
            height: 'auto',
            width: '800px',
            header: 'Ver usuario',
            closable: false,
            data: {
                usuarioOutDTOSeleccionado: usuarioOutDTOSeleccionado,
                lectura: true
            }
          },)
          ref.onClose.subscribe(r => {
            this.consultarUsuariosPorFiltro();
          })
    }
}
