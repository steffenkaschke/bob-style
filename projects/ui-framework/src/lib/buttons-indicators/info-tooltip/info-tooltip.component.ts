import { Component, Input, OnInit } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { PanelSize } from '../../overlay/panel/panel.enum';
import { TooltipPanel } from './info-tooltip.types';

@Component({
  selector: 'b-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent implements OnInit {
  @Input() tooltipPanel: TooltipPanel;
  iconColor: IconColor = IconColor.dark;
  iconSize: IconSize = IconSize.medium;
  icon: Icons = Icons.baseline_info_icon;
  panelSize = PanelSize;

  constructor() { }

  ngOnInit() {
  }

}


