import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FiledropComponent} from './filedrop.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FiledropComponent', () => {
  let component: FiledropComponent;
  let fixture: ComponentFixture<FiledropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FiledropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiledropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

