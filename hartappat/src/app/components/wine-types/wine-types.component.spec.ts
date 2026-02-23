import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineTypesComponent} from './wine-types.component';

describe('WineTypesComponent', () => {
  let component: WineTypesComponent;
  let fixture: ComponentFixture<WineTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineTypesComponent]
    });
    fixture = TestBed.createComponent(WineTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
