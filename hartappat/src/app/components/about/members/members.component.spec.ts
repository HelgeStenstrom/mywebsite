import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MembersComponent} from './members.component';
import {BackendService, Member, WineView} from "../../../services/backend.service";
import {Observable, of} from "rxjs";

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  // TODO: Det här verkar mer än lovligt krångligt. Varför behövs getWines?
  const backendServiceStub: Partial<BackendService> = {
    getMembers$(): Observable<Member[]> {
      return of([]);
    },
    getWines(): Observable<WineView[]> {
      return of([]);
    }
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersComponent ],
      providers:[{provide: BackendService, useValue: backendServiceStub}]
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
