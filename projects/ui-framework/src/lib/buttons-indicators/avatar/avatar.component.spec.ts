import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { AvatarSize, BadgeSize } from './avatar.enum';
import { TypographyModule } from '../../typography/typography.module';
import { By } from '@angular/platform-browser';
import { forEach, values } from 'lodash';
import { IconsModule } from '../../icons/icons.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let avatarElement: HTMLElement;
  let titleElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [IconsModule],
      providers: [DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        component.title = 'Title';
        component.imageSource =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        fixture.detectChanges();

        avatarElement = fixture.debugElement.query(By.css('.avatar'))
          .nativeElement;
        titleElement = fixture.debugElement.query(By.css('.avatar-title'))
          .nativeElement;
        spyOn(component.clicked, 'emit');
      });
  }));

  it('should create with default values', () => {
    expect(component).toBeTruthy();
    expect(component.size).toEqual(AvatarSize.mini);
  });

  describe('onClick', () => {
    it('Should not emit the click event if the component is set to not be clickable', () => {
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('Should emit the click event if the component is set to be clickable', () => {
      component.isClickable = true;
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.clicked.emit).toHaveBeenCalledWith(e);
    });
  });

  describe('Classes', () => {
    it('Should put the right classes on .avatar element', () => {
      component.isClickable = true;
      component.size = AvatarSize.large;
      fixture.detectChanges();
      expect(avatarElement.classList.value).toEqual(
        'avatar avatar-large clickable'
      );
    });

    it('Should put the right classes on .avatar-title element', () => {
      component.size = AvatarSize.medium;
      fixture.detectChanges();
      expect(titleElement.classList.value).toEqual(
        'avatar-title avatar-title-medium'
      );
    });
  });

  describe('Title and subtitle', () => {
    it('Should put title & subtitle text', () => {
      component.subtitle = 'Subtitle';
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.title')).nativeElement;
      const subtitle = fixture.debugElement.query(By.css('.subtitle'))
        .nativeElement;
      expect(title.innerText).toContain('Title');
      expect(subtitle.innerText).toContain('Subtitle');
    });
  });

  describe('Disabled', () => {
    it('Should set avatar disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(avatarElement.classList.value).toContain('disabled');
      expect(titleElement.classList.value).toContain('disabled');
      component.onClick('clcik');
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('badge', () => {
    it('Should add badge if badge config is present', () => {
      component.size = AvatarSize.mini;
      component.badge = {
        icon: 'pending_badge',
        color: 'primary'
      };
      fixture.detectChanges();
      const badgeElement = fixture.debugElement.query(
        By.css('.avatar-badge .mat-icon.small')
      ).nativeElement;
      expect(badgeElement).toBeTruthy();
    });
  });
});
