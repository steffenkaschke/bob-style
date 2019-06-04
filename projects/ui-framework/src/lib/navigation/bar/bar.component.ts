import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent {
  @Input() label: string;
}
