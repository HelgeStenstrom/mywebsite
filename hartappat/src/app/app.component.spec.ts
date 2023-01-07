import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Component} from "@angular/core";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent, MockNavbarComponent, MockRouterOutlet
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'hartappat'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Härtappat');
  });


  // Taking inspiration from
  // https://www.digitalocean.com/community/tutorials/angular-introduction-unit-testing
  // but my html is different, and the test is not really applicable.


});

@Component({
  selector: 'app-navbar',
  template: ''
})
class MockNavbarComponent {
}

@Component({
  selector: 'router-outlet',
  template: ''
})
class MockRouterOutlet {
}
