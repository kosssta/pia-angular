import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomentariComponent } from './komentari.component';

describe('KomentariComponent', () => {
  let component: KomentariComponent;
  let fixture: ComponentFixture<KomentariComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomentariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomentariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
