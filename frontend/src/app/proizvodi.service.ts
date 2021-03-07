import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Komentar } from './models/Komentar';
import { Sadnica } from './models/Sadnica';
import { Preparat } from './models/Preparat';
import { Proizvod } from './models/Proizvod';

@Injectable({
  providedIn: 'root'
})
export class ProizvodiService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  dohvatiProizvod(idPro): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi`, { idPro: idPro });
  }

  dohvatiSadnice(idKor, idRas = null): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/sadnice`, { idKor: idKor, idRas: idRas });
  }

  dohvatiPreparate(idKor, idRas = null): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/preparati`, { idKor: idKor, idRas: idRas });
  }

  dohvatiProizvodePreduzeca(): Observable<Object> {
    return this.http.get(`${this.url}/proizvodi`);
  }

  dohvatiSadnicePreduzeca(): Observable<Object> {
    return this.http.get(`${this.url}/proizvodi/sadnice`);
  }

  dohvatiPreparatePreduzeca(): Observable<Object> {
    return this.http.get(`${this.url}/proizvodi/preparati`);
  }

  dohvatiKomentare(idPro, idKor): Observable<Object> {
    return this.http.post(`${this.url}/komentari`, { idPro: idPro, idKor: idKor });
  }

  dohvatiKomentar(idPro, idKor): Observable<Object> {
    return this.http.put(`${this.url}/komentari`, { idPro: idPro, idKor: idKor });
  }

  naruciProizvod(idPolj, idPro, idRas, kolicina): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/naruci`, { idKor: idPolj, idPro: idPro, idRas: idRas, kolicina: kolicina });
  }

  dohvatiNarudzbine(idPolj, idRas): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/narudzbine`, { idKor: idPolj, idRas: idRas });
  }

  povuciProizvod(idPro): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/povuci`, { idPro: idPro });
  }

  dodajKomentar(komentar: Komentar): Observable<Object> {
    return this.http.post(`${this.url}/komentari/dodavanje`, { komentar: komentar });
  }

  zasadiSadnicu(idPro, x, y, idRas, vlasnik): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/zasadi`, { idPro: idPro, x: x, y: y, idRas: idRas, vlasnik: vlasnik });
  }

  dodajPreparat(idSad, x, y, idRas, vlasnik, preparat): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/dodaj_preparat`, { idSad: idSad, x: x, y: y, idRas: idRas, vlasnik: vlasnik, preparat: preparat });
  }

  izvadiSadnicu(idSad, idRas): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/izvadi`, { idSad: idSad, idRas: idRas });
  }

  proveriSadnicu(x, y, idRas): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/proveri`, { x: x, y: y, idRas: idRas });
  }

  dodajProizvod(proizvod: Proizvod, tip: string, trajanjeSazrevanja, ubrzanje, ogranicenja) {
    return this.http.post(`${this.url}/proizvodi/dodaj`, { proizvod: proizvod, tip: tip, trajanjeSazrevanja: trajanjeSazrevanja, ubrzanje: ubrzanje, ogranicenja: ogranicenja });
  }

  dohvatiNezasadjeneSadnice(idKor, idRas = null): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/dohvatiNeposadjene`, { idKor: idKor, idRas: idRas });
  }

  azurirajOgranicenja(proizvod, ogranicenja): Observable<Object> {
    return this.http.post(`${this.url}/proizvodi/azurirajOgranicenja`, { proizvod: proizvod, ogranicenja: ogranicenja });
  }
}
