import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private serviceId = 'service_zrs0lh9'; // Reemplaza con tu ID de servicio en EmailJS
  private templateId = 'template_n8dwvfk'; // Reemplaza con tu ID de plantilla en EmailJS
  private publicKey = 'PGtIpPp2iMGnAkbsn'; // Reemplaza con tu clave pública en EmailJS

  constructor() {}

  enviarCorreo(data: any): Promise<EmailJSResponseStatus> {
    return emailjs.send(this.serviceId, this.templateId, data, this.publicKey);
  }
}
