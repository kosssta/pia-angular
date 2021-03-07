import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SadnicaDetaljiComponent } from './sadnica-detalji.component';

describe('SadnicaDetaljiComponent', () => {
  let component: SadnicaDetaljiComponent;
  let fixture: ComponentFixture<SadnicaDetaljiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SadnicaDetaljiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SadnicaDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
