import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
    private spinnerSubject = new BehaviorSubject<boolean>(false);
    private messageSubject = new BehaviorSubject<string>('');
  
    spinner$ = this.spinnerSubject.asObservable();
    message$ = this.messageSubject.asObservable();
  
    show(message: string = '') {
        this.messageSubject.next(message);
        this.spinnerSubject.next(true);
    }
  
    hide() {
        this.spinnerSubject.next(false);
        this.messageSubject.next('');
    }
}