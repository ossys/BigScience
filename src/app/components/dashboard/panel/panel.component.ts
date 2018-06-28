import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

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
