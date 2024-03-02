import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LenguajeServicio {
    constructor(private translate: TranslateService) {
        this.translate.setDefaultLang('es-CO');
        this.translate.use('es-CO');
    }
}