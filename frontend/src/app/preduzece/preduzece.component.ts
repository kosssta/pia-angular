import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Narudzbina } from '../models/Narudzbina';
import { NarudzbineService } from '../narudzbine.service';
import { Proizvod } from '../models/Proizvod';

@Component({
  selector: 'app-preduzece',
  templateUrl: './preduzece.component.html',
  styleUrls: ['./preduzece.component.css']
})
export class PreduzeceComponent implements OnInit {

  constructor(private ruter: Router, private servis: NarudzbineService) { }

  ngOnInit(): void {
    const loggedIn = JSON.parse(localStorage.getItem('loggedInUser'));
    if (this.emptyField(loggedIn) || this.emptyField(loggedIn.tip) || loggedIn.tip != 'preduzece') {
      this.ruter.navigate(['/login']);
    }

    const idPre = localStorage.getItem('idKor');
    this.servis.dohvatiNarudzbine(idPre).subscribe(narudzbine => {
      const nar = JSON.parse(JSON.stringify(narudzbine['narudzbine']));

      nar.forEach(n => {
        const proizvod: Proizvod = {
          idPro: n.idPro,
          naziv: n.naziv,
          proizvodjac: loggedIn.skracenNaziv,
          kolicina: n.kolicina,
          ocena: n.ocena,
          cena: n.cena
        };
        const narudzbina: Narudzbina = {
          proizvod: proizvod,
          idNar: n.idNar,
          narucilac: n.narucilac,
          rasadnik: n.rasadnik,
          kolicina: n.narKolicina,
          status: n.narStatus,
          datum: new Date(Date.parse(n.datum))
        };
        this.narudzbine.push(narudzbina);
      });
      this.sortirajPoDatumu();
      this.ucitano = true;
    });
  }

  ucitano = false;
  narudzbine: Narudzbina[] = [];

  sortiranoOpadajuce = false;

  prikaziDatum(datum: Date): string {
    return JSON.stringify(datum).substring(1, 11) + ' ' + JSON.stringify(datum).substring(12, 20);
  }

  sortirajPoDatumu() {
    if (!this.sortiranoOpadajuce) this.narudzbine.sort((a, b) => {
      if (a.status == 2 && b.status == 0) return -1;
      if (a.status == 0 && b.status == 2) return 1;
      if (a.datum < b.datum) return -1;
      if (a.datum > b.datum) return 1;
      return 0;
    });
    else this.narudzbine.sort((a, b) => {
      if (a.status == 2 && b.status == 0) return -1;
      if (a.status == 0 && b.status == 2) return 1;
      if (a.datum > b.datum) return -1;
      if (a.datum < b.datum) return 1;
      return 0;
    });
    this.sortiranoOpadajuce = !this.sortiranoOpadajuce;
  }

  emptyField(field): boolean {
    return !field || field == '';
  }

  ALERTS = [
    { tip: 'danger', poruka: 'Greska' },
    { tip: 'success', poruka: '' },
    { tip: 'warning', poruka: 'Narudzbina je prihvacena i bice isporucena cim bude bilo slobodnih kurira' },
    { tip: 'danger', poruka: 'Trenutno na stanju nema dovoljno  trazenog proizvoda' }
  ];

  poruka = -1;

  zatvoriAlert() {
    this.poruka = -1;
  }

  odbijNarudzbinu(narudzbina: Narudzbina, index: number) {
    this.poruka = -1;

    this.servis.odbijNarudzbinu(narudzbina.idNar).subscribe(ret => {
      if (ret['message'] != 'ok') this.poruka = 0;
      else this.narudzbine.splice(index, 1);
    });
  }


  prihvatiNarudzbinu(narudzbina: Narudzbina, index: number) {
    this.poruka = -1;

    if (narudzbina.kolicina > narudzbina.proizvod.kolicina) {
      this.poruka = 3;
      return;
    }

    this.servis.prihvatiNarudzbinu(narudzbina.idNar, localStorage.getItem('idKor'), JSON.parse(localStorage.getItem('loggedInUser')).mesto,
      narudzbina.narucilac, narudzbina.kolicina).subscribe(ret => {
        if (ret['message'] != 'ok') this.poruka = 0;
        else if (ret['status'] == 'NA CEKANJU') {
          narudzbina.status = 2;
          this.poruka = 2;
          this.narudzbine.splice(index, 1);
          this.narudzbine.unshift(narudzbina);
        } else {
          this.ALERTS[1].poruka = 'Narudzbina je prihvacena i bice isporucena u ' + ret['destinacija'] + ' za ' + ret['vremeDostave'];
          this.poruka = 1;
          this.narudzbine.forEach(n => {
            if (n.proizvod.idPro == narudzbina.proizvod.idPro) n.proizvod.kolicina -= narudzbina.kolicina;
          });
          this.narudzbine.splice(index, 1);
        }
      });
  }

  prikaziSveProizvode() {
    return '/proizvodi/' + localStorage.getItem('idKor');
  }
}
