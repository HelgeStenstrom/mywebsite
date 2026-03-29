import {TestBed} from '@angular/core/testing';
import {ScoresConfigService} from './scores-config.service';
import {ScoresConfig} from '../models/score.model';

describe('ScoresConfigService', () => {

  let service: ScoresConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoresConfigService],
    });
    service = TestBed.inject(ScoresConfigService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('loadConfig returns null when nothing is saved', () => {
    expect(service.loadConfig(5)).toBeNull();
  });

  test('saveConfig and loadConfig round-trips the config', () => {
    const config: ScoresConfig = {
      numberOfPositions: 6,
      participantIds: [1, 3, 2],
      revealed: true,
    };

    service.saveConfig(5, config);

    expect(service.loadConfig(5)).toEqual(config);
  });

  test('configs for different tastings are independent', () => {
    const config1: ScoresConfig = {numberOfPositions: 6, participantIds: [1, 2],
      revealed: true,};
    const config2: ScoresConfig = {numberOfPositions: 4, participantIds: [3, 4],
      revealed: true,};

    service.saveConfig(1, config1);
    service.saveConfig(2, config2);

    expect(service.loadConfig(1)).toEqual(config1);
    expect(service.loadConfig(2)).toEqual(config2);
  });

  test('saving overwrites previous config for same tasting', () => {
    const config1: ScoresConfig = {numberOfPositions: 6, participantIds: [1, 2],
      revealed: true,};
    const config2: ScoresConfig = {numberOfPositions: 4, participantIds: [3],
      revealed: true,};

    service.saveConfig(5, config1);
    service.saveConfig(5, config2);

    expect(service.loadConfig(5)).toEqual(config2);
  });
});
