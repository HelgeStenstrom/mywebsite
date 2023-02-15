import {TestScheduler} from "rxjs/testing";
import {map} from "rxjs/operators";

describe('First a pipe-cleaner!', () => {

  it('is iexpected to pass', () => {
    expect(1 + 2).toBe(3);
  });
});

describe('Marble test with RxJs testing utils', () => {

  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should assert two variables with the RxJs testing utils', () => {
    scheduler.run(({cold, expectObservable}) => {
      const sourceValues = {a: 1, b: 2, c: 3};
      const source$ = cold('a-b--c--|', sourceValues);

      const expectedValues = {a: 10, b: 20, c: 30};
      const expected$ = cold('a-b--c--|', expectedValues);

      const result$ = source$.pipe(map(v => v * 10));
      expectObservable(result$).toEqual(expected$);

    });
  });
});
