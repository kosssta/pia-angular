import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rasadnik } from './models/Rasadnik';

@Injectable({
  providedIn: 'root'
})
export class RasadniciService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  dohvatiRasadnike(username: string): Observable<Object> {
    return this.http.post(`${this.url}/rasadnici`, { username: username });
  }

  dohvatiRasadnik(id): Observable<Object> {
    return this.http.post(`${this.url}/rasadnici/dohvati`, { idRas: id });
  }

  dodajRasadnik(username: string, rasadnik: Rasadnik): Observable<Object> {
    return this.http.post(`${this.url}/rasadnici/dodavanje`, { username: username, rasadnik: rasadnik });
  }

  azurirajRasadnik(rasadnik: Rasadnik): Observable<Object> {
    return this.http.patch(`${this.url}/rasadnici`, { rasadnik: rasadnik });
  }

  dohvatiRasadnikeOdrzavanje(idKor): Observable<Object> {
    return this.http.post(`${this.url}/rasadnici/odrzavanje`, { idKor: idKor });
  }
}
