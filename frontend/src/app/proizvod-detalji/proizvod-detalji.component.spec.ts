import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProizvodDetaljiComponent } from './proizvod-detalji.component';

describe('ProizvodDetaljiComponent', () => {
  let component: ProizvodDetaljiComponent;
  let fixture: ComponentFixture<ProizvodDetaljiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProizvodDetaljiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProizvodDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
