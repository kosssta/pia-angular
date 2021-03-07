import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AzuriranjeKorisnikaComponent } from './azuriranje-korisnika.component';

describe('AzuriranjeKorisnikaComponent', () => {
  let component: AzuriranjeKorisnikaComponent;
  let fixture: ComponentFixture<AzuriranjeKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AzuriranjeKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AzuriranjeKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
