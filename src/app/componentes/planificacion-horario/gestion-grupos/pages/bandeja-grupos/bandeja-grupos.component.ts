import { Component, OnInit } from '@angular/core';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { LazyLoadEvent } from 'primeng/api';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { CrearEditarGrupoComponent } from '../../components/crear-editar-grupo/crear-editar-grupo.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AsignarEspacioFisicoComponent } from '../../components/asignar-espacio-fisico/asignar-espacio-fisico.component';
import { FacultadService } from 'src/app/componentes/servicios/facultad.service';
import { AgrupadorService } from '../../services/agrupador.service';

interface FiltroGrupoDTO{
    listaIdFacultades: number[],
    nombre:string,
    pageNumber:number,
    pageSize:number
}
@Component({
    selector: 'app-bandeja-grupos',
    templateUrl: './bandeja-grupos.component.html'
})
export class BandejaGruposComponent implements OnInit {
    public facultadesSeleccionadas: number[] = [];
    public nombre: string;
    public lstFacultadOutDTO: FacultadOutDTO[] = [];

    grupos: AgrupadorEspacioFiscioDTO[];

    readonly PAGE_SIZE: number = 10;

    totalRecords: number;
    cargando: boolean;
    filtro: FiltroGrupoDTO;
    constructor(
        private agrupadorService: AgrupadorService,
        private facultadService: FacultadService,
        private dialog: DialogService
    ) {}
    
    public ngOnInit(): void {
        this.consultarFacultades();
        this.listarGruposBase();
    }

    private consultarFacultades() {
        this.facultadService.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.lstFacultadOutDTO = lstFacultadOutDTO.map(
                    (facultadOutDTO: FacultadOutDTO) => ({
                        abreviatura: facultadOutDTO.abreviatura,
                        nombre: facultadOutDTO.nombre,
                        idFacultad: facultadOutDTO.idFacultad,
                    })
                );
            },
            (error) => {
                console.error(error);
            }
        );
    }

    public inputsChange():void{
        this.onChangeFacultad();
	}

    public onChangeFacultad() {
        this.filtro = {
            listaIdFacultades: this.facultadesSeleccionadas,
            nombre: (this.nombre==='' || this.nombre===null)? null: this.nombre,
            pageNumber: 0,
            pageSize: this.PAGE_SIZE
        };
        this.agrupadorService
        .filtrarGrupos(this.filtro)
        .subscribe((r) => {
            this.grupos = r.content;
            this.totalRecords = r.totalElements;
            this.cargando = false;
        });
    }

    private listarGruposBase(){
        this.filtro = {
            listaIdFacultades: [],
            nombre: null,
            pageNumber: 0,
            pageSize: this.PAGE_SIZE
        };
        this.agrupadorService
        .filtrarGrupos(this.filtro)
        .subscribe((r) => {
            this.grupos = r.content;
            this.totalRecords = r.totalElements;
            this.cargando = false;
        });
    }


    public listarGrupos($event: LazyLoadEvent) {
        this.filtro = {
            listaIdFacultades: this.facultadesSeleccionadas,
            nombre: (this.nombre==='' || this.nombre===null)? null: this.nombre,
            pageNumber: Math.floor($event.first / $event.rows),
            pageSize: $event.rows
        };

        this.agrupadorService
            .filtrarGrupos(this.filtro)
            .subscribe((r) => {
                this.grupos = r.content;
                this.totalRecords = r.totalElements;
                this.cargando = false;
        });        
    }

    verGrupo(id: number) {
        const ref = this.dialog.open(CrearEditarGrupoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Información Agrupador',
            closable: false,
            data: {
                id: id,
                lectura: true,
            },
        });
    }

    editarGrupo(grupo: AgrupadorEspacioFiscioDTO) {
        const ref = this.dialog.open(CrearEditarGrupoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Editar Agrupador',
            closable: false,
            data: {
                grupo: grupo,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarGruposBase();
        });
    }
    asignarEspacioFisico(grupo: AgrupadorEspacioFiscioDTO) {
        const ref = this.dialog.open(AsignarEspacioFisicoComponent, {
            height: 'auto',
            width: '920px',
            header: 'Asignar espacio fisico',
            closable: false,
            data: {
                grupo: grupo,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarGruposBase();
        });
    }

    registrarGrupo() {
        const ref = this.dialog.open(CrearEditarGrupoComponent, {
            height: 'auto',
            width: '800px',
            header: 'Registrar Agrupador',
            closable: false,
            data: {
                lectura: false,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarGruposBase();
        });
    }
}
