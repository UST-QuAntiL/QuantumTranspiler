import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.scss']
})
export class SimulateComponent implements OnInit {
  public counts = [];

  // chart attributes
  public chartType: string = 'bar';
  public chartDatasets: Array<any> = [];

  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];
  public chartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(private http: HttpService, private data: DataService) { }

  ngOnInit(): void {
  }

  async simulate() {
    let object = {
      "circuit": this.data.getCircuit("internal")
    }
    let counts: string = await this.http.callBackend(object, "simulate")
    let countObject = JSON.parse(counts)
    // countObject = this.appendCounts(countObject)
    if (countObject) {
      this.counts.push(countObject);
      let chartData = [];
      let chartLabels = [];
      for (let key in countObject) {
        let value = countObject[key];

        if (!(key in this.chartLabels)) {
          chartLabels.push(key);
        }
        chartData.push(value)

      }
      this.chartDatasets = [{
        data: chartData,
        label: "Counts"
      }];
      this.chartLabels = chartLabels;

      // this.bottomDiv.nativeElement.scrollIntoView({ block: 'end',  behavior: 'smooth' });
    }
  }  

}
