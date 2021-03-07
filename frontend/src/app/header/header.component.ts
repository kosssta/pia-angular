import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('loggedInUser');
    this.ulogovanKorisnik = !this.emptyField(loggedInUser);
    this.tip = loggedInUser['tip'];
  }

  @Input() nazad: number;
  ulogovanKorisnik: boolean;
  tip: string;

  odjava() {
    localStorage.clear();
  }

  emptyField(field): boolean {
    return !field || field == '';
  }
}
