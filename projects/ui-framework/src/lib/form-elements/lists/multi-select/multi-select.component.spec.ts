import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { InputModule } from '../../input/input.module';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconService } from '../../../icons/icon.service';
import { MultiSelectComponent } from './multi-select.component';
import { MultiListModule } from '../multi-list/multi-list.module';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { SelectGroupOption } from '../list.interface';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep } from 'lodash';
import { ListChange } from '../list-change/list-change';

describe('MultiSelectComponent', () => {
  let component;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<MultiSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false },
        ]
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11, selected: true },
          { value: 'Personal 2', id: 12, selected: false },
        ]
      }
    ];

    TestBed.configureTestingModule({
      declarations: [
        MultiSelectComponent,
      ],
      providers: [
        PanelPositionService,
        { provide: IconService, useValue: spyIconService },
        ListModelService,
      ],
      imports: [
        MultiListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        ButtonsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        spyOn(component.selectChange, 'emit');
        spyOn(component.selectModified, 'emit');
        spyOn(component, 'propagateChange');
        fixture.autoDetectChanges();
      });

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }));

  describe('OnInit', () => {
    it('should set selectedValuesMap', () => {
      expect(component.selectedValuesMap).toEqual([1, 11]);
    });
    it('should set trigger value', () => {
      expect(component.triggerValue).toEqual('Basic Info 1, Personal 1');
    });
  });

  describe('OnChanges', () => {
    beforeEach(() => {
      const newOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      newOptionsMock[0].options[0].selected = false;
      newOptionsMock[1].options[0].selected = false;
      newOptionsMock[1].options[1].selected = true;
      component.ngOnChanges({
        options: {
          previousValue: undefined,
          currentValue: newOptionsMock,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
    });
    it('should update selectedValuesMap', () => {
      expect(component.selectedValuesMap).toEqual([12]);
    });
    it('should update trigger value when options update', () => {
      expect(component.triggerValue).toEqual('Personal 2');
    });
  });

  describe('onSelect', () => {
    it('should update selectedValuesMap and triggerValue', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      expect(component.selectedValuesMap).toEqual([1, 11, 12]);
      expect(component.triggerValue).toEqual('Basic Info 1, Personal 1, Personal 2');
      flush();
    }));
    it('should emit onSelectModified with listChange', fakeAsync(() => {
      const expectedOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      expectedOptionsMock[1].options[1].selected = true;
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      const expectedListChange = new ListChange(expectedOptionsMock);
      expect(component.selectModified.emit).toHaveBeenCalledWith(expectedListChange);
      flush();
    }));
  });

  describe('notifySelectionIds', () => {
    it('should emit onSelect with selected value', fakeAsync(() => {
      const expectedListChange = new ListChange(optionsMock);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelector('.apply-button') as HTMLElement).click();
      expect(component.selectChange.emit).toHaveBeenCalledWith(expectedListChange);
      expect(component.propagateChange).toHaveBeenCalledWith(expectedListChange);
      flush();
    }));
  });

  describe('cancelSelection', () => {
    it('should close the panel', fakeAsync(() => {
      spyOn(component, 'destroyPanel');
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelector('.cancel-button') as HTMLElement).click();
      expect(component.destroyPanel).toHaveBeenCalled();
      flush();
    }));
  });

  describe('clearSelection', () => {
    let expectedOptionsMock: SelectGroupOption[];
    beforeEach(() => {
      expectedOptionsMock = cloneDeep(optionsMock);
      expectedOptionsMock[0].options[0].selected = false;
      expectedOptionsMock[1].options[0].selected = false;
    });
    it('should clear the selection from options, selectedValuesMap and empty triggerValue', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
      clearSelection.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.selectedValuesMap).toEqual([]);
      expect(component.triggerValue).toEqual('');
      expect(component.options).toEqual(expectedOptionsMock);
      flush();
    }));
    it('should invoke selectChange.emit and propagateChange with []', fakeAsync(() => {
      const expectedListChange = new ListChange(expectedOptionsMock);
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
      clearSelection.triggerEventHandler('click', null);
      fixture.autoDetectChanges();
      expect(component.selectChange.emit).toHaveBeenCalledWith(expectedListChange);
      expect(component.propagateChange).toHaveBeenCalledWith(expectedListChange);
      flush();
    }));
  });

  describe('OnDestroy', () => {
    it('should invoke panel close', () => {
      spyOn(component, 'destroyPanel');
      component.ngOnDestroy();
      expect(component.destroyPanel).toHaveBeenCalled();
    });
  });

  describe('tooltip', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(MultiSelectComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style.width = '200px';
      spyOn(component.selectChange, 'emit');
    }));
    it('should not show tooltip', () => {
      optionsMock[0].options[0].selected = false;
      component.options = optionsMock;
      fixture.autoDetectChanges();
      const tooltipEl = fixture.debugElement.query(By.css('.trigger-tooltip'));
      expect(tooltipEl).toBe(null);
    });
    it('should add tooltip', fakeAsync(() => {
      component.options = optionsMock;
      fixture.autoDetectChanges();
      component.openPanel();
      fixture.autoDetectChanges();
      tick(0);
      (overlayContainerElement.querySelectorAll('b-multi-list .option')[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      tick(0);
      const tooltipEl = fixture.debugElement.query(By.css('b-input'));

      expect(tooltipEl).not.toBe(null);
      expect(tooltipEl.properties.matTooltip).toEqual('Basic Info 1, Personal 1, Personal 2');
      expect(tooltipEl.nativeElement.innerText).toContain('(3)');
      flush();
    }));
  });
});
