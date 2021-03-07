import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NarudzbineService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  dohvatiNarudzbine(idPre): Observable<Object> {
    return this.http.post(`${this.url}/narudzbine/dohvati`, { idPre: idPre });
  }

  odbijNarudzbinu(idNar): Observable<Object> {
    return this.http.post(`${this.url}/narudzbine/odbij`, { idNar: idNar });
  }

  prihvatiNarudzbinu(idNar, proizvodjac, mestoProizvodjaca, narucilac, kolicina): Observable<Object> {
    return this.http.post(`${this.url}/narudzbine/prihvati`, { idNar: idNar, proizvodjac: proizvodjac, origin: mestoProizvodjaca, narucilac: narucilac, kolicina: kolicina });
  }

  dohvatiNarudzbinePoslednjih30Dana(): Observable<Object> {
    return this.http.get(`${this.url}/narudzbine`);
  }
}
