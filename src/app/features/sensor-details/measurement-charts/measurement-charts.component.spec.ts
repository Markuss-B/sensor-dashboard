import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementChartsComponent } from './measurement-charts.component';

describe('MeasurementChartsComponent', () => {
  let component: MeasurementChartsComponent;
  let fixture: ComponentFixture<MeasurementChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasurementChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
