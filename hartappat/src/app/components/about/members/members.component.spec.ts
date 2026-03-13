import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MembersComponent} from './members.component';
import {BackendService, Member, WineView} from "../../../services/backend/backend.service";
import {Observable, of} from "rxjs";
import {MemberService} from "../../../services/backend/member.service";

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  // TODO: Det här verkar mer än lovligt krångligt. Varför behövs getWines?
  const backendServiceStub: Partial<BackendService> = {

    getWines(): Observable<WineView[]> {
      return of([]);
    }
  };

  const memberServiceStub: Partial<MemberService> = {
    getMembers(): Observable<Member[]> {
      return of([]);
    },
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersComponent ],
      providers: [
        {provide: BackendService, useValue: backendServiceStub},
        {provide: MemberService, useValue: memberServiceStub}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
