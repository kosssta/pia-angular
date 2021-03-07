import { Component, OnInit, Input } from '@angular/core';
import { Zahtev } from '../models/Zahtev';
import { KorisniciService } from '../korisnici.service';
import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-korisnik-detalji',
  templateUrl: './korisnik-detalji.component.html',
  styleUrls: ['./korisnik-detalji.component.css']
})
export class KorisnikDetaljiComponent implements OnInit {

  constructor(private servis: KorisniciService) { }

  ngOnInit(): void {
  }

  @Input() zahtev: Zahtev;
  korisnik: Korisnik;
  message = '';

  POLJOPRIVREDNIK_POLJA = ['Ime', 'Prezime', 'Korisnicko ime', 'Datum rodjenja', 'Mesto rodjenja', 'Telefon', 'Email'];
  PREDUZECE_POLJA = ['Pun naziv', 'Skracen naziv', 'Datum osnivanja', 'Mesto', 'Email'];
  POLJA = {
    'poljoprivrednik': this.POLJOPRIVREDNIK_POLJA,
    'preduzece': this.PREDUZECE_POLJA
  }

  POLJA_BAZA = {
    'Ime': 'ime',
    'Prezime': 'prezime',
    'Korisnicko ime': 'username',
    'Datum rodjenja': 'datum_rodjenja',
    'Mesto rodjenja': 'mesto_rodjenja',
    'Pun naziv': 'punNaziv',
    'Skracen naziv': 'username',
    'Datum osnivanja': 'datumOsnivanja',
    'Mesto': 'mesto',
    'Email': 'email',
    'Telefon': 'kontakt_telefon'
  }

  ngOnChanges() {
    this.prikaziDetalje();
  }

  prikaziDetalje() {
    if (!this.zahtev) return;
    this.korisnik = null;
    this.message = 'Dohvatam detalje...';

    this.servis.pronadjiKorisnika(this.zahtev.username, this.zahtev.tip, false).subscribe(result => {
      if (result['message'] != 'ok') this.message = 'Neuspesno dohvatanje detalja korisnika';
      else {
        this.message = '';
        this.korisnik = JSON.parse(JSON.stringify(result['korisnik']));
        if (this.korisnik['datumOsnivanja']) this.korisnik['datumOsnivanja'] = this.korisnik['datumOsnivanja'].substring(0, 10);
        if (this.korisnik['datum_rodjenja']) this.korisnik['datum_rodjenja'] = this.korisnik['datum_rodjenja'].substring(0, 10);
      }
    });
  }
}
