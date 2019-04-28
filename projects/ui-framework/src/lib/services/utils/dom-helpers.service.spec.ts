import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DOMhelpers } from './dom-helpers.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from './utils.module';
import { UtilsService } from './utils.service';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div class="test1" style="font-size: 20px; line-height: 2;">
      <p style="font-size: 10px; line-height: 1;">
        <span class="test-me">Test</span>
      </p>
    </div>

    <div class="test2">
      <p class="par1">
        <!-- HTML Comment -->
      </p>
      <p class="par2">
        <span></span>
      </p>
      <p class="par3">
        Hello
      </p>
    </div>

    <div class="test3">
      <p><!-- HTML Comment --></p>
      <div>
        <p class="right-one">
          <span> Hello </span>
          World
        </p>
      </div>
    </div>
  `,
  providers: [DOMhelpers]
})
class TestComponent {
  constructor() {}
}

describe('DOMhelpers', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;
  let DOM: DOMhelpers;
  let testDiv1: HTMLElement;
  let testDiv2: HTMLElement;
  let testDiv3: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, UtilsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [UtilsService, DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        DOM = TestBed.get(DOMhelpers);

        testDiv1 = fixture.debugElement.query(By.css('.test1')).nativeElement;
        testDiv2 = fixture.debugElement.query(By.css('.test2')).nativeElement;
        testDiv3 = fixture.debugElement.query(By.css('.test3')).nativeElement;
      });
  }));

  describe('setCssProps', () => {
    it('should set css properties on element', () => {
      DOM.setCssProps(testDiv2, {
        '--test': 'passed1',
        '--test2': 'passed2',
        '--test3': 'passed3'
      });
      expect(getComputedStyle(testDiv2).getPropertyValue('--test2')).toEqual(
        'passed2'
      );
    });
  });

  describe('getElementTextProps', () => {
    it('should return font-size and line-height of element as unitless numbers', () => {
      const testElem = testDiv1.querySelector('.test-me') as HTMLElement;
      const textProps = DOM.getElementTextProps(testElem);
      expect(textProps.fontSize).toEqual(10);
      expect(textProps.lineHeight).toEqual(1);
    });
  });

  describe('hasChildren', () => {
    it('should return boolean indicating if element has children elements', () => {
      const testElem = testDiv1.querySelector('.test-me') as HTMLElement;
      expect(DOM.hasChildren(testDiv2)).toEqual(true);
      expect(DOM.hasChildren(testElem)).toEqual(false);
    });
  });

  describe('hasChildrenWithText', () => {
    it('should return an object with the number of children with innerText and the index of first such child', () => {
      const testElem = testDiv2.querySelector('.par2') as HTMLElement;
      expect(DOM.hasChildrenWithText(testElem).total).toEqual(0);
      expect(DOM.hasChildrenWithText(testDiv2).total).toEqual(1);
      expect(DOM.hasChildrenWithText(testDiv2).firstIndex).toEqual(2);
    });
  });

  describe('hasTextNodes', () => {
    it('should return boolean indicating if element has text Nodes', () => {
      const testElem = testDiv2.querySelector('.par1') as HTMLElement;
      const testElem2 = testDiv3.querySelector('.right-one') as HTMLElement;
      expect(DOM.hasTextNodes(testElem)).toEqual(false);
      expect(DOM.hasTextNodes(testElem2)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('should return boolean indicating if element is empty (has no children or text nodes)', () => {
      const testElem = testDiv2.querySelector('.par1') as HTMLElement;
      const testElem2 = testDiv2.querySelector('.par2') as HTMLElement;
      const testElem3 = testDiv3.querySelector('.right-one') as HTMLElement;
      expect(DOM.isEmpty(testElem)).toEqual(true);
      expect(DOM.isEmpty(testElem2)).toEqual(false);
      expect(DOM.isEmpty(testElem3)).toEqual(false);
    });
  });

  describe('getDeepTextElement', () => {
    it('should return deepest element that has text or multiple children with text or combination of above', () => {
      const testElem = testDiv3.querySelector('.right-one') as HTMLElement;
      expect(DOM.getDeepTextElement(testElem).classList).toContain('right-one');
      expect(DOM.getDeepTextElement(testDiv1).innerText).toEqual('Test');
    });
  });
});
