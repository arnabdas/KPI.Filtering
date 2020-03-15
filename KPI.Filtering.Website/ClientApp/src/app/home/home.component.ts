import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { ExportCommunicationService } from '../export-communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ExportCommunicationService]
})
export class HomeComponent implements OnDestroy {
  title = 'KPI Filtering';
  file: File;

  confirmExportSubscription: Subscription;
  confirmedKpis: number;

  lastKPIIndex: number = 0;
  filterKPIs = [];
  kpiList = [];
  kpiDatasources = [];

  conditions = [];

  constructor(private http: HttpClient,
    private exportCommunicationService: ExportCommunicationService) {
    this.confirmExportSubscription =
      exportCommunicationService.confirmingExport$.subscribe(conditions => {
        --this.confirmedKpis;
        if (conditions) {
          this.conditions.push(conditions);
        }
        if (this.confirmedKpis == 0 && this.conditions.length > 0) {
          this.conditions.sort((a, b) => a - b);
          let apiInput: any;
          for (var i = 0; i < this.conditions.length; i++) {
            if (!apiInput) {
              apiInput = this.conditions[i];
            }
            else {
              this.conditions[i - 1].joinDetails = {
                on: 'SUBSCRIBER_ID',
                operation: 'AND',
                joinDataSource: this.conditions[i]
              };
            }
          }

          this.http.post('/api/KPIFilter/ExportFilterConditions', apiInput,
            {
              responseType: 'arraybuffer',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/xml'
              }
            }).subscribe(response => this.downLoadFile(response, "application/ms-excel"));
        }
      });
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    var a: any = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = 'KPIFilters.xml';
    a.click();
    window.URL.revokeObjectURL(url);
    //let pwa = window.open(url);
    //if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //  alert('Please disable your Pop-up blocker and try again.');
    //}
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.confirmExportSubscription.unsubscribe();
  }

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
    this.conditions = [];
    this.confirmedKpis = this.filterKPIs.length;
    this.exportCommunicationService.startingExport('export');
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
      (r: any) => {
        this.kpiList = r;
        this.kpiDatasources = [];
        for (var i = 0; i < r.length; i++) {
          let ds = {
            source: {
              key: r[i].name.toLowerCase().replace(' ', '-'),
              label: r[i].name
            },
            attributes: []
          };
          for (var j = 0; j < r[i].columns.length; j++) {
            ds.attributes.push({
              key: r[i].columns[j].label.toLowerCase().replace(' ', '-'),
              label: r[i].columns[j].label
            });
          }
          this.kpiDatasources.push(ds);
        }
      }
    );
  }
}
