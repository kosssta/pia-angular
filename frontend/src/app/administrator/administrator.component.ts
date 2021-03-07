import { Component, OnInit } from '@angular/core';
import { KorisniciService } from '../korisnici.service';
import { Zahtev } from '../models/Zahtev';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  constructor(private servis: KorisniciService, private ruter: Router) { }

  ngOnInit(): void {
    const loggedIn = JSON.parse(localStorage.getItem('loggedInUser'));
    if (this.emptyField(loggedIn) || this.emptyField(loggedIn.tip) || loggedIn.tip != 'administrator') {
      this.ruter.navigate(['/login']);
      return;
    }
    this.servis.obrisiZahteve().subscribe(() => {
      this.servis.dohvatiZahteve().subscribe(zahtevi => {
        this.zahtevi = JSON.parse(JSON.stringify(zahtevi));
        this.ucitano = true;
      })
    })
  }

  TIPOVI = ['poljoprivrednik', 'preduzece', 'administrator'];
  USERNAME = ['Korisnicko ime', 'Skraceni naziv', 'Korisnicko ime'];
  zahtevi: Zahtev[];

  message = '';

  zahtevDetalji: Zahtev;

  ucitano = false;
  strana = 0;

  prikaziStatus(status: number): string {
    return status == 0 ? 'na cekanju' : status == 1 ? 'odobreno' : 'odbijeno';
  }

  promeniStranu(strana: number) {
    this.strana = strana;
  }

  zatvoriPoruku() {
    this.message = '';
  }

  odobri(index: number) {
    this.servis.odobriZahtev(this.zahtevi[index].username).subscribe(result => {
      if (result['message'] == 'ok') this.zahtevi[index].status = 1;
      else this.message = result['message'];
    })
  }

  odbij(index: number) {
    this.servis.odbijZahtev(this.zahtevi[index].username).subscribe(result => {
      if (result['message'] == 'ok') this.zahtevi[index].status = 2;
      else this.message = result['message'];
    })
  }

  emptyField(field): boolean {
    return !field || field == '';
  }

  prikaziDetalje(zahtev: Zahtev) {
    if (this.zahtevDetalji != zahtev) this.zahtevDetalji = zahtev;
    else this.zahtevDetalji = null;
  }

}
