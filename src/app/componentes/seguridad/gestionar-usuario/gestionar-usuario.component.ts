import { Component, ViewChild } from '@angular/core';
import { UsuarioOutDTO } from '../../dto/usuario/usuario.out.dto';
import { EstadoUsuarioEnum } from '../../enum/estado.usuario.enum';
import { FiltroUsuarioDTO } from '../../dto/usuario/filtro.usuario.dto';
import { UsuarioServicio } from '../../servicios/usuario.servicio';
import { MessageService } from 'primeng/api';
import { ProgramaServicio } from '../../servicios/programa.servicio';
import { ProgramaOutDTO } from '../../dto/programa/out/programa.out.dto';
import { RolUsuarioEnum } from '../../enum/rol.usuario.enum';
import { CrearEditarVerUsuarioComponent } from './crear-editar-ver-usuario/crear-editar-ver-usuario.component';

@Component({
    selector: 'app-gestionar-usuario',
    templateUrl: './gestionar-usuario.component.html',
    styleUrls: ['./gestionar-usuario.component.css'],
	providers:[MessageService, UsuarioServicio, ProgramaServicio]
})
export class GestionarUsuarioComponent {
    private readonly PAGINA_CERO: number = 0;

    private readonly REGISTROS_POR_PAGINA: number = 10;

    public pagina: number = this.PAGINA_CERO;

    public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;

    public totalRecords: number;

    public listaUsuarioOutDTO: UsuarioOutDTO[] = [];

    public listaEstados = [];

    public estadoSeleccionado: { label: string; codigo: EstadoUsuarioEnum } = null;

    public mapaProgramas: Map<number, ProgramaOutDTO> = new Map<number, ProgramaOutDTO>();

    /*Filtro*/
    public filtroUsuarioDTO: FiltroUsuarioDTO = new FiltroUsuarioDTO();

    public usuarioOutDTOSeleccionado: UsuarioOutDTO = new UsuarioOutDTO();

    /*TEMPORALES*/
    inactivarUsuarioDialog: boolean = false;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    //Referencias componentes hijos
    @ViewChild('crearEditarVerUsuario') crearEditarVerUsuario: CrearEditarVerUsuarioComponent;

    constructor(
        private messageService: MessageService,
        private usuarioServicio: UsuarioServicio,
        private programaServicio: ProgramaServicio
    ) {}

    public ngOnInit() {

        this.programaServicio.consultarProgramas().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {         
                lstProgramaOutDTO.forEach((programaOutDTO: ProgramaOutDTO) => {
                this.mapaProgramas.set(programaOutDTO.idPrograma, programaOutDTO);
              });
            },
            (error) => {
              console.error(error);
            }
        );

        this.listaEstados = [
            { label: 'Activo', codigo: EstadoUsuarioEnum.ACTIVO },
            { label: 'Inactivo', codigo: EstadoUsuarioEnum.INACTIVO },
        ];

        this.filtroUsuarioDTO.pagina = this.pagina;
        this.filtroUsuarioDTO.registrosPorPagina = this.registrosPorPagina;
        this.consultarUsuariosPorFiltro();
    }

    private consultarUsuariosPorFiltro() {
        this.usuarioServicio
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

    public inputsChange(): void {
        if (this.filtroUsuarioDTO.numeroIdentificacion === '') {
            this.filtroUsuarioDTO.numeroIdentificacion = null;
        }
        if (this.filtroUsuarioDTO.nombre === null) {
            this.filtroUsuarioDTO.nombre = '';
        }
        this.consultarUsuariosPorFiltro();
    }

    public onEstadoChange(): void {
        if (this.estadoSeleccionado) {
            this.filtroUsuarioDTO.estado =
                this.estadoSeleccionado.codigo === EstadoUsuarioEnum.INACTIVO
                    ? false
                    : true;
        } else {
            this.filtroUsuarioDTO.estado = null;
        }
        this.filtroUsuarioDTO.pagina = this.PAGINA_CERO;
        this.consultarUsuariosPorFiltro();
    }

    public obtenerNombreCompletoUsuarioSeleccionado(): string {
        return this.construirNombreCompletoUsuario(this.usuarioOutDTOSeleccionado);
    }

    public obtenerNombreCompletoUsuario(usuarioOutDTO:UsuarioOutDTO): string {
        return this.construirNombreCompletoUsuario(usuarioOutDTO);
    }

    private construirNombreCompletoUsuario(usuarioOutDTO:UsuarioOutDTO):string{
        return (
            (usuarioOutDTO.primerNombre
                ? usuarioOutDTO.primerNombre + ' '
                : '') +
            (usuarioOutDTO.segundoNombre
                ? usuarioOutDTO.segundoNombre + ' '
                : '') +
            (usuarioOutDTO.primerApellido
                ? usuarioOutDTO.primerApellido + ' '
                : '') +
            (usuarioOutDTO.segundoApellido
                ? usuarioOutDTO.segundoApellido
                : '')
        );
    }

    public obtenerNombrePrograma(idPrograma: number):string{
        const programa = this.mapaProgramas.get(idPrograma);
        if (programa) {
            return programa.nombre;
        }
        return "";
    }

    public obtenerNombreRol(idRol:number):string{
        for (const [nombre, id] of Object.entries(RolUsuarioEnum)) {
            if (id === idRol) {
                return nombre;
            }
        }
        return "";
    }

    public onPageChange(event: any) {
        this.filtroUsuarioDTO.pagina = event.page;
        this.consultarUsuariosPorFiltro();
    }

    //Crear, Editar y Ver docente
    public abrirModalCrearEditarVerUsuario(usuarioOutDTOSeleccionado: UsuarioOutDTO, tituloModal: string ) {
        if (this.crearEditarVerUsuario) {
            this.crearEditarVerUsuario.abrirModal(usuarioOutDTOSeleccionado, tituloModal);
        }
    }

    /*Inactivar curso*/
    public inactivarUsuario(usuarioOutDTOSeleccionado: UsuarioOutDTO) {
        this.usuarioOutDTOSeleccionado = { ...usuarioOutDTOSeleccionado };
        this.inactivarUsuarioDialog = true;
    }

    public confirmarInactivacion() {
        this.inactivarUsuarioDialog = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Usuario inactivado',
            life: 3000,
        });
    }
}
