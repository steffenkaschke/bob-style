import { Component, ViewChild, ElementRef } from '@angular/core';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DateInputDirectiveModule } from './dateinput.directive.module';
import { DatepickerType, DateAdjust } from '../datepicker.enum';
import { inputValue } from '../../../services/utils/test-helpers';
import { FormatParserResult, DateParseResult } from '../datepicker.interface';
import { DateParseService } from '../date-parse-service/date-parse.service';
import { DateInputDirective } from './dateinput.directive';

@Component({
  template: `
    <input
      type="text"
      class="date-input"
      [bDateInput]="dateFormat || dateFormats[type]"
      [date]="value"
      [min]="minDate || null"
      [max]="maxDate || null"
      [setTo]="type === types.month ? dateAdjust.startOfMonth : null"
      (parsed)="onInputChange($event)"
    />
  `,
  providers: [],
})
class TestComponent {
  constructor() {}

  @ViewChild(DateInputDirective, { static: true })
  public diDirective: DateInputDirective;

  @ViewChild(DateInputDirective, { static: true, read: ElementRef })
  public input: ElementRef;

  public value: Date;
  public type = DatepickerType.date;
  public minDate: Date;
  public maxDate: Date;

  public dateFormat: string;

  public dateFormats: { [key in DatepickerType]: FormatParserResult } = {
    [DatepickerType.date]: DateParseService.prototype.parseFormat(
      'dd-MMM-yyyy',
      4
    ),
    [DatepickerType.month]: DateParseService.prototype.parseFormat('MMM-yy', 4),
  };

  public readonly types = DatepickerType;
  public readonly dateAdjust = DateAdjust;

  public parseResult: DateParseResult;

  public onInputChange(event: DateParseResult) {
    this.parseResult = event;
  }
}

fdescribe('CollapsibleSectionComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  let input: HTMLInputElement;
  let diDirective: DateInputDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DateInputDirectiveModule],
      declarations: [TestComponent],
      providers: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        input = component.input.nativeElement;
        diDirective = component.diDirective;
      });
  }));

  describe('dateFormat input', () => {
    beforeEach(() => {
      component.dateFormat = 'yyyy/MMM/dd';
      fixture.detectChanges();
    });

    it('should parse newly provided format', () => {
      expect(diDirective['format'].format).toEqual('yyyy/MMM/d');
      expect(diDirective['format'].items).toEqual(3);
      expect(diDirective['format'].separator).toEqual('/');
    });
  });

  describe('Simple date parsing', () => {
    it('should set input value to 02-Mar-1981', () => {
      inputValue(input, '02 03 81');
      expect(input.value).toEqual('02-Mar-1981');
    });
    it('should set input value to 02-Mar-1981', () => {
      inputValue(input, '1981-02-03');
      expect(input.value).toEqual('02-Mar-1981');
    });
    it('should set input value to 03-Feb-1981', () => {
      inputValue(input, '1981-03-02');
      expect(input.value).toEqual('03-Feb-1981');
    });
  });

  describe('Simple month parsing', () => {
    beforeEach(() => {
      component.type = DatepickerType.month;
      fixture.detectChanges();
    });

    it('should set input value to Feb-1981', () => {
      inputValue(input, '02 03 81');
      expect(input.value).toEqual('Feb-1981');
    });
    it('should set input value to Mar-1981', () => {
      inputValue(input, '1981-03-02');
      expect(input.value).toEqual('Mar-1981');
    });
  });
});
