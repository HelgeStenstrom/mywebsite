import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingWineComponent} from './tasting-wine.component';

describe('TastingWineComponent', () => {
  let component: TastingWineComponent;
  let fixture: ComponentFixture<TastingWineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TastingWineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TastingWineComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




});
