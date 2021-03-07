import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrisanjeKorisnikaComponent } from './brisanje-korisnika.component';

describe('BrisanjeKorisnikaComponent', () => {
  let component: BrisanjeKorisnikaComponent;
  let fixture: ComponentFixture<BrisanjeKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrisanjeKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrisanjeKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
