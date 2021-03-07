import { Component, OnInit, Input } from '@angular/core';
import { Rasadnik } from '../models/Rasadnik';
import { Sadnica } from '../models/Sadnica';
import { ProizvodiService } from '../proizvodi.service';
import { Preparat } from '../models/Preparat';

@Component({
  selector: 'app-sadnica-detalji',
  templateUrl: './sadnica-detalji.component.html',
  styleUrls: ['./sadnica-detalji.component.css']
})
export class SadnicaDetaljiComponent implements OnInit {

  constructor(private servis: ProizvodiService) { }

  ngOnInit(): void {
    this.servis.dohvatiNezasadjeneSadnice(localStorage.getItem('idKor'), this.rasadnik.idRas).subscribe(sadn => {
      this.sadniceUmagacinu = JSON.parse(JSON.stringify(sadn['sadnice']));
    });

    this.servis.dohvatiPreparate(localStorage.getItem('idKor'), this.rasadnik.idRas).subscribe(prep => {
      this.preparatiUmagacinu = JSON.parse(JSON.stringify(prep['preparati']));
    });
  }

  @Input() rasadnik: Rasadnik;
  @Input() x: number;
  @Input() y: number;
  @Input() sadnica: Sadnica;

  sadniceUmagacinu: Sadnica[];
  preparatiUmagacinu: Preparat[];

  poruka = '';

  ngOnChanges() {
    this.servis.dohvatiNezasadjeneSadnice(localStorage.getItem('idKor'), this.rasadnik.idRas).subscribe(sadn => {
      this.sadniceUmagacinu = JSON.parse(JSON.stringify(sadn['sadnice']));
    });

    this.servis.dohvatiPreparate(localStorage.getItem('idKor'), this.rasadnik.idRas).subscribe(prep => {
      this.preparatiUmagacinu = JSON.parse(JSON.stringify(prep['preparati']));
    });
  }

  procenatNapretka() {
    return Math.floor(this.sadnica.starost * 100 / this.sadnica.trajanjeSazrevanja);
  }

  zasadi(sadnica: Sadnica) {
    this.poruka = '';

    this.servis.zasadiSadnicu(sadnica.idPro, this.x, this.y, this.rasadnik.idRas, localStorage.getItem('idKor')).subscribe(ret => {
      if (ret['message'] != 'ok') this.poruka = ret['message'];
      else location.reload();
    });
  }

  izvadi(sadnica: Sadnica) {
    this.servis.izvadiSadnicu(sadnica.idSad, this.rasadnik.idRas).subscribe(ret => {
      location.reload();
    });
  }

  dodajPreparat(preparat: Preparat) {
    this.poruka = '';

    this.servis.dodajPreparat(this.sadnica.idSad, this.x, this.y, this.rasadnik.idRas, localStorage.getItem('idKor'), preparat).subscribe(ret => {
      if (ret['message'] != 'ok') this.poruka = ret['message'];
      else location.reload();
    });
  }
}
