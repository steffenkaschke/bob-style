import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { By } from '@angular/platform-browser';
import { IconsModule } from '../../icons/icons.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChipType } from '../../chips/chips.enum';
import { ChipModule } from '../../chips/chip/chip.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { BadgeSize, AvatarBadges } from './avatar.consts';
import { simpleChange } from '../../services/utils/test-helpers';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let avatarElement: HTMLElement;
  let titleElement: HTMLElement;
  let componentElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [IconsModule, ChipModule, TruncateTooltipModule],
      providers: [DOMhelpers]
    })
      .overrideComponent(AvatarComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;
        component.title = 'Title';
        component.imageSource =
          // tslint:disable-next-line: max-line-length
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        component.backgroundColor = 'rgb(255, 255, 255)';

        fixture.detectChanges();
        avatarElement = fixture.debugElement.query(By.css('.avatar'))
          .nativeElement;
        titleElement = fixture.debugElement.query(By.css('.title'))
          .nativeElement;
        spyOn(component.clicked, 'emit');
      });
  }));

  it('should create avatar with default values', () => {
    expect(component).toBeTruthy();
    expect(component.size).toEqual(AvatarSize.mini);
  });

  describe('Avatar image', () => {
    it('Should put the image as background on .avatar element', () => {
      expect(avatarElement.style.backgroundImage).toContain(
        'iVBORw0KGgoAAAANSUhEUgAAA'
      );
    });
  });
  describe('Avatar background color', () => {
    it('Should put the background color on .avatar element', () => {
      expect(avatarElement.style.backgroundColor).toContain(
        'rgb(255, 255, 255)'
      );
    });
  });

  describe('onClick', () => {
    it('Should not emit the click event if the component is set to not be clickable', () => {
      component.onClick('click' as any);
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('Should emit the click event if the component is set to be clickable', () => {
      component.isClickable = true;
      component.clicked.subscribe(() => {});
      component.onClick('click' as any);
      expect(component.clicked.emit).toHaveBeenCalledWith('click');
    });
  });

  describe('Attributes', () => {
    it('Should put the right attributes on component host element', () => {
      component.isClickable = true;
      component.size = AvatarSize.large;
      fixture.detectChanges();
      expect(componentElem.dataset.size).toEqual('large');
      expect(componentElem.dataset.orientation).toEqual('horizontal');
      expect(componentElem.dataset.clickable).toEqual('true');
    });
  });

  describe('Avatar size', () => {
    it('Should set the right size of the avatar with css variable', () => {
      component.ngOnChanges(
        simpleChange({
          size: AvatarSize.large
        })
      );
      fixture.detectChanges();
      expect(getComputedStyle(avatarElement).width).toEqual(
        AvatarSize.large + 'px'
      );
    });
  });

  describe('Text', () => {
    it('Should put title & subtitle text', () => {
      component.subtitle = 'Subtitle';
      component.size = AvatarSize.medium;
      fixture.detectChanges();

      const subtitle = fixture.debugElement.query(By.css('.slot2-medium'))
        .nativeElement;
      expect(titleElement.innerText).toContain('Title');
      expect(subtitle.innerText).toContain('Subtitle');
    });
    it('Should put caption text on large avatar', () => {
      component.caption = 'department';
      component.size = AvatarSize.large;
      fixture.detectChanges();
      const department = fixture.debugElement.query(By.css('.slot3-small'));
      expect(department).toBeTruthy();
      expect(department.nativeElement.innerText).toEqual('department');
    });
    it('Should not put caption text on avatar, if size is not large', () => {
      component.caption = 'department';
      component.size = AvatarSize.medium;
      fixture.detectChanges();
      const department = fixture.debugElement.query(By.css('.slot3-small'));
      expect(department).toBeFalsy();
    });
  });

  describe('Disabled', () => {
    it('Should set disabled attribute', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(componentElem.dataset.disabled).toEqual('true');
      component.onClick('click' as any);
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('Should add badge icon', () => {
      component.size = AvatarSize.small;
      component.badge = AvatarBadge.pending;
      fixture.detectChanges();
      const badgeElement = fixture.debugElement.query(By.css('.avatar-badge'));
      expect(badgeElement).toBeTruthy();
    });
    it('Should also accept BadgeConfig-format input', () => {
      component.size = AvatarSize.medium;
      component.badge = AvatarBadge.pending;

      fixture.detectChanges();
      const badgeElement = fixture.debugElement.query(
        By.css('.avatar-badge .b-icon.b-icon-' + BadgeSize[AvatarSize.medium])
      );
      expect(badgeElement).toBeTruthy();
    });
  });

  describe('Status', () => {
    it('Should add status chip', () => {
      component.size = AvatarSize.large;
      component.chip = {
        type: ChipType.success,
        text: 'status'
      };
      fixture.detectChanges();
      const statusElement = fixture.debugElement.query(
        By.css('[data-type="success"]')
      );
      expect(statusElement).toBeTruthy();
      expect(statusElement.nativeElement.innerText).toEqual('status');
    });
    it('Should not add status chip to small avatar', () => {
      component.size = AvatarSize.small;
      component.chip = {
        type: ChipType.success,
        text: 'status'
      };
      fixture.detectChanges();
      const statusElement = fixture.debugElement.query(
        By.css('[data-type="success"]')
      );
      expect(statusElement).toBeFalsy();
    });
  });

  describe('Orientation', () => {
    it('Should have vertical orientation', () => {
      component.orientation = AvatarOrientation.vertical;
      fixture.detectChanges();
      expect(componentElem.dataset.orientation).toEqual('vertical');
      expect(getComputedStyle(componentElem).flexDirection).toEqual('column');
    });
  });
});