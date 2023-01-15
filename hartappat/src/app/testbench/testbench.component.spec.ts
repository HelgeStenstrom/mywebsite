import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestbenchComponent} from './testbench.component';
import {Component} from "@angular/core";

describe('TestbenchComponent', () => {
  let component: TestbenchComponent;
  let fixture: ComponentFixture<TestbenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestbenchComponent, MockFiledropComponent, MockAltDruvorComponent]
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

@Component({
  selector: 'app-filedrop',
  template: ''
})
class MockFiledropComponent {
}

@Component({
  selector: 'app-alt-druvor',
  template: ''
})
class MockAltDruvorComponent {
}
