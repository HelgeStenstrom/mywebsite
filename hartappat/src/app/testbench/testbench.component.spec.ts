import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestbenchComponent } from './testbench.component';

describe('TestbenchComponent', () => {
  let component: TestbenchComponent;
  let fixture: ComponentFixture<TestbenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestbenchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
