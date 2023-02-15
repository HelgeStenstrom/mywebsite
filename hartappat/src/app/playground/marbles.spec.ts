import {TestScheduler} from "rxjs/testing";
import {map, share, take} from "rxjs/operators";

describe('First a pipe-cleaner!', () => {

  it('is iexpected to pass', () => {
    expect(1 + 2).toBe(3);
  });
});

describe('Marble test with RxJs testing utils', () => {

  let scheduler: TestScheduler;

  beforeEach(() => {
    //scheduler = new TestScheduler((actual, expected) => expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected)));
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should assert two variables with the RxJs testing utilsk', () => {
    scheduler.run(({cold, expectObservable}) => {
      const sourceValues = {a: 1, b: 2, c: 3};
      const source$ = cold('a-b--c--|', sourceValues);

      const expectedValues = {a: 10, b: 20, c: 30};
      const expected$ = cold('a-b--c--|', expectedValues);

      const result$ = source$.pipe(map(v => v * 10));
      expectObservable(result$).toEqual(expected$);

    });
  });


  xit('should show how take works', () => {

    scheduler.run(({cold, expectObservable}) => {

      const sourceValues = {a: 1, b: 7, c: 3, d: 4};
      const source$ = cold('a-b--c--d-|', sourceValues);

      let expectedValues = {a: 1, b: 7};
      expectedValues = sourceValues;
      const expected$ = cold('a-b--c--d|', expectedValues);

      const result$ = source$.pipe(take(4));
      expectObservable(result$).toEqual(expected$)

    });

  });

  xit('test', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source$ = cold('-a-b-c|');
      const expected = '-a-b-c|';

      expectObservable(source$.pipe(take(3))).toBe(expected);
    });
  });

});
