import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kpi-datasource',
  templateUrl: './kpi-datasource.component.html',
  styleUrls: ['./kpi-datasource.component.scss']
})
export class KpiDatasourceComponent implements OnInit {
    kpiSelectModel: any;
    selectConfig = {
      displayKey: 'label',
      height: 'auto'
    };
    lastConditionKey: number = 0;
    kpiDatasources = [
      {
        'key': 'refill',
        'label': 'Refill'
      },
      {
        'key': 'service',
        'label': 'Service'
      },
      {
        'key': 'daily-total-revenue',
        'label': 'Daily Total Revenue'
      }
    ];
    kpiAttributes = [
      {
        'key': 'date',
        'label': 'Date'
      },
      {
        'key': 'region',
        'label': 'Region'
      },
      {
        'key': 'refill',
        'label': 'Refill'
      }
    ];
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

  constructor() {
  }

  ngOnInit(): void {
  }
  
  selectionChanged(selected: any) {
    console.log(selected.value);
  }

  addAnotherCondition() {
    this.lastConditionKey += 1;
    this.conditions.push({
      key: this.lastConditionKey,
      operation: {
        'key': 'AND',
        'label': 'And'
      },
      attribute: {
        'key': 'date',
        'label': 'Date'
      },
      comparator: {
        'key': 'eq',
        'label': '='
      },
      operand1: '1 Jan',
      operand2: '2 Jan'
    });
  }
  
  deleteCondition(condition: any) {
    for( var i = 0; i < this.conditions.length; i++) { 
      if ( this.conditions[i].key === condition.key) { 
        this.conditions.splice(i, 1);
        break;
      }
    }
  }
}
