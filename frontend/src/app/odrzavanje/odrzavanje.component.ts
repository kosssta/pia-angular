import { Component, OnInit } from '@angular/core';
import { RasadniciService } from '../rasadnici.service';
import { Rasadnik } from '../models/Rasadnik';

@Component({
  selector: 'app-odrzavanje',
  templateUrl: './odrzavanje.component.html',
  styleUrls: ['./odrzavanje.component.css']
})
export class OdrzavanjeComponent implements OnInit {

  constructor(private servis: RasadniciService) { }

  ngOnInit(): void {
    const idKor = localStorage.getItem('idKor');
    this.servis.dohvatiRasadnikeOdrzavanje(idKor).subscribe(ras => {
      if (ras['message'] != 'ok') return;
      this.rasadnici = JSON.parse(JSON.stringify(ras['rasadnici']));
    })
  }

  rasadnici: Rasadnik[];
}
