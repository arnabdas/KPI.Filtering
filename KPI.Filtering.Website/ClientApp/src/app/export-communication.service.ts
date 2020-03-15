import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportCommunicationService {

  constructor() { }

  // Observable string sources
  private startExport = new Subject<string>();
  private confirmConditions = new Subject<any>();

  // Observable string streams
  startExport$ = this.startExport.asObservable();
  confirmingExport$ = this.confirmConditions.asObservable();

  // Service message commands
  startingExport(mission: string) {
    this.startExport.next(mission);
  }

  confirmingExport(conditions: any) {
    this.confirmConditions.next(conditions);
  }
}
