import { Component, Input } from '@angular/core';
import { Link } from '../link/link.types';
import { LinkColor } from './link.enum';

@Component({
  selector: 'b-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  @Input() config: Link;
  @Input() openInNewWindow: boolean;
  @Input() color: LinkColor = LinkColor.none;

  constructor() { }
}
