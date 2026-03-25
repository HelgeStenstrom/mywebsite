import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from "rxjs";
import {ScoresComponent} from './scores.component';
import {MemberService} from "../../../services/backend/member.service";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ScoresComponent', () => {
  let component: ScoresComponent;
  let fixture: ComponentFixture<ScoresComponent>;

  const memberServiceMock = {
    getMembers: jest.fn().mockReturnValue(of([
      { id: 1, given: 'Anna', surname: 'Andersson' },
      { id: 2, given: 'Erik', surname: 'Eriksson' },
    ]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoresComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '5' }),
            },
          },
        },
        { provide: MemberService, useValue: memberServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('sets tastingId from route parameter', () => {
    expect(component.tastingId).toBe(5);
  });

  test('loads members on init', () => {
    expect(component.members.length).toBe(2);
  });

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


  test('moveUp moves a participant up one step', () => {
    component.participants = [
      { id: 1, given: 'Anna', surname: 'Andersson' },
      { id: 2, given: 'Erik', surname: 'Eriksson' },
      { id: 3, given: 'Lisa', surname: 'Larsson' },
    ];

    component.moveUp(1);

    expect(component.participants[0].id).toBe(2);
    expect(component.participants[1].id).toBe(1);
    expect(component.participants[2].id).toBe(3);
  });

  test('moveUp does nothing when already at top', () => {
    component.participants = [
      { id: 1, given: 'Anna', surname: 'Andersson' },
      { id: 2, given: 'Erik', surname: 'Eriksson' },
    ];

    component.moveUp(0);

    expect(component.participants[0].id).toBe(1);
    expect(component.participants[1].id).toBe(2);
  });

  test('moveDown moves a participant down one step', () => {
    component.participants = [
      { id: 1, given: 'Anna', surname: 'Andersson' },
      { id: 2, given: 'Erik', surname: 'Eriksson' },
      { id: 3, given: 'Lisa', surname: 'Larsson' },
    ];

    component.moveDown(1);

    expect(component.participants[0].id).toBe(1);
    expect(component.participants[1].id).toBe(3);
    expect(component.participants[2].id).toBe(2);
  });

  test('moveDown does nothing when already at bottom', () => {
    component.participants = [
      { id: 1, given: 'Anna', surname: 'Andersson' },
      { id: 2, given: 'Erik', surname: 'Eriksson' },
    ];

    component.moveDown(1);

    expect(component.participants[0].id).toBe(1);
    expect(component.participants[1].id).toBe(2);
  });


});
