import {
  Component, Input, OnInit, TemplateRef,
} from '@angular/core';

@Component({
  selector: 'b-section-container',
  templateUrl: './sectionContainer.component.html',
  styleUrls: ['sectionContainer.component.scss'],
  providers: [
  ]
})
export class SectionContainerComponent {
  @Input() title: string;
  constructor() {

  }
}
