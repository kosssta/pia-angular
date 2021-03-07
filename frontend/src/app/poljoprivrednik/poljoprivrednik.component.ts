import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Poljoprivrednik } from '../models/Poljoprivrednik';
import { Rasadnik } from '../models/Rasadnik';
import { RasadniciService } from '../rasadnici.service';

@Component({
  selector: 'app-poljoprivrednik',
  templateUrl: './poljoprivrednik.component.html',
  styleUrls: ['./poljoprivrednik.component.css']
})
export class PoljoprivrednikComponent implements OnInit {

  constructor(private ruter: Router, private servis: RasadniciService) { }

  ngOnInit(): void {
    const loggedIn = JSON.parse(localStorage.getItem('loggedInUser'));
    if (this.emptyField(loggedIn) || this.emptyField(loggedIn.tip) || loggedIn.tip != 'poljoprivrednik') {
      this.ruter.navigate(['/login']);
      return;
    }

    this.loggedIn = JSON.parse(JSON.stringify(loggedIn));

    this.servis.dohvatiRasadnike(loggedIn.username).subscribe(res => {
      if (res['message'] != 'ok') return;

      this.rasadnici = JSON.parse(JSON.stringify(res['rasadnici']));
      this.ucitano = true;
    })
  }

  ucitano = false;

  loggedIn: Poljoprivrednik;
  rasadnici: Rasadnik[];

  rasadnikDodavanje: Rasadnik = {} as Rasadnik;
  duzina: string;
  sirina: string;

  pressedButton = false;
  message = '';

  dodajRasadnik() {
    this.message = '';
    this.pressedButton = true;

    if (this.emptyField(this.rasadnikDodavanje.naziv) || this.emptyField(this.rasadnikDodavanje.mesto)
      || this.emptyField(this.duzina) || this.emptyField(this.sirina)) {
      this.pressedButton = false;
      this.message = 'Sva polja su obavezna';
      return;
    }

    if (this.emptyField(parseInt(this.duzina)) || parseInt(this.duzina) <= 0) {
      this.pressedButton = false;
      this.message = 'Duzina rasadnika nije validna';
      return;
    }

    if (this.emptyField(parseInt(this.sirina)) || parseInt(this.sirina) <= 0) {
      this.pressedButton = false;
      this.message = 'Sirina rasadnika nije validna';
      return;
    }

    this.rasadnikDodavanje.duzina = parseInt(this.duzina);
    this.rasadnikDodavanje.sirina = parseInt(this.sirina);

    this.servis.dodajRasadnik(this.loggedIn.username, this.rasadnikDodavanje).subscribe(res => {
      this.pressedButton = false;
      if (res['message'] != 'ok') this.message = res['message'];
      else {
        this.rasadnikDodavanje.idRas = res['idRasadnika'];
        this.rasadnikDodavanje.voda = 200;
        this.rasadnikDodavanje.temperatura = 18;
        this.rasadnikDodavanje.brojZasadjenihSadnica = 0;
        this.rasadnici.push(this.rasadnikDodavanje);
        this.rasadnikDodavanje = {} as Rasadnik;
        this.duzina = '';
        this.sirina = '';
      }
    })
  }

  closeAlert() {
    this.message = '';
  }

  prikaziRasadnik(id: number) {
    this.ruter.navigate(['/rasadnik/' + id]);
  }

  emptyField(field): boolean {
    return !field || field == '';
  }
}
