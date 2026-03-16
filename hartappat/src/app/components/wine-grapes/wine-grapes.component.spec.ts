import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineGrapesComponent} from './wine-grapes.component';

describe('WineGrapesComponent', () => {
  let component: WineGrapesComponent;
  let fixture: ComponentFixture<WineGrapesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineGrapesComponent]
    });
    fixture = TestBed.createComponent(WineGrapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
