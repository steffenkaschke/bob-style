import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DateInputDirective } from '../../../ui-framework/src/lib/form-elements/datepicker/dateinput.directive';
import { DateParseService } from '../../../ui-framework/src/lib/form-elements/datepicker/date-parse.service';
import { thisMonth, thisYear } from '../../../ui-framework/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor() {}

  @ViewChild(DateInputDirective, { static: true, read: ElementRef })
  input: ElementRef;

  formatStr: string = 'MMM/dd/yyyy';
  dateStr: string = '2010/5/3';

  test = {
    'dd/MM/yyyy': {
      //   '01 02 2010': { result: '01/02/2010', resultStrict: '01/02/2010' },
      //   '2010 jan 10': { result: '10/01/2010', resultStrict: '10/01/2010' },
      //   'jan.10.2010': { result: '10/01/2010', resultStrict: '10/01/2010' },
      //   '10 jan 2010': { result: '10/01/2010', resultStrict: '10/01/2010' },
      //   '20 5 2010': { result: '20/05/2010', resultStrict: '20/05/2010' },
      //   '5-20-2010': { result: '20/05/2010', resultStrict: '20/05/2010' },
      //   '2010 5 20': { result: '20/05/2010', resultStrict: '20/05/2010' },
      //   '2010/5/3': { result: '05/03/2010', resultStrict: '05/03/2010' },
      //   '5 2010 3': { result: '05/03/2010', resultStrict: '05/03/2010' },
      //   '2010 05': { result: '01/05/2010', resultStrict: null },
      //   'may 2010': { result: '01/05/2010', resultStrict: null },
      //   '20 01': {
      //     result: '20/01/' + thisYear(),
      //     resultStrict: null,
      //   },
      //   '01 05': {
      //     result: '01/05/' + thisYear(),
      //     resultStrict: null,
      //   },
      //   '01': {
      //     result: '01/' + thisMonth() + '/' + thisYear(),
      //     resultStrict: null,
      //   },
      //   '2010': { result: '01/01/2010', resultStrict: null },
      //   '20': {
      //     result: '20/' + thisMonth() + '/' + thisYear(),
      //     resultStrict: null,
      //   },
      //   '1 2 mar 2010': {
      //     result: '01/03/2010',
      //     resultStrict: '01/03/' + thisYear(),
      //   },
      //   'mar 2010 2 20': { result: '20/03/2010', resultStrict: '02/03/2010' },
      //   '1 2010 20 5': { result: '20/01/2010', resultStrict: '20/01/2010' },
    },
    // 'dd/MMM/yyyy': {
    //   '01 02 2010': { result: '01/Feb/2010', resultStrict: '01/Feb/2010' },
    //   '2010 jan 10': { result: '10/Jan/2010', resultStrict: '10/Jan/2010' },
    //   'jan.10.2010': { result: '10/Jan/2010', resultStrict: '10/Jan/2010' },
    //   '10 jan 2010': { result: '10/Jan/2010', resultStrict: '10/Jan/2010' },
    //   '20 5 2010': { result: '20/May/2010', resultStrict: '20/May/2010' },
    //   '5-20-2010': { result: '20/May/2010', resultStrict: '20/May/2010' },
    //   '2010 5 20': { result: '20/May/2010', resultStrict: '20/May/2010' },
    //   '2010/5/3': { result: '05/Mar/2010', resultStrict: '05/Mar/2010' },
    //   '5 2010 3': { result: '05/Mar/2010', resultStrict: '05/Mar/2010' },
    //   '2010 05': { result: '01/May/2010', resultStrict: null },
    //   'may 2010': { result: '01/May/2010', resultStrict: null },
    //   '20 01': {
    //     result: '20/Jan/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01 05': {
    //     result: '01/May/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: '01/' + thisMonth(true, 0, true) + '/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '2010': { result: '01/Jan/2010', resultStrict: null },
    //   '20': {
    //     result: '20/' + thisMonth(true, 0, true) + '/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: '01/Mar/2010',
    //     resultStrict: '01/Mar/' + thisYear(),
    //   },
    //   'mar 2010 2 20': { result: '20/Mar/2010', resultStrict: '02/Mar/2010' },
    //   '1 2010 20 5': { result: '20/Jan/2010', resultStrict: '20/Jan/2010' },
    // },
    // 'MMM/dd/yyyy': {
    //   '01 02 2010': { result: 'Jan/02/2010', resultStrict: 'Jan/02/2010' },
    //   '2010 jan 10': { result: 'Jan/10/2010', resultStrict: 'Jan/10/2010' },
    //   'jan.10.2010': { result: 'Jan/10/2010', resultStrict: 'Jan/10/2010' },
    //   '10 jan 2010': { result: 'Jan/10/2010', resultStrict: 'Jan/10/2010' },
    //   '20 5 2010': { result: 'May/20/2010', resultStrict: 'May/20/2010' },
    //   '5-20-2010': { result: 'May/20/2010', resultStrict: 'May/20/2010' },
    //   '2010 5 20': { result: 'May/20/2010', resultStrict: 'May/20/2010' },
    //   '2010/5/3': { result: 'May/03/2010', resultStrict: 'May/03/2010' },
    //   '5 2010 3': { result: 'May/03/2010', resultStrict: 'May/03/2010' },
    //   '2010 05': { result: 'May/01/2010', resultStrict: null },
    //   'may 2010': { result: 'May/01/2010', resultStrict: null },
    //   '20 01': {
    //     result: 'Jan/20/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01 05': {
    //     result: 'Jan/05/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: thisMonth(true, 0, true) + '/01/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '2010': { result: 'Jan/01/2010', resultStrict: null },
    //   '20': {
    //     result: thisMonth(true, 0, true) + '/20/' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: 'Mar/01/2010',
    //     resultStrict: 'Mar/01/' + thisYear(),
    //   },
    //   'mar 2010 2 20': {
    //     result: 'Mar/20/2010',
    //     resultStrict: 'Mar/02/2010',
    //   },
    //   '1 2010 20 5': {
    //     result: 'Jan/20/2010',
    //     resultStrict: 'Jan/20/2010',
    //   },
    // },
    // 'MMM/dd/yy': {
    //   'jan.10.2010': { result: 'Jan/10/10', resultStrict: 'Jan/10/10' },
    //   '2010 5 20': { result: 'May/20/10', resultStrict: 'May/20/10' },
    //   '20 01': {
    //     result: 'Jan/20/' + thisYear(true),
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: 'Mar/01/10',
    //     resultStrict: 'Mar/01/' + thisYear(true),
    //   },
    // },
    // 'yyyy/MM/dd': {
    //   '01 02 2010': { result: '2010/01/02', resultStrict: '2010/01/02' },
    //   '2010 jan 10': { result: '2010/01/10', resultStrict: '2010/01/10' },
    //   'jan.10.2010': { result: '2010/01/10', resultStrict: '2010/01/10' },
    //   '10 jan 2010': { result: '2010/01/10', resultStrict: '2010/01/10' },
    //   '20 5 2010': { result: '2010/05/20', resultStrict: '2010/05/20' },
    //   '5-20-2010': { result: '2010/05/20', resultStrict: '2010/05/20' },
    //   '2010 5 20': { result: '2010/05/20', resultStrict: '2010/05/20' },
    //   '2010/5/3': { result: '2010/05/03', resultStrict: '2010/05/03' },
    //   '5 2010 3': { result: '2010/05/03', resultStrict: '2010/05/03' },
    //   '2010 05': { result: '2010/05/01', resultStrict: null },
    //   'may 2010': { result: '2010/05/01', resultStrict: null },
    //   '20 01': {
    //     result: thisYear() + '/01/20',
    //     resultStrict: null,
    //   },
    //   '01 05': {
    //     result: thisYear() + '/01/05',
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: thisYear() + '/' + thisMonth() + '/01',
    //     resultStrict: null,
    //   },
    //   '2010': { result: '2010/01/01', resultStrict: null },
    //   '20': {
    //     result: thisYear() + '/' + thisMonth() + '/20',
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: '2010/03/01',
    //     resultStrict: thisYear() + '/03/01',
    //   },
    //   'mar 2010 2 20': { result: '2010/03/20', resultStrict: '2010/03/02' },
    //   '1 2010 20 5': { result: '2010/01/20', resultStrict: '2010/01/20' },
    // },
    // 'yy/MM/dd': {
    //   '2010 jan 10': { result: '10/01/10', resultStrict: '10/01/10' },
    //   'jan.10.2010': { result: '10/01/10', resultStrict: '10/01/10' },
    //   '20 01': {
    //     result: thisYear(true) + '/01/20',
    //     resultStrict: null,
    //   },
    //   '01 05': {
    //     result: thisYear(true) + '/01/05',
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: thisYear(true) + '/' + thisMonth() + '/01',
    //     resultStrict: null,
    //   },
    //   '1 2010 20 5': { result: '10/01/20', resultStrict: '10/01/20' },
    // },
    // 'yy/dd/MM': {
    //   '01 02 2010': { result: '10/01/02', resultStrict: '10/01/02' },
    //   '2010 jan 10': { result: '10/10/01', resultStrict: '10/10/01' },
    //   'jan.10.2010': { result: '10/10/01', resultStrict: '10/10/01' },
    //   '10 jan 2010': { result: '10/10/01', resultStrict: '10/10/01' },
    //   '20 5 2010': { result: '10/20/05', resultStrict: '10/20/05' },
    //   '5-20-2010': { result: '10/20/05', resultStrict: '10/20/05' },
    //   '2010 5 20': { result: '10/20/05', resultStrict: '10/20/05' },
    //   '2010/5/3': { result: '10/05/03', resultStrict: '10/05/03' },
    //   '5 2010 3': { result: '10/05/03', resultStrict: '10/05/03' },
    //   '2010 05': { result: '10/01/05', resultStrict: null },
    //   'may 2010': { result: '10/01/05', resultStrict: null },
    //   '20 01': {
    //     result: thisYear(true) + '/20/01',
    //     resultStrict: null,
    //   },
    //   '01 05': {
    //     result: thisYear(true) + '/01/05',
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: thisYear(true) + '/01/' + thisMonth(),
    //     resultStrict: null,
    //   },
    //   '2010': { result: '10/01/01', resultStrict: null },
    //   '20': {
    //     result: thisYear(true) + '/20/' + thisMonth(),
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: '10/01/03',
    //     resultStrict: thisYear(true) + '/01/03',
    //   },
    //   'mar 2010 2 20': { result: '10/20/03', resultStrict: '10/02/03' },
    //   '1 2010 20 5': { result: '10/20/01', resultStrict: '10/20/01' },
    // },
    // 'MMM-dd-yyyy': {
    //   'jan.10.2010': { result: 'Jan-10-2010', resultStrict: 'Jan-10-2010' },
    //   '2010 5 20': { result: 'May-20-2010', resultStrict: 'May-20-2010' },
    //   '20 01': {
    //     result: 'Jan-20-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: thisMonth(true, 0, true) + '-01-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '20': {
    //     result: thisMonth(true, 0, true) + '-20-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   'mar 2010 2 20': { result: 'Mar-20-2010', resultStrict: 'Mar-02-2010' },
    // },
    // 'MM-dd-yyyy': {
    //   '01 02 2010': { result: '01-02-2010', resultStrict: '01-02-2010' },
    //   '2010 jan 10': { result: '01-10-2010', resultStrict: '01-10-2010' },
    //   'jan.10.2010': { result: '01-10-2010', resultStrict: '01-10-2010' },
    //   '10 jan 2010': { result: '01-10-2010', resultStrict: '01-10-2010' },
    //   '20 5 2010': { result: '05-20-2010', resultStrict: '05-20-2010' },
    //   '5-20-2010': { result: '05-20-2010', resultStrict: '05-20-2010' },
    //   '2010 5 20': { result: '05-20-2010', resultStrict: '05-20-2010' },
    //   '2010/5/3': { result: '05-03-2010', resultStrict: '05-03-2010' },
    //   '5 2010 3': { result: '05-03-2010', resultStrict: '05-03-2010' },
    //   '2010 05': { result: '05-01-2010', resultStrict: null },
    //   'may 2010': { result: '05-01-2010', resultStrict: null },
    //   '20 01': {
    //     result: '01-20-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01 05': {
    //     result: '01-05-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '01': {
    //     result: thisMonth() + '-01-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '2010': { result: '01-01-2010', resultStrict: null },
    //   '20': {
    //     result: thisMonth() + '-20-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: '03-01-2010',
    //     resultStrict: '03-01-' + thisYear(),
    //   },
    //   'mar 2010 2 20': { result: '03-20-2010', resultStrict: '03-02-2010' },
    //   '1 2010 20 5': { result: '01-20-2010', resultStrict: '01-20-2010' },
    // },
    // 'dd-MMM-yyyy': {
    //   '5-20-2010': { result: '20-May-2010', resultStrict: '20-May-2010' },
    //   '2010 05': { result: '01-May-2010', resultStrict: null },
    //   '20 01': {
    //     result: '20-Jan-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '2010': { result: '01-Jan-2010', resultStrict: null },
    //   '20': {
    //     result: '20-' + thisMonth(true, 0, true) + '-' + thisYear(),
    //     resultStrict: null,
    //   },
    //   '1 2 mar 2010': {
    //     result: '01-Mar-2010',
    //     resultStrict: '01-Mar-' + thisYear(),
    //   },
    // },
    'dd/mm': {
      // '01 02 2010': { result: '01/02', resultStrict: '01/02' },
      // '2010 jan 10': { result: '10/01', resultStrict: '01/01' },

      'jan.10.2010': { result: '10/01', resultStrict: '10/01' },
      // '10 jan 2010': { result: '10/01', resultStrict: '10/01' },

      // '20 5 2010': { result: '20/05', resultStrict: '20/05' },
      // '5-20-2010': { result: '20/05', resultStrict: '20/05' },

      // '20 01': {
      //   result: '20/01',
      //   resultStrict: '20/01',
      // },
      // '01 05': {
      //   result: '01/05',
      //   resultStrict: '01/05',
      // },
      // '01': {
      //   result: '01/' + thisMonth(),
      //   resultStrict: null,
      // },
      // '2010': { result: '01/01', resultStrict: null },
      // '20': {
      //   result: '20/' + thisMonth(),
      //   resultStrict: null,
      // },
      // '1 2 mar 2010': {
      //   result: '01/03',
      //   resultStrict: '01/02',
      // },
      // 'mar 2010 2 20': { result: '20/03', resultStrict: '01/03' },

      //
      //
      //

      // '2010 5 20': { result: '20/05', resultStrict: '05/' + thisMonth() },
      // '2010/5/3': { result: '05/03', resultStrict: '05/' + thisMonth() },
      // '5 2010 3': { result: '05/03', resultStrict: '05/' + thisMonth() },
      // '2010 05': { result: '01/05', resultStrict: '01/05' },
      // 'may 2010': { result: '01/05', resultStrict: '01/05' },
      // '1 2010 20 5': { result: '20/01', resultStrict: '01/01' },
    },
    yyyy: {},
    'mm/yyyy': {},
    mm: {},
  };

  formatVars = Object.keys(this.test);
  dateStrVars = Object.keys(this.test['dd/MM/yyyy']);

  onValueChange(value) {
    this.input.nativeElement.value = value;
    this.input.nativeElement.dispatchEvent(new Event('change'));
  }

  ngAfterViewInit() {
    // this.onValueChange(this.dateStr);
  }

  ngOnInit() {
    let counter = 0;

    // test 1

    console.time('test');

    Object.keys(this.test).forEach(format => {
      Object.keys(this.test[format]).forEach(date => {
        const parsed = DateParseService.prototype.parseDate(
          format as any,
          date
        );

        if (parsed.displayValue !== this.test[format][date].result) {
          ++counter;

          const message =
            '=======> FAILED: ' +
            date +
            ' (' +
            format +
            ') => expected ' +
            this.test[format][date].result +
            ', instead saw: ' +
            parsed.displayValue;

          if (parsed.displayValue === null) {
            console.warn(message);
          } else {
            console.log(message);
          }
        }
      });
    });

    // test 2

    Object.keys(this.test).forEach(format => {
      Object.keys(this.test[format]).forEach(date => {
        const parsed = DateParseService.prototype.parseDate(
          format as any,
          date,
          true
        );

        if (parsed.displayValue !== this.test[format][date].resultStrict) {
          ++counter;

          const message =
            '=======> FAILED STRICT: ' +
            date +
            ' (' +
            format +
            ') => expected ' +
            this.test[format][date].resultStrict +
            ', instead saw: ' +
            parsed.displayValue;

          if (parsed.displayValue === null) {
            console.warn(message);
          } else {
            console.log(message);
          }
        }
      });
    });

    console.timeEnd('test');

    console.log('TOTAL FAILED: ', counter);
  }
}
