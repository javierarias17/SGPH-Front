import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/tipo.espacio.fisico.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { UbicacionOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { EspacioFisicoService } from 'src/app/componentes/common/services/espacio.fisico.service';
import { AgrupadorService } from '../../services/agrupador.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/agrupador.espacio.fisico.dto';

@Component({
selector: 'app-asignar-espacio-fisico',
templateUrl: './asignar-espacio-fisico.component.html',
styleUrls: ['./asignar-espacio-fisico.component.css']
})
export class AsignarEspacioFisicoComponent implements OnInit {

    grupoSeleccionado: AgrupadorEspacioFisicoDTO

    listaTipoEspacioFisico: TipoEspacioFisicoOutDTO[] = []

    espaciosFisicosDisponibles: any[] = []
    espasciosFisicosAsignados: any[] = []

    listaDeGruposNuevos: any = []
    listaDeGruposQuitados: any = []
    lstUbicacion: UbicacionOutDTO[] = [];

    public mensajeResultadoBusqueda: string = "";

    filtro: any = {
        ubicacion: "",
        tipo: "",
        nombre: "",
        idAgrupador: null
    } as any

    constructor(private config: DynamicDialogConfig,
        private agrupadorService: AgrupadorService,
        private ref: DynamicDialogRef,
        private mensajeService: ShowMessageService,
        private espacioFisicoService: EspacioFisicoService,
        private spinnerService: SpinnerService
    ) {}
    ngOnInit(): void {
        this.obtenerUbicaciones()
        this.grupoSeleccionado = this.config.data?.grupo
        this.agrupadorService.obtenerEspacioFiscioAgrupador(this.grupoSeleccionado.idAgrupadorEspacioFisico).subscribe({
        next: (r) =>
            this.espasciosFisicosAsignados = r
        })
        this.filtrarEspacios()
    }

    obtenerTipos() {
        let ubicaciones: number[] = []
        ubicaciones.push(this.filtro.ubicacion)
        this.espacioFisicoService.consultarTiposEspaciosFisicosPorUbicaciones(ubicaciones).subscribe(r => {
        this.listaTipoEspacioFisico = r
        })
    }

    obtenerUbicaciones() {
        this.espacioFisicoService.consultarUbicaciones().subscribe(
        (lstUbicacion: UbicacionOutDTO[]) => {
            this.lstUbicacion = lstUbicacion;
        },
        (error) => {
            console.error(error);
        }
        );
    }

    inicializarFormulario() {
    }

    filtrarEspacios() {
        this.mensajeResultadoBusqueda= "Buscando...";
        this.filtro.idAgrupador = this.grupoSeleccionado.idAgrupadorEspacioFisico
        this.agrupadorService.obtenerEspacioFiscioDispinibleFiltro(this.filtro).subscribe({
        next: (r) => {
            if(r.length === 0){
                this.mensajeResultadoBusqueda= "No se encontraron espacios físicos.";
            }else{
                this.mensajeResultadoBusqueda= "Espacios físicos encontrados: "+r.length;
            }
            this.espaciosFisicosDisponibles = r
            this.espaciosFisicosDisponibles = this.espaciosFisicosDisponibles.concat(this.listaDeGruposQuitados)
            this.espaciosFisicosDisponibles = this.quitarRepetidos(this.espaciosFisicosDisponibles)            
            }
        })
    }

    onChangeUbicacion() {
        if (this.filtro.ubicacion) {
        this.obtenerTipos()
        this.filtro.tipo = ""
        } else {
        this.filtro.ubicacion = ""
        this.filtro.tipo = ""
        }
        this.filtrarEspacios()
    }
    guardar() {
        const asignacionDTO = {
        quitados: this.listaDeGruposQuitados,
        agregados: this.listaDeGruposNuevos,
        idGrupo: this.grupoSeleccionado.idAgrupadorEspacioFisico
        }
        this.spinnerService.show("Aplicando cambios...");
        this.agrupadorService.guardarAsignacion(asignacionDTO).subscribe(r => {
        if (r && r.error) {
            this.spinnerService.hide(); 
            this.mensajeService.showMessage("error", r.descripcion)
        } else {
            this.spinnerService.hide(); 
            this.mensajeService.showMessage("success", r.descripcion)
        }
        this.ref.close()
        })
    }
    salir() {
        this.ref.close()
    }
    handleMoveToTarget($event: any) {
        this.listaDeGruposNuevos = this.listaDeGruposNuevos.concat($event.items)
        this.listaDeGruposNuevos = this.quitarRepetidos(this.listaDeGruposNuevos);
    }
    handleMoveToSource($event: any) {
        this.listaDeGruposQuitados = this.listaDeGruposQuitados.concat($event.items)
        this.listaDeGruposQuitados = this.quitarRepetidos(this.listaDeGruposQuitados);
    }

    moverTodosADestino($event: any) {
        this.handleMoveToTarget($event);
    }

    moverTodosAOrigen($event: any) {
        this.handleMoveToSource($event);
    }

    quitarRepetidos(lista: any[]): any[] {
        const map = new Map();
        lista.forEach(salon => {
            map.set(salon.idEspacioFisico, salon);
        });

        return Array.from(map.values());
    }

}
