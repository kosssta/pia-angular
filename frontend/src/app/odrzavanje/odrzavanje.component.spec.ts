import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdrzavanjeComponent } from './odrzavanje.component';

describe('OdrzavanjeComponent', () => {
  let component: OdrzavanjeComponent;
  let fixture: ComponentFixture<OdrzavanjeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdrzavanjeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdrzavanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
