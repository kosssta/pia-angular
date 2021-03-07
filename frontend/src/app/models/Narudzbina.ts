import { Proizvod } from './Proizvod';

export interface Narudzbina {
  idNar: number;
  proizvod: Proizvod;
  narucilac: string;
  rasadnik: number;
  kolicina: number;
  status: number;
  datum: Date;
}
