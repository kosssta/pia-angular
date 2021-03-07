import { Component, OnInit } from '@angular/core';
import { ProizvodiService } from '../proizvodi.service';
import { Sadnica } from '../models/Sadnica';
import { Preparat } from '../models/Preparat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prodavnica',
  templateUrl: './prodavnica.component.html',
  styleUrls: ['./prodavnica.component.css']
})
export class ProdavnicaComponent implements OnInit {

  constructor(private servis: ProizvodiService, private ruter: Router) { }

  ngOnInit(): void {
    this.servis.dohvatiSadnicePreduzeca().subscribe(sad => {
      this.sadnice = JSON.parse(JSON.stringify(sad['sadnice']));

      this.servis.dohvatiPreparatePreduzeca().subscribe(pre => {
        this.preparati = JSON.parse(JSON.stringify(pre['preparati']));

        this.ucitano = true;
      })
    })
  }

  ucitano = false;
  sadnice: Sadnica[];
  preparati: Preparat[];
  tip = 'sadnice';

  promenaTipa(noviTip: string) {
    this.tip = noviTip;
  }

  prikaziDetalje(idPro: number) {
    this.ruter.navigate(['/prodavnica/' + idPro]);
  }
}
