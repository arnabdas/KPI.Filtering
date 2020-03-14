import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KPI Filtering';
  
  lastKPIIndex: number = 0;
  filterKPIs = [];
  
  addKPI() {
    this.lastKPIIndex += 1;
    this.filterKPIs.push({
      key: this.lastKPIIndex
    });
  }
  
  deleteKPI(kpi: any) {
    for( var i = 0; i < this.filterKPIs.length; i++) { 
      if ( this.filterKPIs[i].key === kpi.key) { 
        this.filterKPIs.splice(i, 1);
        break;
      }
    }
  }
  
  export() {
    console.log('Exporting');
  }
}
