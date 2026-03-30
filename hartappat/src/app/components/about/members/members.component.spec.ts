import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MembersComponent} from './members.component';
import {Observable, of} from "rxjs";
import {MemberService} from "../../../services/backend/member.service";
import {Member} from "../../../models/common.model";

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
      imports: [ MembersComponent ],
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
