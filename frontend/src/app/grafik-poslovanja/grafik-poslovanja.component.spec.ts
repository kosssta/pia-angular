import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafikPoslovanjaComponent } from './grafik-poslovanja.component';

describe('GrafikPoslovanjaComponent', () => {
  let component: GrafikPoslovanjaComponent;
  let fixture: ComponentFixture<GrafikPoslovanjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrafikPoslovanjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafikPoslovanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
