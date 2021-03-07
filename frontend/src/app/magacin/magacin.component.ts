import { Component, OnInit, Input } from '@angular/core';
import { Sadnica } from '../models/Sadnica';
import { Preparat } from '../models/Preparat';
import { ActivatedRoute, Router } from '@angular/router';
import { ProizvodiService } from '../proizvodi.service';
import { Proizvod } from '../models/Proizvod';
import { Narudzbina } from '../models/Narudzbina';

@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css']
})
export class MagacinComponent implements OnInit {

  constructor(private ruta: ActivatedRoute, private servis: ProizvodiService, private ruter: Router) { }

  ngOnInit(): void {
    const idPolj = localStorage.getItem('idKor');
    const idRas = this.ruta.snapshot.paramMap.get('idRas');

    this.servis.dohvatiNezasadjeneSadnice(idPolj, idRas).subscribe(sadn => {
      this.sadnice = JSON.parse(JSON.stringify(sadn['sadnice']));
      this.ucitaneSadnice = true;

      this.servis.dohvatiPreparate(idPolj, idRas).subscribe(prep => {
        this.preparati = JSON.parse(JSON.stringify(prep['preparati']));
        this.ucitaniPreparati = true;

        this.servis.dohvatiNarudzbine(idPolj, idRas).subscribe(nar => {
          const ret = JSON.parse(JSON.stringify(nar['narudzbine']));

          ret.forEach(n => {
            const proizvod: Proizvod = {
              idPro: n.idPro,
              naziv: n.naziv,
              proizvodjac: n.proizvodjac,
              kolicina: n.kolicina,
              ocena: n.ocena,
              cena: n.cena
            };

            const narudzbina: Narudzbina = {
              idNar: n.idNar,
              proizvod: proizvod,
              narucilac: n.narucilac,
              rasadnik: n.rasadnik,
              datum: n.datum,
              kolicina: n.narKolicina,
              status: n.status
            }
            this.naruceniProizvodi.push(narudzbina);
          });
          this.ucitaniNaruceniProizvodi = true;
        })
      })
    });
  }

  ucitaneSadnice = false;
  ucitaniPreparati = false;
  ucitaniNaruceniProizvodi = false;

  sadnice: Sadnica[];
  preparati: Preparat[];

  naruceniProizvodi: Narudzbina[] = [];

  povratakNazad() {
    return '/rasadnik/' + this.ruta.snapshot.paramMap.get('idRas');
  }

  poruciProizvode() {
    localStorage.setItem('idRas', this.ruta.snapshot.paramMap.get('idRas'));
    this.ruter.navigate(['/prodavnica']);
  }
}
