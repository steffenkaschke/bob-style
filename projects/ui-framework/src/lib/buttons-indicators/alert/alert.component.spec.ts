import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AlertComponent} from './alert.component';
import {AlertType} from './alert.enum';
import {AlertService} from './alert-service/alert.service';
import {MockComponent} from 'ng-mocks';
import {IconComponent} from '../../icons/icon.component';
import {ButtonsModule} from '../buttons/buttons.module';
import {TypographyModule} from '../../typography/typography.module';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ButtonsModule,
        TypographyModule,
      ],
      declarations: [
        AlertComponent,
        MockComponent(IconComponent)
      ],
      providers: [
        { provide: AlertService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    component.alertConfig = {
      alertType: AlertType.success,
      text: 'text',
      title: 'title'
    };
    fixture.detectChanges();
  });

  it('should call to close alert callback', () => {
    component.closeAlertCallback = jasmine.createSpy();
    component.closeAlert();
    expect(component.closeAlertCallback).toHaveBeenCalled();
  });
});
