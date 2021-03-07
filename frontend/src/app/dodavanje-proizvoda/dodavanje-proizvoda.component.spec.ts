import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeProizvodaComponent } from './dodavanje-proizvoda.component';

describe('DodavanjeProizvodaComponent', () => {
  let component: DodavanjeProizvodaComponent;
  let fixture: ComponentFixture<DodavanjeProizvodaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodavanjeProizvodaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodavanjeProizvodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
