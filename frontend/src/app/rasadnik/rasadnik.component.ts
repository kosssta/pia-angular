import { Component, OnInit, Input } from '@angular/core';
import { Rasadnik } from '../models/Rasadnik';
import { ActivatedRoute } from '@angular/router';
import { RasadniciService } from '../rasadnici.service';
import { Sadnica } from '../models/Sadnica';
import { ProizvodiService } from '../proizvodi.service';

@Component({
  selector: 'app-rasadnik',
  templateUrl: './rasadnik.component.html',
  styleUrls: ['./rasadnik.component.css']
})
export class RasadnikComponent implements OnInit {

  constructor(private ruta: ActivatedRoute, private rasadnikServis: RasadniciService, private proizvodiServis: ProizvodiService) { }

  ngOnInit(): void {
    const idRas = this.ruta.snapshot.paramMap.get("idRas");
    this.rasadnikServis.dohvatiRasadnik(idRas).subscribe(ras => {
      this.rasadnik = JSON.parse(JSON.stringify(ras['rasadnik']));

      this.sadnice = new Array<Sadnica[]>(this.rasadnik.duzina);

      for (let i = 0; i < this.sadnice.length; i++) {
        this.sadnice[i] = new Array<Sadnica>(this.rasadnik.sirina);
      }

      const idKor = localStorage.getItem('idKor');
      this.proizvodiServis.dohvatiSadnice(idKor, idRas).subscribe(sad => {
        sad['sadnice'].forEach(s => {
          if (s['x'] > 0 && s['y'] > 0)
            this.sadnice[s['x'] - 1][s['y'] - 1] = s;
        });

        this.ucitaneSadnice = true;
      })
    });
  }

  rasadnik: Rasadnik;
  sadnice: Sadnica[][];

  ucitaneSadnice = false;
  poruka = "";

  x: number;
  y: number;

  pritisnutoDugmeVoda = false;
  pritisnutoDugmeTemperatura = false;

  uvecajKolicinuVode(vrednost: number) {
    this.poruka = "";
    this.pritisnutoDugmeVoda = true;

    this.rasadnikServis.dohvatiRasadnik(this.rasadnik.idRas).subscribe(ras => {  // za slucaj ako je pala kolicina vode posle
      this.rasadnik = ras['rasadnik'];                                           // ucitavanja komponente (na svakih sat)
      this.rasadnik.voda += vrednost;
      this.rasadnikServis.azurirajRasadnik(this.rasadnik).subscribe(ret => {
        if (ret['message'] != 'ok') this.poruka = ret['message'];
        this.pritisnutoDugmeVoda = false;
      });
    })
  }

  uvecajTemperaturu(vrednost: number) {
    this.poruka = "";
    this.pritisnutoDugmeTemperatura = true;

    this.rasadnikServis.dohvatiRasadnik(this.rasadnik.idRas).subscribe(ras => { // za slucaj ako je pala temperatura posle
      this.rasadnik = ras['rasadnik'];                                          // ucitavanja komponente (na svakih sat)
      this.rasadnik.temperatura += vrednost;
      this.rasadnikServis.azurirajRasadnik(this.rasadnik).subscribe(ret => {
        if (ret['message'] != 'ok') this.poruka = ret['message'];
        this.pritisnutoDugmeTemperatura = false;
      });
    })
  }

  prikaziSadnicu(index1, index2) {
    this.x = index1;
    this.y = index2;
  }
}
