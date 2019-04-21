import {Component, Input} from '@angular/core';
import {IconColor, Icons, IconSize} from '../../icons/icons.enum';
import {Link} from './../link/link.types';
import {StripIconType} from './info-strip.enum';
import {Dictionary} from 'lodash';
import {InfoStripIcon} from './info-strip.types';

@Component({
  selector: 'b-info-strip',
  templateUrl: './info-strip.component.html',
  styleUrls: ['./info-strip.component.scss']
})
export class InfoStripComponent {
  @Input() iconType: StripIconType = StripIconType.information;
  @Input() link: Link;
  @Input() text = '';
  readonly iconSize: IconSize = IconSize.xLarge;
  readonly iconsDic: Dictionary<InfoStripIcon> = {
    warning: { color: IconColor.primary, icon: Icons.warning },
    error: { color: IconColor.negative, icon: Icons.error },
    success: { color: IconColor.positive, icon: Icons.success },
    information: { color: IconColor.inform, icon: Icons.baseline_info_icon },
  };

  constructor() { }
}


