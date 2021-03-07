import { Korisnik } from './Korisnik';

export interface Poljoprivrednik extends Korisnik {
  ime: string;
  prezime: string;
  datumRodjenja: Date;
  mestoRodjenja: string;
  telefon: string;
  email: string;
}
