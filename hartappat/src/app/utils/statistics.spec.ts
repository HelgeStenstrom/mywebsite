import {average, standardDeviation} from './statistics';

describe('statistics', () => {

  describe('average', () => {

    test('returns null for empty array', () => {
      expect(average([])).toBeNull();
    });

    test('returns the value for a single element', () => {
      expect(average([15])).toBe(15);
    });

    test('returns the average of multiple values', () => {
      expect(average([10, 20])).toBe(15);
    });

    test('returns average with one decimal', () => {
      expect(average([10, 11])).toBeCloseTo(10.5);
    });

    test('returns average of non-uniform values', () => {
      expect(average([12, 15, 18])).toBeCloseTo(15);
    });
  });

  describe('standardDeviation', () => {

    test('returns null for empty array', () => {
      expect(standardDeviation([])).toBeNull();
    });

    test('returns 0 for single element', () => {
      expect(standardDeviation([15])).toBe(0);
    });

    test('returns 0 for identical values', () => {
      expect(standardDeviation([10, 10, 10])).toBeCloseTo(0);
    });

    test('returns correct standard deviation', () => {
      expect(standardDeviation([10, 20])).toBeCloseTo(5);
    });

    test('returns correct standard deviation for multiple values', () => {
      expect(standardDeviation([12, 15, 18])).toBeCloseTo(2.4495);
    });
    test('returns correct standard deviation for multiple values again', () => {
      expect(standardDeviation([10, 15, 20])).toBeCloseTo(4.08);
    });
  });
});
