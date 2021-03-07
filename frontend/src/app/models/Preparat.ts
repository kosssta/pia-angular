import { Proizvod } from './Proizvod';

export interface Preparat extends Proizvod {
  idPre: number;
  idRas: number;
  ubrzanje: number;
}
