import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Component} from "@angular/core";
import {of} from "rxjs";
import {AuthService} from "./services/auth.service";

describe('AppComponent', () => {
  let authServiceMock: { fetchCurrentUser: jest.Mock };
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    authServiceMock = {
      fetchCurrentUser: jest.fn().mockReturnValue(of(
        { id: 1,
          email: 'user@example.com',
          memberId: null })),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent,],
      imports: [MockNavbarComponent, MockRouterOutlet,],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have as title "hartappat"', () => {
    expect(component.title).toEqual('Härtappat');
  });

  test('calls fetchCurrentUser on init', () => {
    expect(authServiceMock.fetchCurrentUser).toHaveBeenCalled();
  });

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
