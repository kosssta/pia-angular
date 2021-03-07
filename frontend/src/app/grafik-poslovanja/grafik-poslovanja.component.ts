import { Component, OnInit } from '@angular/core';
import { NarudzbineService } from '../narudzbine.service';

@Component({
  selector: 'app-grafik-poslovanja',
  templateUrl: './grafik-poslovanja.component.html',
  styleUrls: ['./grafik-poslovanja.component.css']
})
export class GrafikPoslovanjaComponent implements OnInit {

  constructor(private servis: NarudzbineService) { }

  ngOnInit(): void {
    this.servis.dohvatiNarudzbinePoslednjih30Dana().subscribe(rez => {
      this.barChartData = [{ data: JSON.parse(JSON.stringify(rez['rezultati'])), label: 'Broj narudzbina' }];
    });

    let now = new Date();
    now.setDate(now.getDate() - 30)

    for (let i = 0; i < 30; ++i) {
      this.barChartLabels.push(now.toString().substring(4, 10));
      now.setDate(now.getDate() + 1)
    }
  }

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  barChartLabels = [];
  barChartType = 'bar';
  barChartLegend = false;
  barChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Broj narudzbina' }
  ];
}
