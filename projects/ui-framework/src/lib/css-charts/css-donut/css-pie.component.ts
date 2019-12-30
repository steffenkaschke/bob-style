import {ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';

let CHART_PADDING;
let ANGLE_OFFSET = -90;
const MAX_CELL_SPACING = 10;
@Component({
  selector: 'b-css-pie',
  templateUrl: './css-pie.component.html',
  styleUrls: ['./css-pie.component.scss']
})
export class CssPieComponent implements OnChanges {
  @Input() colors = ['#6495ED', 'gray', '#cd5c5c', 'thistle', 'lightgray'];
  @Input() animate = false;
  @Input() donut = false;
  @Input() size = 160;
  @Input() border = 25;
  @Input() showText = true;
  @Input() initialValues: number[] = [];
  @Input() cellSpacing = 2;

  _border: number;
  _size: number;
  sortedValues: number[];
  chartData = [];
  sizeWithPadding: number;
  cx: number;
  cy: number;
  radius: number;
  constructor(
    private cdr: ChangeDetectorRef
  ) { }


  ngOnChanges() {
    this.cellSpacing = Math.max(Math.min(this.cellSpacing, MAX_CELL_SPACING), 0);
    this._border = Math.abs(this.donut ? this.border : this.size);
    this._size = this.size - (this._border / 2) + (this.border / 2);
    this._border = Math.abs(this.donut ? this.border : this._size);
    CHART_PADDING = this._border;
    this.sizeWithPadding = this._size + CHART_PADDING;
    this.cx = (this._size + CHART_PADDING) / 2;
    this.cy = (this._size + CHART_PADDING) / 2;
    this.radius = this._size / 2;

    this.sortInitialValues();
    this.calculateChartData();
    this.cdr.detectChanges();
  }


  circumference() {
    return 2 * Math.PI * this.radius;
  }

  adjustedCircumference() {
    return this.circumference() - this.cellSpacing;
  }

  dataTotal() {
    return this.sortedValues.reduce((acc, val) => acc + val);
  }
  calculateChartData() {
    this.chartData = [];
    this.sortedValues.slice().forEach((dataVal) => {
      const { x, y } = this.calculateTextCoords(dataVal, ANGLE_OFFSET);

      const data = {
        degrees: ANGLE_OFFSET,
        textX: x,
        textY: y
      };
      this.chartData.push(data);
      ANGLE_OFFSET = this.dataPercentage(dataVal) * 360 + ANGLE_OFFSET;
    });
  }
  sortInitialValues() {
    this.sortedValues = this.initialValues.slice();
  }
  calculateStrokeDashOffset(dataVal, circumference) {
    const strokeDiff = this.dataPercentage(dataVal) * circumference;
    return circumference - strokeDiff;
  }
  calculateTextCoords(dataVal, angleOffset) {

    const angle = (this.dataPercentage(dataVal) * 360) / 2 + angleOffset;
    const radians = this.degreesToRadians(angle - (this.cellSpacing / 4));

    const textCoords = {
      x: this.radius * Math.cos(radians) + this.cx,
      y: this.radius * Math.sin(radians) + this.cy
    };
    return textCoords;
  }
  degreesToRadians(angle) {
    return angle * (Math.PI / 180);
  }
  dataPercentage(dataVal) {
    return dataVal / this.dataTotal();
  }
  percentageString(dataVal) {
    return `${Math.round(this.dataPercentage(dataVal) * 100)}%`;
  }
  returnCircleTransformValue(index) {
    return `rotate(${this.chartData[index].degrees}deg)`;
  }
  returnCircleTransformOriginValue(index) {
    return `${this.cx}px ${this.cy}px`;
  }
  segmentBigEnough(dataVal) {
    return this._size >= 70 && this._border >= 25 && Math.round(this.dataPercentage(dataVal) * 100) > 5;
  }
  trackByIndex(idx) {
    return idx;
  }

}
