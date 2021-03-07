import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sadnica } from '../models/Sadnica';
import { Preparat } from '../models/Preparat';
import { ProizvodiService } from '../proizvodi.service';

@Component({
  selector: 'app-proizvodi',
  templateUrl: './proizvodi.component.html',
  styleUrls: ['./proizvodi.component.css']
})
export class ProizvodiComponent implements OnInit {

  constructor(private ruta: ActivatedRoute, private servis: ProizvodiService, private ruter: Router) { }

  ngOnInit(): void {
    const idPre = this.ruta.snapshot.paramMap.get('idPre');

    this.servis.dohvatiSadnice(idPre).subscribe(sadn => {
      this.sadnice = JSON.parse(JSON.stringify(sadn['sadnice']));
      this.ucitaneSadnice = true;

      this.servis.dohvatiPreparate(idPre).subscribe(prep => {
        this.preparati = JSON.parse(JSON.stringify(prep['preparati']));
        this.ucitaniPreparati = true;
      })
    })
  }

  ucitaneSadnice = false;
  ucitaniPreparati = false;
  sadnice: Sadnica[];
  preparati: Preparat[];

  poruka = '';

  prikaziDetalje(idPro) {
    this.ruter.navigate(['/prodavnica/' + idPro]);
  }

  povuciProizvod(idPro, index, tip) {
    this.servis.povuciProizvod(idPro).subscribe(ret => {
      if (ret['message'] != 'ok') this.poruka = 'Greska pri povlacenju proizvoda';
      else if (tip == 'sadnica') this.sadnice.splice(index, 1);
      else if (tip == 'preparat') this.preparati.splice(index, 1);
    });
  }

  zatvoriAlert() {
    this.poruka = '';
  }
}
