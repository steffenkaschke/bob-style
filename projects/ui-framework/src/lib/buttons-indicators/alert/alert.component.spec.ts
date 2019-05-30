import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AlertComponent} from './alert.component';
import {MockComponent} from 'ng-mocks';
import {IconComponent} from '../../icons/icon.component';
import {Overlay, OverlayModule} from '@angular/cdk/overlay';
import {AlertConfig} from './alert.interface';
import {AlertType} from './alert.enum';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {ALERT_CONFIG_MOCK, OVERLAY_CONFIG_MOCK} from './alert.mock';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let overlay: SpyObj<Overlay>;

  beforeEach(async(() => {
    const overlayRefMock = {
      attach: jasmine.createSpy(),
      dispose: jasmine.createSpy(),
    };

    overlay = createSpyObj('overlay', ['create', 'position']);
    overlay.create.and.returnValue(overlayRefMock);
    overlay.position.and.returnValue({ global: () => ({ centerHorizontally: () => ({ top: () => 'strategy' })}) });

    TestBed.configureTestingModule({
      imports: [OverlayModule],
      declarations: [
        MockComponent(IconComponent),
        AlertComponent,
      ],
      providers: [
        { provide: Overlay, useValue: overlay },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the alert by configuration', () => {
    const alertConfig: AlertConfig = {
      alertType: AlertType.success,
      text: 'text',
      title: 'title'
    };
    component.showAlert(alertConfig);
    expect(component.alertConfig).toEqual(ALERT_CONFIG_MOCK);
    expect(overlay.create).toHaveBeenCalledWith(OVERLAY_CONFIG_MOCK);
    expect(component.overlayRef.attach).toHaveBeenCalled();
  });

  it('should close the alert after x duration', fakeAsync(() => {
    const ALERT_DURATION_TICK = 3001;
    const alertConfig: AlertConfig = {
      alertType: AlertType.success,
      text: 'text',
      title: 'title'
    };
    component.showAlert(alertConfig);
    tick(ALERT_DURATION_TICK);
    expect(component.overlayRef.dispose).toHaveBeenCalled();
  }));
});
