import { Component, OnInit } from '@angular/core';
import { Poljoprivrednik } from '../models/Poljoprivrednik';
import { Preduzece } from '../models/Preduzece';
import { Router } from '@angular/router';
import { KorisniciService } from '../korisnici.service';

@Component({
  selector: 'app-dodavanje-korisnika',
  templateUrl: './dodavanje-korisnika.component.html',
  styleUrls: ['./dodavanje-korisnika.component.css']
})
export class DodavanjeKorisnikaComponent implements OnInit {

  constructor(private ruter: Router, private servis: KorisniciService) { }

  ngOnInit(): void {
    this.DEFAULT_TIP = 'poljoprivednik';
    this.poljoprivrednik = {} as Poljoprivrednik;
    this.preduzece = {} as Preduzece;
    this.promenaTipa('poljoprivrednik');
  }

  DEFAULT_TIP: string;
  poljoprivrednik: Poljoprivrednik;
  preduzece: Preduzece;
  potvrdaLozinke: string;
  tip: string;

  message = '';
  OBAVEZNA_POLJA_MESSAGE = 'Sva polja su obavezna';
  NEISPRAVNA_DUZINA_LOZINKE_MESSAGE = 'Lozinka mora imati najmanje 7 karaktera';
  VELIKO_SLOVO_MESSAGE = 'Lozinka mora imati bar 1 veliko slovo';
  MALO_SLOVO_MESSAGE = 'Lozinka mora imati bar 1 malo slovo';
  SPECIJALAN_KARAKTER_MESSAGE = 'Lozinka mora imati bar 1 specijalan karakter';
  NEISPRAVNA_POTVRDA_LOZINKE_MESSAGE = 'Potvrda lozinke i lozinka se razlikuju'
  NEISPRAVAN_EMAIL_MESSAGE = 'Pogresan format emaila';
  NEISPRAVAN_DATUM_MESSAGE = 'Pogresan datum';
  NEISPRAVAN_BROJ_TELEFONA_MESSAGE = 'Neispravan broj telefona';
  INVALID_CAPTCHA_MESSAGE = 'Captcha je obevezan';

  pressedButton = false;

  promenaTipa(tip: string) {
    this.tip = tip;
  }

  zatvoriPoruku() {
    this.message = '';
  }

  registracijaPoljoprivrednika() {
    this.message = '';
    this.pressedButton = true;

    if (this.emptyPoljoprivrednik(this.poljoprivrednik) || this.emptyField(this.potvrdaLozinke)) {
      this.pressedButton = false;
      this.message = this.OBAVEZNA_POLJA_MESSAGE;
      return;
    }

    if (!this.ispravnaLozinka(this.poljoprivrednik.password)) {
      this.pressedButton = false;
      return;
    }

    if (this.poljoprivrednik.password != this.potvrdaLozinke) {
      this.pressedButton = false;
      this.message = this.NEISPRAVNA_POTVRDA_LOZINKE_MESSAGE;
      return;
    }

    if (!this.ispravanEmail(this.poljoprivrednik.email)) {
      this.pressedButton = false;
      this.message = this.NEISPRAVAN_EMAIL_MESSAGE;
      return;
    }

    if (!this.ispravanDatum(new Date(this.poljoprivrednik.datumRodjenja))) {
      this.pressedButton = false;
      this.message = this.NEISPRAVAN_DATUM_MESSAGE;
      return;
    }

    if (!this.ispravanBrojTelefona(this.poljoprivrednik.telefon)) {
      this.pressedButton = false;
      this.message = this.NEISPRAVAN_BROJ_TELEFONA_MESSAGE;
      return;
    }

    this.servis.registracija(this.poljoprivrednik, this.tip.toLowerCase(), 1).subscribe(ret => {
      if (ret['message'].toLowerCase() == 'ok') location.reload();
      else this.message = ret['message'];
      this.pressedButton = false;
    },
      err => console.log(err)
    )
  }

  registracijaPreduzeca() {
    this.message = '';
    this.pressedButton = true;

    if (this.emptyPreduzece(this.preduzece) || this.emptyField(this.potvrdaLozinke)) {
      this.pressedButton = false;
      this.message = this.OBAVEZNA_POLJA_MESSAGE;
      return;
    }

    if (!this.ispravnaLozinka(this.preduzece.password)) {
      this.pressedButton = false;
      return;
    }

    if (this.preduzece.password != this.potvrdaLozinke) {
      this.pressedButton = false;
      this.message = this.NEISPRAVNA_POTVRDA_LOZINKE_MESSAGE;
      return;
    }

    if (!this.ispravanEmail(this.preduzece.email)) {
      this.pressedButton = false;
      this.message = this.NEISPRAVAN_EMAIL_MESSAGE;
      return;
    }

    if (!this.ispravanDatum(new Date(this.preduzece.datumOsnivanja))) {
      this.pressedButton = false;
      this.message = this.NEISPRAVAN_DATUM_MESSAGE;
      return;
    }

    this.servis.registracija(this.preduzece, this.tip.toLowerCase(), 1).subscribe(result => {
      let ret = result['message'];
      if (ret.toLowerCase() != 'ok') this.message = ret;
      else this.message = ret;
      this.pressedButton = false;
    })
  }

  emptyPoljoprivrednik(poljoprivrednik: Poljoprivrednik): boolean {
    return poljoprivrednik &&
      (this.emptyField(poljoprivrednik.ime) || this.emptyField(poljoprivrednik.prezime)
        || this.emptyField(poljoprivrednik.username) || this.emptyField(poljoprivrednik.password)
        || this.emptyField(poljoprivrednik.datumRodjenja) || this.emptyField(poljoprivrednik.mestoRodjenja)
        || this.emptyField(poljoprivrednik.telefon) || this.emptyField(poljoprivrednik.email));
  }

  emptyPreduzece(preduzece: Preduzece): boolean {
    return preduzece &&
      (this.emptyField(preduzece.punNaziv) || this.emptyField(preduzece.username)
        || this.emptyField(preduzece.password) || this.emptyField(preduzece.datumOsnivanja)
        || this.emptyField(preduzece.mesto) || this.emptyField(preduzece.email));
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

  ispravanEmail(email: string): boolean {
    return email && /^.+@([^.]+\.)+[^.]{1,3}$/.test(email);
  }

  ispravanDatum(datum: Date): boolean {
    return datum && datum.getTime() < Date.now();
  }

  ispravanBrojTelefona(telefon: string): boolean {
    return telefon && /^[+]{0,1}\d+(-\d+)*$/.test(telefon);
  }

}
