import { Component, OnInit } from '@angular/core';
import { KorisniciService } from '../korisnici.service';
import { Korisnik } from '../models/Korisnik';
import { Zahtev } from '../models/Zahtev';

@Component({
  selector: 'app-brisanje-korisnika',
  templateUrl: './brisanje-korisnika.component.html',
  styleUrls: ['./brisanje-korisnika.component.css']
})
export class BrisanjeKorisnikaComponent implements OnInit {

  constructor(private servis: KorisniciService) { }

  ngOnInit(): void {
  }

  message = '';
  username: string;
  tip = 'Poljoprivrednik';

  zahtevZaBrisanje: Zahtev;
  zahtevDetalji: Zahtev;

  pressedButton1 = false;
  pressedButton2 = false;

  zatvoriPoruku() {
    this.message = '';
  }

  pretrazi() {
    this.message = '';
    this.pressedButton1 = true;

    this.servis.pronadjiKorisnika(this.username, this.tip, true).subscribe(result => {
      if (result['message'] != 'ok') {
        this.zahtevDetalji = null;
        this.zahtevZaBrisanje = null;
        this.pressedButton1 = false;
        this.message = result['message'];
        return;
      }

      if (!result['korisnik']['username']) {
        this.zahtevDetalji = null;
        this.zahtevZaBrisanje = null;
        this.pressedButton1 = false;
        this.message = 'Nije pronadjen nijedan korisnik';
        return;
      }

      this.zahtevZaBrisanje = {
        tip: this.tip.toLowerCase(),
        username: this.username,
        status: 1
      };
      this.pressedButton1 = false;
    })
  }

  obrisi() {
    this.message = '';
    this.pressedButton2 = true;

    this.servis.obrisiKorisnika(this.username).subscribe(result => {
      if (result['message'] != 'ok') {
        this.pressedButton2 = false;
        this.message = result['message'];
      }

      this.zahtevDetalji = null;
      this.zahtevZaBrisanje = null;
      this.pressedButton2 = false;
    })
  }

  prikaziDetalje() {
    if (this.zahtevZaBrisanje != this.zahtevDetalji) {
      this.zahtevDetalji = this.zahtevZaBrisanje
    } else {
      this.zahtevDetalji = null;
    }
  }

  promenaTipa() {
    this.zahtevDetalji = null;
    this.zahtevZaBrisanje = null;
  }
}
