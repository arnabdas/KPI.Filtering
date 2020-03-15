import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'KPI Filtering';
  file: File;

  lastKPIIndex: number = 0;
  filterKPIs = [];
  kpiList = [];

  constructor(private http: HttpClient) { }

  addKPI() {
    this.lastKPIIndex += 1;
    this.filterKPIs.push({
      key: this.lastKPIIndex
    });
  }

  deleteKPI(kpi: any) {
    for (var i = 0; i < this.filterKPIs.length; i++) {
      if (this.filterKPIs[i].key === kpi.key) {
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
    if (fileList.length > 0) {
      this.file = fileList.item(0);
    }
  }

  uploadKPIExcel() {
    if (!this.file) {
      return;
    }

    const formData: FormData = new FormData();
    formData.append('KPIInputExcel', this.file, this.file.name);
    this.http.post(`/api/KPIFilter/ProcessInput`, formData).subscribe(
      (r: any) => { this.kpiList = r }
    );
  }
}
