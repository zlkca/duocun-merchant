import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementPageComponent } from './settlement-page.component';

describe('SettlementPageComponent', () => {
  let component: SettlementPageComponent;
  let fixture: ComponentFixture<SettlementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
