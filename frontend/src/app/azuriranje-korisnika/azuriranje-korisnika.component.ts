import { Component, OnInit } from '@angular/core';
import { Poljoprivrednik } from '../models/Poljoprivrednik';
import { Preduzece } from '../models/Preduzece';
import { KorisniciService } from '../korisnici.service';

@Component({
  selector: 'app-azuriranje-korisnika',
  templateUrl: './azuriranje-korisnika.component.html',
  styleUrls: ['./azuriranje-korisnika.component.css']
})
export class AzuriranjeKorisnikaComponent implements OnInit {

  constructor(private servis: KorisniciService) { }

  ngOnInit(): void {
  }

  tip = 'Poljoprivrednik';
  username: string;
  message = '';

  poljoprivrednik: Poljoprivrednik;
  preduzece: Preduzece;
  oldUsername: string;

  pressedButton1 = false;
  pressedButton2 = false;

  pretrazi() {
    this.message = '';
    this.pressedButton1 = true;

    if (this.poljoprivrednik && this.poljoprivrednik.username == this.username && this.tip == 'Poljoprivrednik'
      || this.preduzece && this.preduzece.username == this.username && this.tip == 'Preduzece') {
      this.pressedButton1 = false;
      return;
    }

    this.servis.pronadjiKorisnika(this.username, this.tip, true).subscribe(result => {
      if (result['message'] != 'ok') {
        this.poljoprivrednik = null;
        this.preduzece = null;
        this.pressedButton1 = false;
        this.message = result['message'];
        return;
      }

      if (!result['korisnik']['username']) {
        this.poljoprivrednik = null;
        this.preduzece = null;
        this.pressedButton1 = false;
        this.message = 'Nije pronadjen nijedan korisnik';
        return;
      }

      let korisnik = result['korisnik'];
      this.oldUsername = korisnik['username'];
      if (this.tip == 'Poljoprivrednik') {
        this.preduzece = null;
        this.poljoprivrednik = {
          username: korisnik['username'],
          password: korisnik['password'],
          ime: korisnik['ime'],
          prezime: korisnik['prezime'],
          datumRodjenja: new Date(korisnik['datum_rodjenja'].substring(0, 10)),
          mestoRodjenja: korisnik['mesto_rodjenja'],
          telefon: korisnik['kontakt_telefon'],
          email: korisnik['email']
        };
      }
      else if (this.tip == 'Preduzece') {
        this.poljoprivrednik = null;
        this.preduzece = {
          username: korisnik['username'],
          password: korisnik['password'],
          punNaziv: korisnik['punNaziv'],
          datumOsnivanja: new Date(korisnik['datumOsnivanja'].substring(0, 10)),
          mesto: korisnik['mesto'],
          email: korisnik['email'],
          brojSlobodnihKurira: korisnik['brojSlobodnihKurira']
        };
      }
      this.pressedButton1 = false;
    });
  }

  zatvoriAlert() {
    this.message = '';
  }

  azurirajPoljoprivrednika() {
    this.message = '';
    this.pressedButton2 = true;

    if (this.emptyPoljoprivrednik(this.poljoprivrednik)) {
      this.pressedButton2 = false;
      this.message = 'Sva polja su obavezna';
      return;
    }

    this.servis.azurirajKorisnika(this.poljoprivrednik, 'poljoprivrednik', this.oldUsername).subscribe(result => {
      if (result['message'] != 'ok') {
        this.pressedButton2 = false;
        this.message = result['message'];
        return;
      }
      this.poljoprivrednik = null;
      this.username = '';
      this.pressedButton2 = false;
    })
  }

  azurirajPreduzece() {
    this.message = '';
    this.pressedButton2 = false;

    if (this.emptyPreduzece(this.preduzece)) {
      this.pressedButton2 = false;
      this.message = 'Sva polja su obavezna';
      return;
    }

    this.servis.azurirajKorisnika(this.preduzece, 'preduzece', this.oldUsername).subscribe(result => {
      if (result['message'] != 'ok') {
        this.pressedButton2 = false;
        this.message = result['message'];
        return;
      }
      this.preduzece = null;
      this.username = '';
      this.pressedButton2 = false;
    })
  }

  emptyField(field): boolean {
    return !field || field == '';
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
}
