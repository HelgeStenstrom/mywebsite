import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MembersComponent} from './members.component';
import {Member} from "../../../services/backend/backend.service";
import {Observable, of} from "rxjs";
import {MemberService} from "../../../services/backend/member.service";

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  const memberServiceStub: Partial<MemberService> = {
    getMembers(): Observable<Member[]> {
      return of([]);
    },
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersComponent ],
      providers: [
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
