import { Component, OnInit, Input } from '@angular/core';
import { Komentar } from '../models/Komentar';
import { ProizvodiService } from '../proizvodi.service';

@Component({
  selector: 'app-komentari',
  templateUrl: './komentari.component.html',
  styleUrls: ['./komentari.component.css']
})
export class KomentariComponent implements OnInit {

  constructor(private servis: ProizvodiService) { }

  ngOnInit(): void {
    const idKor = localStorage.getItem('idKor');

    this.servis.dohvatiKomentare(this.idPro, idKor).subscribe(kom => {
      this.komentari = JSON.parse(JSON.stringify(kom['komentari']));
      this.ucitano = true;
    });
    this.isPoljoprivrednik = JSON.parse(localStorage.getItem('loggedInUser')).tip == 'poljoprivrednik';
    if (!this.isPoljoprivrednik) this.ucitanoDodavanjeKomentara = true;

    this.servis.dohvatiKomentar(this.idPro, idKor).subscribe(kom => {
      if (kom['message'] == 'empty') this.mozeDodatiKomentar = true;
      else if (kom['message'] == 'ok') {
        this.daoKomentar = true;
        this.komentar = kom['komentar']['komentar'];
        this.ocena = kom['komentar']['ocena'];
      } else this.poruka = kom['message'];
      this.ucitanoDodavanjeKomentara = true;
    });
  }

  @Input() idPro;
  ucitano = false;
  ucitanoDodavanjeKomentara = false;
  komentari: Komentar[];

  isPoljoprivrednik: boolean;
  mozeDodatiKomentar: boolean;
  daoKomentar = false;
  komentar: string;
  ocena: number;
  poruka = '';

  porukaDodavanjeKomentara = '';

  dodajKomentar() {
    this.porukaDodavanjeKomentara = '';

    if (this.emptyField(this.ocena) || this.emptyField(this.komentar)) {
      this.porukaDodavanjeKomentara = 'Sva polja su obavezna';
      return;
    }

    const komentar: Komentar = {
      username: JSON.parse(localStorage.getItem('loggedInUser')).username,
      ocena: this.ocena,
      komentar: this.komentar,
      idPro: this.idPro
    };

    this.servis.dodajKomentar(komentar).subscribe(ret => {
      if(ret['message'] != 'ok') {
        this.porukaDodavanjeKomentara = ret['message'];
        return;
      } else {
        this.mozeDodatiKomentar = false;
        this.daoKomentar = true;
      }
    })
  }

  zatvoriAlert() {
    this.porukaDodavanjeKomentara = '';
  }

  emptyField(field): boolean {
    return !field || field == '';
  }
}
