import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsRulesComponent } from './notifications-rules.component';

describe('NotificationsRulesComponent', () => {
  let component: NotificationsRulesComponent;
  let fixture: ComponentFixture<NotificationsRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
