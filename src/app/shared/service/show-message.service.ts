import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class ShowMessageService {
    constructor(private messageService: MessageService) { }

    showMessage(severity: string, message: string): void {
      this.messageService.add({
        severity: severity,
        detail: message,
      });
    }
}
