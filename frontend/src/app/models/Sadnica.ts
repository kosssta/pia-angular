import { Proizvod } from './Proizvod';

export interface Sadnica extends Proizvod {
  idSad: number;
  x: number;
  y: number;
  starost: number;
  trajanjeSazrevanja: number;
  izvadjena: boolean;
  ogranicenja: Array<number>;
}
