import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { ExportCommunicationService } from '../export-communication.service';


@Component({
  selector: 'app-kpi-datasource',
  templateUrl: './kpi-datasource.component.html'
})
export class KpiDatasourceComponent implements OnInit, OnDestroy {
  lastConditionKey: number = 0;
  kpiDatasources = [];
  kpiAttributes = [];
  kpiSelectModel: any;
  exportEvtSubscription: Subscription;

  @Input() position: number;

  private _kpiDatasourcesList: Array<any>;
  @Input()
  set kpiDatasourcesList(kpiDatasourcesList: Array<any>) {
    if (!kpiDatasourcesList || kpiDatasourcesList.length == 0) {
      return;
    }
    this._kpiDatasourcesList = kpiDatasourcesList;
    this.kpiAttributes = [];
    this.kpiDatasources = [];
    for (var i = 0; i < kpiDatasourcesList.length; i++) {
      this.kpiDatasources.push(kpiDatasourcesList[i].source);
    }
    this.kpiSelectModel = kpiDatasourcesList[0].source;
    this.kpiSelectionChanged(this.kpiSelectModel);
  }
  get kpiDatasourcesList(): Array<any> { return this._kpiDatasourcesList; }

  selectConfig = {
    displayKey: 'label',
    height: 'auto'
  };
  filterJoinOptions = [
    {
      'key': 'AND',
      'label': 'And'
    },
    {
      'key': 'OR',
      'label': 'Or'
    }
  ];
  filterComparisons = [
    {
      'key': 'between',
      'label': 'Between'
    },
    {
      'key': 'eq',
      'label': '='
    },
    {
      'key': 'gt',
      'label': '>'
    },
    {
      'key': 'lt',
      'label': '<'
    },
    {
      'key': 'lte',
      'label': '<='
    },
    {
      'key': 'gte',
      'label': '>='
    },
    {
      'key': 'nte',
      'label': '<>'
    },
  ];

  conditions = [];

  constructor(private exportCommunicationService: ExportCommunicationService) {
    this.exportEvtSubscription = exportCommunicationService.startExport$.subscribe(mission => {
      if (this.conditions.length == 0) {
        this.exportCommunicationService.confirmingExport(null);
        return;
      }
      var kpiFiltering: any = {
        position: this.position,
        name: this.kpiSelectModel.label,
        constraints: []
      };
      for (var i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i].comparator.key === 'between') {
          kpiFiltering.constraints.push({
            operation: this.conditions[i].operation.label,
            attribute: this.conditions[i].attribute.label,
            comparator: 'gt',
            operand: this.conditions[i].operand1
          });
          kpiFiltering.constraints.push({
            operation: this.conditions[i].operation.label,
            attribute: this.conditions[i].attribute.label,
            comparator: 'lt',
            operand: this.conditions[i].operand2
          });
        }
        else {
          kpiFiltering.constraints.push({
            operation: this.conditions[i].operation.label,
            attribute: this.conditions[i].attribute.label,
            comparator: this.conditions[i].comparator.key,
            operand: this.conditions[i].operand1
          });
        }
      }
      this.exportCommunicationService.confirmingExport(kpiFiltering);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.exportEvtSubscription.unsubscribe();
  }

  kpiSelectionChanged(selected: any) {
    this.conditions = [];
    for (var i = 0; i < this._kpiDatasourcesList.length; i++) {
      if (this._kpiDatasourcesList[i].source.label === selected.label) {
        this.kpiAttributes = this._kpiDatasourcesList[i].attributes;
      }
    }
  }

  addAnotherCondition() {
    this.lastConditionKey += 1;
    this.conditions.push({
      key: this.lastConditionKey,
      operation: {
        'key': 'AND',
        'label': 'And'
      },
      attribute: this.kpiAttributes[0],
      comparator: {
        'key': 'between',
        'label': 'Between'
      },
      operand1: '',
      operand2: ''
    });
  }

  deleteCondition(condition: any) {
    for (var i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i].key === condition.key) {
        this.conditions.splice(i, 1);
        break;
      }
    }
  }
}
