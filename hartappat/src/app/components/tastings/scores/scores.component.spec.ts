import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from "rxjs";
import {ScoresComponent} from './scores.component';
import {MemberService} from "../../../services/backend/member.service";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {ScoresConfigService} from "../../../services/scores-config.service";
import {ScoreService} from "../../../services/backend/score.service";
import {TastingService} from "../../../services/backend/tasting.service";
import {ScoreDto} from "../../../models/score.model";
import {WineService} from "../../../services/backend/wine.service";

describe('ScoresComponent', () => {
  let component: ScoresComponent;
  let fixture: ComponentFixture<ScoresComponent>;

  const memberServiceMock = {
    getMembers: jest.fn().mockReturnValue(of([
      {id: 1, given: 'Anna', surname: 'Andersson'},
      {id: 2, given: 'Erik', surname: 'Eriksson'},
    ]))
  };

  const scoresConfigServiceMock = {
    saveConfig: jest.fn(),
    loadConfig: jest.fn().mockReturnValue(null),
  };

  const scoreServiceMock = {
    postScore: jest.fn().mockReturnValue(of({})),
    putScores: jest.fn().mockReturnValue(of([])),
    getScores: jest.fn().mockReturnValue(of([])),
  };

  const tastingServiceMock = {
    getTasting: jest.fn().mockReturnValue(of({
      id: 5,
      title: 'Testprovning',
      notes: '',
      tastingDate: '2024-01-15',
      hosts: [],
      wines: []
    })),
  };

  beforeEach(async () => {
    scoreServiceMock.postScore.mockClear();
    scoreServiceMock.putScores.mockClear();
    scoreServiceMock.getScores.mockClear();
    scoreServiceMock.getScores.mockReturnValue(of([]));
    const wineServiceMock = {
      getWine: jest.fn().mockReturnValue(of({
        id: 10,
        name: 'Château Margaux',
        country: {id: 1, name: 'Frankrike'},
        wineType: {id: 1, name: 'Rött'},
        isNonVintage: false,
        isUsed: false,
      })),
    };

    await TestBed.configureTestingModule({
      imports: [ScoresComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({id: '5'}),
            },
          },
        },
        {provide: MemberService, useValue: memberServiceMock},
        {provide: ScoresConfigService, useValue: scoresConfigServiceMock},
        {provide: ScoreService, useValue: scoreServiceMock},
        {provide: TastingService, useValue: tastingServiceMock},
        { provide: WineService, useValue: wineServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScoresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('sets tastingId from route parameter', () => {
    expect(component.tastingId).toBe(5);
  });

  test('loads members on init', () => {
    expect(component.members.length).toBe(2);
  });

  describe('Toggling members', () => {
    test('member is not selected by default', () => {
      expect(component.isSelected(1)).toBe(false);
    });

    test('toggleMember selects a member', () => {
      component.toggleMember(1);
      expect(component.isSelected(1)).toBe(true);
    });

    test('toggleMember deselects a selected member', () => {
      component.toggleMember(1);
      component.toggleMember(1);
      expect(component.isSelected(1)).toBe(false);
    });

    test('toggling one member does not affect another', () => {
      component.toggleMember(1);
      expect(component.isSelected(2)).toBe(false);
    });
  })


  describe('ScoreConfig', () => {

    beforeEach(async () => {
      scoresConfigServiceMock.saveConfig.mockClear();
      scoresConfigServiceMock.loadConfig.mockClear();
      scoresConfigServiceMock.loadConfig.mockReturnValue(null);

      fixture = TestBed.createComponent(ScoresComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
      fixture.detectChanges();
    });

    test('loads config on init when config exists', async () => {
      scoresConfigServiceMock.loadConfig.mockReturnValue({
        numberOfPositions: 4,
        participantIds: [2, 1],
      });

      const localFixture = TestBed.createComponent(ScoresComponent);
      const localComponent = localFixture.componentInstance;
      await localFixture.whenStable();
      localFixture.detectChanges();

      expect(localComponent.numberOfPositions).toBe(4);
      expect(localComponent.participants.map(m => m.id)).toEqual([2, 1]);
    });

    test('saves config when numberOfPositions changes', () => {
      component.numberOfPositions = 8;
      component.onConfigChanged();

      expect(scoresConfigServiceMock.saveConfig).toHaveBeenCalledWith(5, {
        numberOfPositions: 8,
        participantIds: [],
        revealed: false,
      });
    });

    test('saves config when participants change', () => {
      component.toggleMember(1);
      component.onConfigChanged();

      expect(scoresConfigServiceMock.saveConfig).toHaveBeenCalledWith(5, {
        numberOfPositions: 6,
        participantIds: [1],
        revealed: false,
      });
    });
  })

  describe('Posting and recalling', () => {

    test('saveScores posts a score for each filled cell', () => {
      component.participants = [
        {id: 1, given: 'Anna', surname: 'Andersson'},
        {id: 2, given: 'Erik', surname: 'Eriksson'},
      ];
      component.numberOfPositions = 2;
      component.scores = {
        1: {1: 15, 2: 12},
        2: {1: 18, 2: null},
      };

      component.saveScores();

      expect(scoreServiceMock.putScores).toHaveBeenCalledTimes(1);
      expect(scoreServiceMock.putScores).toHaveBeenCalledWith(5, [
        {"memberId": 1, "position": 1, "score": 15},
        {"memberId": 1, "position": 2, "score": 12},
        {"memberId": 2, "position": 1, "score": 18}]);
    });

    test('saveScores puts all filled scores', () => {
      component.participants = [
        {id: 1, given: 'Anna', surname: 'Andersson'},
        {id: 2, given: 'Erik', surname: 'Eriksson'},
      ];
      component.numberOfPositions = 2;
      component.scores = {
        1: {1: 15, 2: 12},
        2: {1: 18, 2: null},
      };

      component.saveScores();

      expect(scoreServiceMock.putScores).toHaveBeenCalledWith(5, [
        {memberId: 1, position: 1, score: 15},
        {memberId: 1, position: 2, score: 12},
        {memberId: 2, position: 1, score: 18},
      ]);
    });

    test('loads existing scores on init', async () => {
      const existingScores: ScoreDto[] = [
        {id: 1, tastingId: 5, memberId: 1, position: 1, score: 15},
        {id: 2, tastingId: 5, memberId: 1, position: 2, score: 12},
      ];
      scoreServiceMock.getScores.mockReturnValue(of(existingScores));

      const localFixture = TestBed.createComponent(ScoresComponent);
      const localComponent = localFixture.componentInstance;
      await localFixture.whenStable();
      localFixture.detectChanges();

      expect(localComponent.getScore(1, 1)).toBe(15);
      expect(localComponent.getScore(1, 2)).toBe(12);
    });

    test('hasSaved is true on init when scores exist', async () => {
      const existingScores: ScoreDto[] = [
        {id: 1, tastingId: 5, memberId: 1, position: 1, score: 15},
      ];
      scoreServiceMock.getScores.mockReturnValue(of(existingScores));

      const localFixture = TestBed.createComponent(ScoresComponent);
      const localComponent = localFixture.componentInstance;
      await localFixture.whenStable();
      localFixture.detectChanges();

      expect(localComponent.hasSaved).toBe(true);
    });

    test('hasSaved is false on init when no scores exist', () => {
      expect(component.hasSaved).toBe(false);
    });

    test('hasSaved is true after saving', () => {
      component.saveScores();
      expect(component.hasSaved).toBe(true);
    });

  });

  describe('Statistics for positions and members', () => {

    beforeEach(() => {
      component.participants = [
        {id: 1, given: 'Anna', surname: 'Andersson'},
        {id: 2, given: 'Erik', surname: 'Eriksson'},
        {id: 3, given: 'Lisa', surname: 'Larsson'},
      ];
      component.numberOfPositions = 2;
      component.scores = {
        1: {1: 10, 2: 20},
        2: {1: 20, 2: 10},
        3: {1: 15, 2: 15},
      };
    });

    describe('Average', () => {
      test('averageForPosition returns average of all participants for a position', () => {
        expect(component.averageForPosition(1)).toBeCloseTo(15);
        expect(component.averageForPosition(2)).toBeCloseTo(15);
      });

      test('averageForPosition ignores null values', () => {
        component.scores[3][1] = null;
        expect(component.averageForPosition(1)).toBeCloseTo(15);
      });

      test('averageForPosition returns null when no scores exist for position', () => {
        component.scores = {};
        expect(component.averageForPosition(1)).toBeNull();
      });

      test('averageForMember returns average of all positions for a member', () => {
        expect(component.averageForMember(1)).toBeCloseTo(15);
        expect(component.averageForMember(2)).toBeCloseTo(15);
      });

      test('averageForMember ignores null values', () => {
        component.scores[1][2] = null;
        expect(component.averageForMember(1)).toBeCloseTo(10);
      });

      test('averageForMember returns null when no scores exist for member', () => {
        component.scores = {};
        expect(component.averageForMember(1)).toBeNull();
      });
    });

    describe('Standard deviation', () => {
      test('averageForPosition returns average of all participants for a position', () => {
        expect(component.standardDeviationForPosition(1)).toBeCloseTo(4.08);
        expect(component.standardDeviationForPosition(2)).toBeCloseTo(4.08);
      });

      test('averageForPosition ignores null values', () => {
        component.scores[3][1] = null;
        expect(component.standardDeviationForPosition(1)).toBeCloseTo(5);
      });

      test('averageForPosition returns null when no scores exist for position', () => {
        component.scores = {};
        expect(component.standardDeviationForPosition(1)).toBeNull();
      });

      test('averageForMember returns average of all positions for a member', () => {
        expect(component.standardDeviationForMember(1)).toBeCloseTo(5);
        expect(component.standardDeviationForMember(2)).toBeCloseTo(5);
      });

      test('averageForMember ignores null values', () => {
        component.scores[1][2] = null;
        expect(component.standardDeviationForMember(1)).toBeCloseTo(0);
      });

      test('averageForMember returns null when no scores exist for member', () => {
        component.scores = {};
        expect(component.standardDeviationForMember(1)).toBeNull();
      });
    });


  });

  describe('Warning for number of wines', () => {
    test('shows warning when number of wines with position differs from number of score positions', () => {
      tastingServiceMock.getTasting.mockReturnValue(of({
        id: 5, title: 'Testprovning', notes: '', tastingDate: '2024-01-15', hosts: [],
        wines: [
          {id: 1, wineId: 10, position: 1},
          {id: 2, wineId: 11, position: 2},
          {id: 3, wineId: 12, position: 3},
        ]
      }));
      component.numberOfPositions = 2;
      component.ngOnInit();
      fixture.detectChanges();

      const warning = fixture.nativeElement.querySelector('[data-test="wine-count-warning"]');
      expect(warning).toBeTruthy();
    });

    test('does not show warning when number of wines with position matches number of score positions', () => {
      tastingServiceMock.getTasting.mockReturnValue(of({
        id: 5, title: 'Testprovning', notes: '', tastingDate: '2024-01-15', hosts: [],
        wines: [
          {id: 1, wineId: 10, position: 1},
          {id: 2, wineId: 11, position: 2},
        ]
      }));
      component.numberOfPositions = 2;
      component.ngOnInit();
      fixture.detectChanges();

      const warning = fixture.nativeElement.querySelector('[data-test="wine-count-warning"]');
      expect(warning).toBeFalsy();
    });


  })

  describe('Reveal wines', ()=> {

    test('revealed is false by default when no config exists', () => {
      expect(component.revealed).toBe(false);
    });

    test('revealed is loaded from config', () => {
      scoresConfigServiceMock.loadConfig.mockReturnValue({
        numberOfPositions: 2,
        participantIds: [1, 2],
        revealed: true,
      });
      component.ngOnInit();

      expect(component.revealed).toBe(true);
    });

    test('toggleRevealed saves revealed state to config', () => {
      component.revealed = false;
      component.numberOfPositions = 2;
      component.participants = [];

      component.toggleRevealed();

      expect(scoresConfigServiceMock.saveConfig).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({ revealed: true })
      );
    });

    test('wineAtPosition returns wine info for given position', () => {
      tastingServiceMock.getTasting.mockReturnValue(of({
        id: 5, title: 'Testprovning', notes: '', tastingDate: '2024-01-15', hosts: [],
        wines: [
          { id: 1, wineId: 10, position: 1 },
          { id: 2, wineId: 11, position: 2 },
        ]
      }));
      component.ngOnInit();
      fixture.detectChanges();

      const wine = component.wineAtPosition(1);
      expect(wine?.name).toBe('Château Margaux');
    });

  })

});
