import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChainSelectComponent } from './chain-select.component';
import { IconsModule } from '../../../icons/icons.module';
import { ComponentRendererModule } from '../../../services/component-renderer/component-renderer.module';
import { By } from '@angular/platform-browser';

describe('EmployeeChainSelectComponent', () => {
  let component: ChainSelectComponent;
  let fixture: ComponentFixture<ChainSelectComponent>;
  let TestComponent;
  let emptyChainLink;

  beforeEach(async(() => {
    @Component({
      selector: 'b-test-select',
      template: '<select (click)="change($event)"></select>',
    })
    class TestSelectComponent {
      @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

      public change($event) {
        this.selectChange.emit($event);
      }
    }

    TestComponent = TestSelectComponent;

    @NgModule({
      imports: [CommonModule],
      exports: [TestSelectComponent],
      declarations: [TestSelectComponent],
      entryComponents: [TestSelectComponent],
    })
    class TestSelectModule { }

    emptyChainLink = {
      active: false,
      selectComponentConfig: {
        component: TestComponent,
        handlers: {
          'selectChange': jasmine.any(Function)
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        ChainSelectComponent
      ],
      imports: [
        CommonModule,
        IconsModule,
        ComponentRendererModule,
        TestSelectModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainSelectComponent);
    component = fixture.componentInstance;
    component.selectComponent = TestComponent;
    component.selected = [];
    component.selectedKey = 'selectedIds';
    component.outputKey = 'selectChange';
    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('Should set one empty chain link if none are selected', () => {
      expect(component.chainLinkList).toEqual([emptyChainLink]);
    });
    it('Should set chain links according to selected ids', () => {
      component.selected = [
        ['123']
      ];
      component.ngOnInit();
      expect(component.chainLinkList).toEqual([{
        active: false,
        selectComponentConfig: {
          component: TestComponent,
          attributes: {
            'selectedIds': ['123'],
          },
          handlers: {
            'selectChange': jasmine.any(Function)
          }
        }
      }]);
    });
  });

  describe('addChainLink', () => {
    it('Should add chain link to the list', () => {
      component.addChainLink();
      expect(component.chainLinkList).toEqual([emptyChainLink, emptyChainLink]);
    });

    it('Should bind callback to the newly created link', () => {
      spyOn(component.selectChange, 'emit');
      component.addChainLink();
      fixture.detectChanges();
      const selectElement = fixture.debugElement.queryAll(By.css('select'))[1];
      selectElement.triggerEventHandler('click', { id: 'test-id'});
      expect(component.selectChange.emit).toHaveBeenCalledWith({listChange: { id: 'test-id'}, index: 1});
    });
  });

  describe('removeChainLink', () => {
    it('Should remove chain link from the list at the corresponding index', () => {
      component.addChainLink();
      fixture.detectChanges();
      component.removeChainLink(1);
      fixture.detectChanges();
      const selectElements = fixture.debugElement.queryAll(By.css('select'));
      expect(selectElements.length).toEqual(1);
    });
  });

  describe('activateChainLink', () => {
    it('Should show the delete icon', () => {
      component.addChainLink();
      fixture.detectChanges();
      const chainLinkRow = fixture.debugElement.queryAll(By.css('.chain-link-row'))[1];
      chainLinkRow.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      const deleteContainer = fixture.debugElement.query(By.css('.delete-container'));
      expect(deleteContainer).not.toBeNull();
    });
  });

  describe('deactivateChainLink', () => {
    it('Should show the delete icon', () => {
      component.addChainLink();
      fixture.detectChanges();
      const chainLinkRow = fixture.debugElement.queryAll(By.css('.chain-link-row'))[1];
      chainLinkRow.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      chainLinkRow.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      const deleteContainer = fixture.debugElement.query(By.css('.delete-container'));
      expect(deleteContainer).toBeNull();
    });
  });
});
