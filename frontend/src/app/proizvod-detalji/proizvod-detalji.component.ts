import { Component, OnInit } from '@angular/core';
import { ProizvodiService } from '../proizvodi.service';
import { Proizvod } from '../models/Proizvod';
import { ActivatedRoute } from '@angular/router';
import { Komentar } from '../models/Komentar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proizvod-detalji',
  templateUrl: './proizvod-detalji.component.html',
  styleUrls: ['./proizvod-detalji.component.css']
})
export class ProizvodDetaljiComponent implements OnInit {

  constructor(private ruta: ActivatedRoute, private servis: ProizvodiService, private modalServis: NgbModal) { }

  ngOnInit(): void {
    const idPro = this.ruta.snapshot.paramMap.get('idPro');

    this.isPoljoprivrednik = JSON.parse(localStorage.getItem('loggedInUser')).tip == 'poljoprivrednik';

    this.servis.dohvatiProizvod(idPro).subscribe(pro => {
      this.proizvod = JSON.parse(JSON.stringify(pro['proizvod']));
      this.ucitano = true;
    });
  }

  ucitano = false;
  proizvod: Proizvod;
  komentari: Komentar[];
  isPoljoprivrednik: boolean;

  ALERTS = [
    { tip: 'success', poruka: 'Proizvod je uspesno porucen' },
    { tip: 'danger', poruka: 'Doslo je do greske pri porucivanju' },
    { tip: 'warning', poruka: 'Kolicina mora biti veca od nule' }
  ];

  kolicina = '1';
  poruka = -1;

  otvoriProzor(content) {
    this.modalServis.open(content, { size: 'sm' });
  }

  naruci() {
    this.poruka = -1;

    if (+this.kolicina <= 0) {
      this.poruka = 2;
      this.modalServis.dismissAll();
      return;
    }

    const idPolj = localStorage.getItem('idKor');

    this.servis.naruciProizvod(idPolj, this.proizvod.idPro, localStorage.getItem('idRas'), this.kolicina).subscribe(ret => {
      if (ret['message'] == 'ok') this.poruka = 0;
      else this.poruka = 1;

      this.modalServis.dismissAll();
    });
  }

  closeAlert() {
    this.poruka = -1;
  }
}
