import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundEntryComponent } from './round-entry.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('RoundEntryComponent', () => {
  let component: RoundEntryComponent;
  let fixture: ComponentFixture<RoundEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundEntryComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
