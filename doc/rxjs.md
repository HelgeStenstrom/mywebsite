# RxJs and Observables

## Misc notes

- An Observable is subscribed to by someone who cares.
  - if no-one cares, the observable might not do anything
- The Observable is subscribed to by an Observer
- There might be any number of Observers.
- The Observer has three methods:
  - next(r)
  - error(e)
  - complete()
- It's the Observable that makes calls into the methods of the Observer.
- What method is called depends on the circumstances
  - next(r) is called when there is an event that generates data. The data 
    might be empty (null or whatever). r represents this data.
  - error(e) is called when there is an error. e represents the error 
    information.
  - complete() is called when the Observable has reached completion. 
    - This might never happen, or it might happen after the first event, or 
      anything in between.
    - There might be some time between the last event (the last call to next
      ()), and completion (the call to complete()). This may be due to work 
      that the Observable has to do before completion, of any kind that you 
      may think of.
- Observables are similar to Promises, but a Promise has only one value, one 
  event.
  - When an Observable is converted to a Promise, using .toPromise(), the 
    Promise encapsulates the first event on the Observable event stream.
  - If the Observable just emits one event, and then completes, nothing is lost.
  - Does Promise have anything similar to Completion (complete())?
- The Observable may call next() many times, but after it has called error() 
  or complete(), it's done. It will not call next() again.
  - This looks like black magic! If I create a new Observable(), and call 
    next, next, complete, next, error, next in the constructor, in that 
    order, I don't see anything that can break the execution, unless there 
    is an exception.
  - Well, we don't do that in the constructor. The constructor takes a 
    method which can do these things, but the method is not run when the 
    constructor is run, the method is run later, probably when .subscribe() 
    executes.
  - 

## Experiments

Some experiments that might highlight how observables work

- Observable vs Promise
  - Use .toPromise() on an Observable stream that never ends (never completes), 
    and see what happens. Does the Promise resolve? When does it resolve?
  - Create an Observable stream that includes Errors, and see how they 
    behave when converted to Promises

## Testing RxJS code

It's hard to test reactive code!

A cold Observable represents a lazy function; nothing happens unless we ask 
for it. 

## Testing errors and solutions

### Problem: `NullInjectorError: No provider for MatDialogRef!`

Happens because the tested component (`AddGrapeComponent`) has a dependency to 
`MatDialogRef`. 

If we just add `MatDialogRef` to the list of `providers` in 
`configureTestingModule(...)`, 

      providers: [AnotherProvider, MatDialogRef],

we might get something like this:

`Error: NG0204: Can't resolve all parameters for MatDialogRef: (?, ?, ?).`

which is because the constructor for MatDialogRef has three arguments that 
we have not provided.

Better luck with this:

      providers: [AnotherProvider, {provide: MatDialogRef, useValue: {}}],

Now, instead I get

    NullInjectorError: No provider for InjectionToken MatMdcDialogData!

which is fixed with this:

      providers: [
        {provide: BackendService, useValue: backendServiceStub},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}],

The solution was found on StackOverflow.

### Problem: `An error was thrown in afterAll, TypeError: this.service.newEvent is not a function`

One test is causing this problem, in a file with two describe() sections, and
two tests in one of them (the problematic test and another test).

There is now `afterAll` in the test file. The error log lists the tested 
file, and a location where an observable is subscribed to.

The problem is annoying, because the browser that runs the test doesn't respond.

`this.service` is my stubbed `BackendService`, so the function needs to be added.

Fix: Add the method to the list of methods in `createSpyObj()`:

      {
        addGrape: of(void 1),
        ...,
        newEvent: undefined,
      }

## Bits and pieces (move them later)

- unsubscribe
- memory leaks
- Why doesn't https://jsfiddle.net/hstenstrom/k6pd51vy/106/ work as I want?
- hot vs cold observables
- subject
- what happens with errors and complete, through a pipeline? Guess: They go 
  straight through. 
- 
