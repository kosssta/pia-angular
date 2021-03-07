import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikDetaljiComponent } from './korisnik-detalji.component';

describe('KorisnikDetaljiComponent', () => {
  let component: KorisnikDetaljiComponent;
  let fixture: ComponentFixture<KorisnikDetaljiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KorisnikDetaljiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KorisnikDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
