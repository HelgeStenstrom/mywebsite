import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DruvaComponent } from './druva.component';

describe('DruvaComponent', () => {
  let component: DruvaComponent;
  let fixture: ComponentFixture<DruvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
