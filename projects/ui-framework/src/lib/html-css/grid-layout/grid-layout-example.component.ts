import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-grid-layout-example',
  templateUrl: './grid-layout-example.component.html',
  styleUrls: ['./grid-layout-example.component.scss'],
})
export class GridLayoutExampleComponent {
  @Input() containerClass: string;
  @Input() itemsClasses: string[] = [
    'col-4',
    'col-4',
    'col-4',
    'col-4',
    'col-4',
    'col-4',
  ];

  wrapper = ['grid-layout-12-cols row-gap'];
  elements = [
    ['col-4'],
    ['col-4'],

    ['row-start col-4'],
    ['col-8 col-lg-4'],

    ['row-start col-sm-6 col-md-4 col-lg-2'],
    ['col-sm-6 col-md-4 col-lg-2'],
    ['col-sm-6 col-md-4 col-lg-2'],
    ['col-sm-6 col-md-4 col-lg-2'],
    ['col-sm-6 col-md-4 col-lg-2'],
    ['col-sm-6 col-md-4 col-lg-2'],

    ['col-10 col-sm-6 col-md-5 col-lg-6'],
    ['col-10 col-sm-6 col-md-5 col-lg-6 push-right'],

    ['col-sm-8 col-md-6 col-lg-3'],
    ['col-sm-4 col-md-6 col-lg-3'],
  ];

  constructor() {}
}
