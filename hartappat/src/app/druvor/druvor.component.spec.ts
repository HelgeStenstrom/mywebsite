import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DruvorComponent } from './druvor.component';

describe('DruvorComponent', () => {
  let component: DruvorComponent;
  let fixture: ComponentFixture<DruvorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
