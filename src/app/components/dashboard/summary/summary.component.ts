import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    
  ngAfterViewInit() {
    setTimeout(function() {
        window['demo'].initDashboardPageCharts();
        window['demo'].initVectorMap();

        window['$'].notify({
            icon: 'pe-7s-bell',
            message: "<b>Light Bootstrap Dashboard PRO</b> - forget about boring dashboards."
        },{
            type: 'warning',
            timer: 4000
        });
    });
  }

}
