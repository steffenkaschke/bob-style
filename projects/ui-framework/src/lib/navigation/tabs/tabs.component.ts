import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit, ViewChildren, QueryList, ElementRef
} from '@angular/core';
import { Tab } from './tabs.interface';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TabsType } from './tabs.enum';

@Component({
  selector: 'b-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterViewInit {
  @ViewChild('tabgroup', { static: true }) tabGroup: MatTabGroup;
  @ViewChildren('matTabs') matTabs: QueryList<MatTab>;
  @ViewChildren('matLabels') matLabels: QueryList<ElementRef>;

  @Input() public type: TabsType = TabsType.primary;
  @Input() public tabs: Tab[] = [];
  @Input() public selectedIndex = 0;

  @Output() selectChange: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();
  @Output() selectClick: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();

  constructor() {
  }

  ngAfterViewInit() {
    this.matLabels.toArray().forEach(label => {
      const element = label.nativeElement;
      element.style.width = element.clientWidth + 10 + 'px';
    });
  }

  tabClick(tab: Tab, i: number): void {
    const matTabChangeEvent: MatTabChangeEvent = {
      index: i,
      tab: this.matTabs.toArray()[i],
    };
    this.selectClick.emit(matTabChangeEvent);
  }

  onSelectChange($event: MatTabChangeEvent): void {
    this.selectChange.emit($event);
  }
}
