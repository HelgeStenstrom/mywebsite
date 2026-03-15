import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWineToTastingComponent} from './add-wine-to-tasting.component';

describe('AddWineToTastingComponent', () => {
  let component: AddWineToTastingComponent;
  let fixture: ComponentFixture<AddWineToTastingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWineToTastingComponent]
    });
    fixture = TestBed.createComponent(AddWineToTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
