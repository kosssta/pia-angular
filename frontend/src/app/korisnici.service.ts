import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Korisnik } from './models/Korisnik';

@Injectable({
  providedIn: 'root'
})
export class KorisniciService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  login(username, password, tip): Observable<Object> {
    let korisnik: Korisnik = {
      username: username,
      password: password
    };
    let data = {
      korisnik: korisnik,
      tip: tip
    };
    return this.http.post(`${this.url}/login`, data);
  }

  registracija(korisnik: Korisnik, tip: string, status: number): Observable<Object> {
    korisnik['tip'] = tip;
    korisnik['status'] = status;
    return this.http.post(`${this.url}/registracija`, korisnik);
  }

  promenaLozinke(idKor, novaLozinka): Observable<Object> {
    const data = {
      idKor: idKor,
      password: novaLozinka
    }
    return this.http.patch(`${this.url}/login`, data);
  }

  dohvatiZahteve(): Observable<Object> {
    return this.http.get(`${this.url}/login/zahtevi`);
  }

  odobriZahtev(username: string): Observable<Object> {
    return this.http.patch(`${this.url}/login/zahtevi/odobri`, { username: username });
  }

  odbijZahtev(username: string): Observable<Object> {
    return this.http.patch(`${this.url}/login/zahtevi/odbij`, { username: username });
  }

  pronadjiKorisnika(username: string, tip: string, proveraZahteva: boolean): Observable<Object> {
    return this.http.post(`${this.url}/login/zahtevi`, { username: username, tip: tip, proveraZahteva: proveraZahteva });
  }

  obrisiZahteve(): Observable<Object> {
    return this.http.delete(`${this.url}/login/zahtevi`);
  }

  validateCaptcha(response: string): Observable<Object> {
    return this.http.post(`${this.url}/token-validate`, { captcha: response });
  }

  obrisiKorisnika(username: string): Observable<Object> {
    return this.http.post(`${this.url}/login/brisanje`, { username: username });
  }

  azurirajKorisnika(korisnik: Korisnik, tip: string, oldUsername: string): Observable<Object> {
    const data = {
      korisnik: korisnik,
      tip: tip,
      oldUsername: oldUsername
    };
    return this.http.post(`${this.url}/login/azuriraj`, data);
  }
}
