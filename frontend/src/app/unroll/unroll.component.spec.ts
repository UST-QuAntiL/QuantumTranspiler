import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnrollComponent } from './unroll.component';

describe('UnrollComponent', () => {
  let component: UnrollComponent;
  let fixture: ComponentFixture<UnrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
