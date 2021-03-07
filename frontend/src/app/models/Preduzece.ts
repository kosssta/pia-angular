import { Korisnik } from './Korisnik';

export interface Preduzece extends Korisnik {
  punNaziv: string;
  datumOsnivanja: Date;
  mesto: string;
  email: string;
  brojSlobodnihKurira: number;
}
