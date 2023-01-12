# Testing notes

## Testing components with mocked dependencies

## The default, auto-generated tests of a Component

This example is the auto-generated test for a component that is probably the 
simplest in this repository.

``` typescript
describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

The constructor of the component has no arguments, and does nothing. The 
component has no dependencies. 

The `beforeEach` part is run before each test. There is only one test in this 
case; which tests that the component can be created; that an instance of the 
class `NotFoundComponent` can be created.

The component instance is declared on the top, followed by declaration of 
the fixture, which will hold the tested instance. The `beforeEach` method 
calls `configureTestingModule()` with an object as argument; this object 
depends a lot on the testing needs. This case is the simplest you will see.

### Component that uses a MatDialog

MatDialog comes from Angular material. It's used by DruvorComponent for 
editing a grape.

We don't want the MatDialog in the unit test of DruvorComponent. We want to 
mock it. 

It's a dependency that comes in through the constructor:

``` typescript
constructor(private dialog: MatDialog, private service: BackendService) {}
```

The service will be handled separately.

In this case, it seems we don't need to interact with the dialog, at least 
not for the tests written so far. We just has to inject an empty object as 
the MatDialog to use:

The setup becomes:

``` typescript
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvorComponent ],
      providers: [
        {provide: BackendService, useValue: backendServiceStub},
        {provide: MatDialog, useValue: {}}
      ],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvorComponent);
    druvorComponent = fixture.componentInstance;
    fixture.detectChanges();
  });
```

Without the provided MatDialog, you will get errors such as this one:

``` 
NullInjectorError: R3InjectorError(DynamicTestModule)[MatDialog -> MatDialog]: 
  NullInjectorError: No provider for MatDialog!
error properties: Object({ ngTempTokenPath: null, ngTokenPath: [ 'MatDialog', 'MatDialog' ] })
```


### Component that uses a service

To be written
