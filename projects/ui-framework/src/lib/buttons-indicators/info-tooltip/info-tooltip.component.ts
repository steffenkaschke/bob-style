import { Component, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { PanelSize } from '../../overlay/panel/panel.enum';
import { Link } from '../link/link.types';

@Component({
  selector: 'b-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() link: Link;
  iconColor: IconColor = IconColor.dark;
  iconSize: IconSize = IconSize.large;
  icon: Icons = Icons.baseline_info_icon;
  panelSize = PanelSize;

  constructor() { }
}


