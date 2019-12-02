import { DateParseService } from './date-parse.service';
import { DateParseServiceTest } from './date-parse.service.mock';

fdescribe('DateParseService', () => {
  const parser = new DateParseService();

  describe('parseDate', () => {
    it('Should parse correctly', () => {
      Object.keys(DateParseServiceTest).forEach(format => {
        Object.keys(DateParseServiceTest[format]).forEach(date => {
          const parsed = parser.parseDate(format as any, date);

          const parsedStrict = parser.parseDate(format as any, date, true);

          expect(parsed.displayValue).toEqual(
            DateParseServiceTest[format][date].result
          );

          expect(parsedStrict.displayValue).toEqual(
            DateParseServiceTest[format][date].resultStrict
          );
        });
      });
    });
  });
});
