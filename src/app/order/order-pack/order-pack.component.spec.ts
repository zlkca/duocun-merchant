import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPackComponent } from './order-pack.component';

describe('OrderPackComponent', () => {
  let component: OrderPackComponent;
  let fixture: ComponentFixture<OrderPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
