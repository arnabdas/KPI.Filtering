import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KPI Filtering';
  file: File;
  
  lastKPIIndex: number = 0;
  filterKPIs = [];
  
  constructor(private http: HttpClient) {}
  
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
  
  selectedKPISourcesExcel(event: any) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      this.file = fileList[0];
    }
  }
  
  uploadKPIExcel() {
    if(!this.file) {
      return;
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data',
        'Accept': 'application/json'
      })
    };

    const formData: FormData = new FormData();
    formData.append('KPIInputExcel', this.file, this.file.name);
      this.http.post(`https://kpifiltering.coderuse.io/api/KPIFilter/ProcessInput`, formData, httpOptions)
          .pipe(map(res => {}))
          //.catch(error => console.log(error))
          .subscribe(
              data => console.log(data),
              error => console.log(error)
          );
  }
}
