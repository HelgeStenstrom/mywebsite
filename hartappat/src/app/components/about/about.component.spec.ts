import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';
import {MembersComponent} from "./members/members.component";
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent, MembersComponent],
      providers: [HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
