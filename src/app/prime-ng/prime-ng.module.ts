import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { ComponentesRoutingModule } from '../componentes/componentes-routing.module';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ToolbarModule } from 'primeng/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
    declarations: [],
    imports: [
    ],
    exports:[  
        PaginatorModule,
        ComponentesRoutingModule,    
        TableModule,
        ToastModule,
        DialogModule,			
        ButtonModule,
        PickListModule,    
        MultiSelectModule,
        CheckboxModule,
        ToolbarModule,
        TranslateModule,
        PanelMenuModule,
        CalendarModule,
        TooltipModule,
        ConfirmDialogModule,
        InputTextModule,
        InputTextareaModule,
        FieldsetModule,
        ConfirmDialogModule,
        PickListModule
    ],
    providers: [ConfirmationService, DialogService]
})
export class PrimeNgModule { }
