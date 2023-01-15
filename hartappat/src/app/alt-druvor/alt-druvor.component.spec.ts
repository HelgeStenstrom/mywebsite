import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltDruvorComponent } from './alt-druvor.component';

describe('AltDruvorComponent', () => {
  let component: AltDruvorComponent;
  let fixture: ComponentFixture<AltDruvorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltDruvorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltDruvorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
