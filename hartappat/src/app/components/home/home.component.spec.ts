import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {Component} from "@angular/core";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent,
        MockAboutComponent,
        MockAppWinesComponent,
        MockDruvorComponent,
        MockVinmonopoletComponent,
        MockVinprovningComponent,
        MockWikipediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-about',
  template: ''
})
class MockAboutComponent {
}

@Component({
  selector: 'app-vinprovning',
  template: ''
})
class MockVinprovningComponent {
}

@Component({
  selector: 'app-wikipedia',
  template: ''
})
class MockWikipediaComponent {
}

@Component({
  selector: 'app-vinmonopolet',
  template: ''
})
class MockVinmonopoletComponent {
}

@Component({
  selector: 'app-druvor',
  template: ''
})
class MockDruvorComponent {
}

@Component({
  selector: 'app-wines',
  template: ''
})
class MockAppWinesComponent {
}
