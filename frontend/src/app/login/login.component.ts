import { Component, OnInit } from '@angular/core';
import { KorisniciService } from '../korisnici.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private servis: KorisniciService, private ruter: Router) { }

  ngOnInit(): void {
    localStorage.setItem('loggedInUser', '');
    this.tip = this.TIPOVI[0];
    this.identifikator = this.IDENTIFIKATORI[0];
  }

  TIPOVI = ['Poljoprivrednik', 'Preduzece', 'Administrator'];
  IDENTIFIKATORI = ['Korisnicko ime', 'Naziv', 'Korisnicko ime'];
  DEFAULT_IDENTIFIKATOR = 'Korisnicko ime';

  tip: string;
  identifikator: string;

  username: string;
  password: string;
  message = '';

  pressedButton = false;

  login() {
    this.message = '';
    this.pressedButton = true;

    if (this.emptyField(this.username) || this.emptyField(this.password) || this.emptyField(this.tip)) {
      this.message = 'Sva polja su obavezna';
      this.pressedButton = false;
      return;
    }

    this.servis.login(this.username, this.password, this.tip).subscribe(korisnik => {
      this.pressedButton = false;
      let ret = korisnik['message'];
      if (ret.toLowerCase() != 'ok') this.message = ret;
      else {
        localStorage.setItem('loggedInUser', JSON.stringify(korisnik['korisnik']));
        localStorage.setItem('idKor', korisnik['idKor']);
        this.ruter.navigate([`/${this.tip.toLowerCase()}`]);
      }
    })
  }

  zatvoriPoruku() {
    this.message = '';
  }

  promenaTipa() {
    this.identifikator = this.IDENTIFIKATORI[this.TIPOVI.indexOf(this.tip)] || this.DEFAULT_IDENTIFIKATOR;
  }

  emptyField(field): boolean {
    return !field || field == '';
  }

}
