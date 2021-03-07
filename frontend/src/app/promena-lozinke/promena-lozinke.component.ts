import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { KorisniciService } from '../korisnici.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {

  constructor(private servis: KorisniciService, private ruter: Router) { }

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('loggedInUser'));
  }

  IDS = {
    'poljoprivrednik': 'idPolj',
    'preduzece': 'idPre',
    'administrator': 'idAdm'
  }

  korisnik: Korisnik;
  staraLozinka: string;
  novaLozinka: string;
  potvrda: string;
  message = '';


  OBAVEZNA_POLJA_MESSAGE = 'Sva polja su obavezna';
  NEISPRAVNA_DUZINA_LOZINKE_MESSAGE = 'Lozinka mora imati najmanje 7 karaktera';
  VELIKO_SLOVO_MESSAGE = 'Lozinka mora imati bar 1 veliko slovo';
  MALO_SLOVO_MESSAGE = 'Lozinka mora imati bar 1 malo slovo';
  SPECIJALAN_KARAKTER_MESSAGE = 'Lozinka mora imati bar 1 specijalan karakter';

  pressedButton = false;

  promena() {
    this.message = '';
    this.pressedButton = true;

    if (this.emptyField(this.staraLozinka) || this.emptyField(this.novaLozinka) || this.emptyField(this.potvrda)) {
      this.pressedButton = false;
      this.message = this.OBAVEZNA_POLJA_MESSAGE;
      return;
    }

    if (this.staraLozinka != this.korisnik['password']) {
      this.pressedButton = false;
      this.message = 'Stara lozinka je pogresna';
      return;
    }

    if (!this.ispravnaLozinka(this.novaLozinka)) {
      this.pressedButton = false;
      return;
    }

    if (this.novaLozinka == this.staraLozinka) {
      this.pressedButton = false;
      this.message = 'Nova lozinka ne sme biti ista kao stara';
      return;
    }

    if (this.novaLozinka != this.potvrda) {
      this.pressedButton = false;
      this.message = 'Potvrda lozinke se razlikuje od lozinke';
      return;
    }

    this.servis.promenaLozinke(this.korisnik[this.IDS[this.korisnik['tip']]], this.novaLozinka).subscribe(ret => {
      if (ret['message'].toLowerCase() != 'ok') {
        this.pressedButton = false;
        this.message = ret['message'];
        return;
      }
      localStorage.setItem('loggedInUser', '');
      this.ruter.navigate([`/login`]);
    })
  }

  emptyField(field): boolean {
    return !field || field == '';
  }

  ispravnaLozinka(lozinka: string) {
    if (!lozinka) {
      this.message = this.OBAVEZNA_POLJA_MESSAGE;
      return false;
    }
    if (!/.{7,}/.test(lozinka)) {
      this.message = this.NEISPRAVNA_DUZINA_LOZINKE_MESSAGE;
      return false;
    }
    if (!/.*[A-Z].*/.test(lozinka)) {
      this.message = this.VELIKO_SLOVO_MESSAGE;
      return false;
    }
    if (!/.*[a-z].*/.test(lozinka)) {
      this.message = this.MALO_SLOVO_MESSAGE;
      return false;
    }
    if (!/.*[^A-Za-z0-9].*/.test(lozinka)) {
      this.message = this.SPECIJALAN_KARAKTER_MESSAGE;
      return false;
    }
    return true;
  }

  zatvoriAlert() {
    this.message = '';
  }
}
