import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proizvod } from '../models/Proizvod';
import { ProizvodiService } from '../proizvodi.service';
import { Sadnica } from '../models/Sadnica';

@Component({
  selector: 'app-dodavanje-proizvoda',
  templateUrl: './dodavanje-proizvoda.component.html',
  styleUrls: ['./dodavanje-proizvoda.component.css']
})
export class DodavanjeProizvodaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private servis: ProizvodiService) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      NazivCtrl: ['', Validators.required],
      TipCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      PopunjenaCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      CenaCtrl: ['', Validators.required],
      KolicinaCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this.formBuilder.group({
      OgranicenjaCtrl: ['', Validators.maxLength]
    });

    this.servis.dohvatiSadnicePreduzeca().subscribe(ret => {
      this.sveSadnicePreduzeca = JSON.parse(JSON.stringify(ret['sadnice']));
    });
  }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  naziv: string;
  tip: string;
  cena: string;
  kolicina: string;
  ubrzanje: string;
  trajanjeSazrevanja: string;

  sveSadnicePreduzeca: Sadnica[];
  ogranicenja = [];

  ALERTS = [
    { tip: 'danger', poruka: 'Greska pri dodavanju proizvoda' },
    { tip: 'success', poruka: 'Uspesno dodavanje proizvoda' }
  ];

  poruka = -1;

  dodeliTip() {
    this.tip = this.firstFormGroup.controls['TipCtrl'].value;
    this.cena = '';
    this.kolicina = '';
    this.ubrzanje = '';
    this.trajanjeSazrevanja = '';
    this.ogranicenja = [];
  }

  obrisiTip() {
    this.tip = '';
  }

  zatvoriAlert() {
    this.poruka = -1;
  }

  dodajProizvod() {
    this.poruka = -1;

    if (this.tip == 'Sadnica') this.trajanjeSazrevanja = this.secondFormGroup.controls['PopunjenaCtrl'].value;
    else this.ubrzanje = this.secondFormGroup.controls['PopunjenaCtrl'].value;

    this.naziv = this.firstFormGroup.controls['NazivCtrl'].value;
    this.cena = this.thirdFormGroup.controls['CenaCtrl'].value;
    this.kolicina = this.thirdFormGroup.controls['KolicinaCtrl'].value;
    this.ogranicenja = this.fourthFormGroup.controls['OgranicenjaCtrl'].value;

    let proizvod: Proizvod = {
      idPro: null,
      naziv: this.naziv,
      proizvodjac: localStorage.getItem('idKor'),
      kolicina: +this.kolicina,
      ocena: null,
      cena: +this.cena
    };

    if(this.tip == 'Preparat') this.ogranicenja = [];

    this.servis.dodajProizvod(proizvod, this.tip.toLowerCase(), +this.trajanjeSazrevanja, +this.ubrzanje, this.ogranicenja).subscribe(ret => {
      if (ret['message'] != 'ok') this.poruka = 0;
      else if (this.tip == 'Sadnica') {
        this.servis.azurirajOgranicenja(proizvod, this.ogranicenja).subscribe(ret => {
          if (ret['message'] != 'ok') this.poruka = 0;
          else this.poruka = 1;
        })
      } else this.poruka = 1;
    });
  }
}
