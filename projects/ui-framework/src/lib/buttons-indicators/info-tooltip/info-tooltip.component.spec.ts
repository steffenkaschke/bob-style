import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoTooltipComponent} from './info-tooltip.component';
import {By} from '@angular/platform-browser';
import {PanelModule} from '../../overlay/panel/panel.module';
import {IconsModule} from '../../icons/icons.module';
import {TypographyModule} from '../../typography/typography.module';
import {LinkModule} from '../link/link.module';
import {IconColor, Icons, IconSize} from '../../icons/icons.enum';
import {LinkColor, LinkTarget} from '../link/link.enum';
import {PanelSize} from '../../overlay/panel/panel.enum';

describe('InfoTooltipComponent', () => {
  let component: InfoTooltipComponent;
  let fixture: ComponentFixture<InfoTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTooltipComponent ],
      imports: [PanelModule, IconsModule, TypographyModule, LinkModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTooltipComponent);
    component = fixture.componentInstance;
    component.text = 'tooltip text';
    component.title = 'tooltip title';
    component.link = {
      text: 'click here', url: 'https://app.hibob.com', target: LinkTarget.blank, color: LinkColor.primary };
    component.iconSize = IconSize.medium;
    component.icon = Icons.baseline_info_icon;
    component.iconColor = IconColor.dark;
    fixture.detectChanges();
  });

  fit('b-panel should be in medium size & no backdrop & open on hover', () => {
    const bPanelElement = fixture.debugElement.query(By.css('b-panel'));
    expect(bPanelElement.componentInstance.size).toEqual(PanelSize.medium);
    expect(bPanelElement.componentInstance.openOnHover).toBeTruthy();
    expect(bPanelElement.componentInstance.showBackdrop).toBeFalsy();
  });

  fit('icon that trigger the panel should be baseline_info', () => {
    const bIcon = fixture.debugElement.query(By.css('b-icon'));
    expect(bIcon.componentInstance.icon).toEqual('baseline_info_icon');
  });
});
