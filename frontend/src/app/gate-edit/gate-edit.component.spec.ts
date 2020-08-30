import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GateEditComponent } from './gate-edit.component';

describe('GateEditComponent', () => {
  let component: GateEditComponent;
  let fixture: ComponentFixture<GateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
