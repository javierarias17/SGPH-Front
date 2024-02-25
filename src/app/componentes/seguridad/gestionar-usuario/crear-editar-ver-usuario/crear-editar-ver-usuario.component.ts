import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { UsuarioOutDTO } from '../../../dto/usuario/usuario.out.dto';
import { UsuarioInDTO } from '../../../dto/usuario/usuario.in.dto';
import { RolUsuarioEnum } from '../../../enum/rol.usuario.enum';
import { ProgramaServicio } from '../../../servicios/programa.servicio';
import { ProgramaOutDTO } from '../../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../../dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from '../../../servicios/facultad.servicio';
import { UsuarioServicio } from '../../../servicios/usuario.servicio';
import { TipoIdentificacionOutDTO } from '../../../dto/usuario/tipo.identificacion.out.dto';
import { RolOutDTO } from '../../../dto/usuario/rol.out.dto';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-crear-editar-ver-usuario',
  templateUrl: './crear-editar-ver-usuario.component.html',
  styleUrls: ['./crear-editar-ver-usuario.component.css'],
  providers: [ FacultadServicio, UsuarioServicio]

})
export class CrearEditarVerUsuarioComponent {

    @ViewChild('crearEditarVerUsuario') crearEditarVerUsuario: CrearEditarVerUsuarioComponent;

    @Output() modalClosedEmitter = new EventEmitter<void>();

	public mostrarModalCRUD: boolean = false;
	public tituloModal: string = "";

    public esVer: boolean = false;
    public esCrear: boolean = false;
    public esEditar: boolean = false;
    
    /** Mapa de todos los programas para accederlos rápidamente por el identificador*/
    public mapaProgramas: Map<number, ProgramaOutDTO> = new Map<number, ProgramaOutDTO>();
    /** Mapa de todos las facultades para accederlos rápidamente por el identificador*/
    public mapaFacultades: Map<number, FacultadOutDTO> = new Map<number, FacultadOutDTO>();
    /** Mapa de roles para accederlos rápidamente por el identificador*/
    public mapaRoles: Map<number, RolUsuarioEnum> = new Map<number, RolUsuarioEnum>();

    /** Listas de facultades seleccionadas*/
    public lstIdFacultadSeleccionadas: number[] = [];    

    /** Listas de facultades para el selector multiple facultad*/
    public listaFacultades: FacultadOutDTO[] = [];    
    /** Listas de programas para el selector multiple programas*/
    public listaProgramas: ProgramaOutDTO[] = [];
    /** Listas de roles para el selector multiple roles*/
    public listaRoles: RolOutDTO[] = [];  
    /** Listas de estados de usuario para el selector único estado*/
    public listaEstados:{ label: string; value: string }[] = [];  
    /** Listas de tipo de identificación para el selector único tipo de identificación*/
    public listaTiposIdentificacion:TipoIdentificacionOutDTO[] = [];  


    /** Usuario que ingresa al componente*/    
	public usuarioOutDTOSeleccionado:UsuarioOutDTO;
    /** Usuario de tipo UsuarioInDTO para las operaciones de Crear y Editar*/  
    public usuarioInDTO:UsuarioInDTO;
    
    constructor(private programaServicio: ProgramaServicio,
         private facultadServicio: FacultadServicio, 
         private usuarioServicio:UsuarioServicio,
         private messageService: MessageService,){
        this.facultadServicio.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.listaFacultades = lstFacultadOutDTO;
                //Se crea el mapa de facultades  
                lstFacultadOutDTO.forEach((facultadOutDTO: FacultadOutDTO) => {
                    this.mapaFacultades.set(facultadOutDTO.idFacultad, facultadOutDTO);                
                });
            },
            (error) => {
              console.error(error);
            }
        ); 

        this.programaServicio.consultarProgramas().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                this.listaProgramas = lstProgramaOutDTO;
                //Se crea el mapa de programas  
                lstProgramaOutDTO.forEach((programaOutDTO: ProgramaOutDTO) => {
                    this.mapaProgramas.set(programaOutDTO.idPrograma, programaOutDTO);                
                });
            },
            (error) => {
              console.error(error);
            }
        ); 

        this.usuarioServicio.consultarRoles().subscribe(
            (lstRolOutDTO: RolOutDTO[]) => {   
                lstRolOutDTO.forEach(rolOutDTO =>{
                    this.mapaRoles.set(rolOutDTO.idRol, rolOutDTO.rolUsuario);        
                });
            },
            (error) => {
              console.error(error);
            }
        );

        this.usuarioServicio.consultarTiposIdentificacion().subscribe(
            (lstTipoIdentificacionOutDTO: TipoIdentificacionOutDTO[]) => {               
                this.listaTiposIdentificacion = lstTipoIdentificacionOutDTO;
            },
            (error) => {
              console.error(error);
            }
        );

        this.usuarioServicio.consultarEstadosUsuario().subscribe(
            (lstEstadoUsuario: string[]) => {   
                this.listaEstados = lstEstadoUsuario.map((estado: any) => ({ label:estado, value:estado}));               
            },
            (error) => {
              console.error(error);
            }
        );

        this.usuarioServicio.consultarRoles().subscribe(
            (lstRolOutDTO: RolOutDTO[]) => {   
                this.listaRoles = lstRolOutDTO;               
            },
            (error) => {
              console.error(error);
            }
        );
    }

	public abrirModal(usuarioOutDTOSeleccionado: UsuarioOutDTO, tituloModal: string) {
        this.esVer = false;
        this.esCrear = false;
        this.esEditar = false;
        this.usuarioOutDTOSeleccionado = usuarioOutDTOSeleccionado;
        this.tituloModal = tituloModal;
        this.mostrarModalCRUD=true;
        
        if(tituloModal==='Ver usuario'){
            this.esVer=true;
        }else if(tituloModal==='Editar usuario'){
            this.usuarioInDTO= {...usuarioOutDTOSeleccionado};
            this.esEditar = true;
        }else{
            this.usuarioInDTO= new UsuarioInDTO();
            this.esCrear=true;
        }       

        if(tituloModal!=='Ver usuario'){
            let lstIdFacultad:number[] =[];
            this.usuarioInDTO.lstIdPrograma.forEach(idPrograma =>{
                let programaOutDTO = this.mapaProgramas.get(idPrograma);
                if(programaOutDTO){
                    lstIdFacultad.push(programaOutDTO.idFacultad);
                }
            })
    
            this.lstIdFacultadSeleccionadas = [... new Set(lstIdFacultad)];
    
            this.lstIdFacultadSeleccionadas.forEach(idFacultad => {
                this.mapaProgramas.forEach(programaOutDTO => {
                    if(programaOutDTO.idFacultad===idFacultad){
                        this.listaProgramas.push(programaOutDTO);
                    }
                });            
            });
        }
	}

    public onFacultadesChange(){
        if(this.lstIdFacultadSeleccionadas!==null && this.lstIdFacultadSeleccionadas.length !== 0){
            this.programaServicio.consultarProgramasPorIdFacultad(this.lstIdFacultadSeleccionadas).subscribe(
                (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                    if(lstProgramaOutDTO.length === 0){
                        this.listaProgramas=[];
                    }else{
                        this.usuarioInDTO.lstIdPrograma=[];
                        this.listaProgramas = lstProgramaOutDTO;
                    }
                },
                (error) => {
                    console.error(error);
                }
                );   
        }else{
            this.listaProgramas=[];
            this.usuarioInDTO.lstIdPrograma=[];
        }
    }   

    public obtenerNombreCompletoUsuario():string{
        return (this.usuarioOutDTOSeleccionado.primerNombre? this.usuarioOutDTOSeleccionado.primerNombre+" ": "")
                +(this.usuarioOutDTOSeleccionado.segundoNombre? this.usuarioOutDTOSeleccionado.segundoNombre+" ": "")
                +(this.usuarioOutDTOSeleccionado.primerApellido? this.usuarioOutDTOSeleccionado.primerApellido+" ": "")
                +(this.usuarioOutDTOSeleccionado.segundoApellido? this.usuarioOutDTOSeleccionado.segundoApellido: "");
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

    public guardar() {
        this.usuarioServicio.guardarUsuario(this.usuarioInDTO).subscribe(
            (usuarioOutDTO: UsuarioOutDTO) => {
                if(this.usuarioInDTO.idPersona){
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario modificado con éxito.' });
                }else{
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado con éxito.' });
                }

            },
            (error) => {
              console.error(error);
            }
        ); 
    }

    public salir() {
        this.mostrarModalCRUD=false;
        this.modalClosedEmitter.emit();   
    }
}