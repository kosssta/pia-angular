import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeKorisnikaComponent } from './dodavanje-korisnika.component';

describe('DodavanjeKorisnikaComponent', () => {
  let component: DodavanjeKorisnikaComponent;
  let fixture: ComponentFixture<DodavanjeKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodavanjeKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodavanjeKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
