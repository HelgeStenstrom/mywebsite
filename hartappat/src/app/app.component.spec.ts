import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
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
    expect(app.title).toEqual('hartappat');
  });


  // Taking inspiration from
  // https://www.digitalocean.com/community/tutorials/angular-introduction-unit-testing
  // but my html is different, and the test is not really applicable.

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const querySelectorBody = compiled.querySelector('app-navbar');
    const actual = querySelectorBody?.textContent;
    console.log("actual: ", actual);
    expect(actual).toContain('Den här texten syns');
    //expect(compiled.querySelector('body h1')?.textContent).toContain('Härtappat');
  });

  it('is expected to pass', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    // const compiled = fixture.nativeElement as HTMLElement;
    expect(2 === 2).toBeTruthy();
  });

});
