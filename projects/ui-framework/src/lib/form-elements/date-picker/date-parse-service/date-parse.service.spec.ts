import { DateParseService } from './date-parse.service';
import { DateParseServiceTest } from './date-parse.service.mock';

describe('DateParseService', () => {
  const parser = new DateParseService();

  describe('parseFormat', () => {
    it('should parse dd-mm-yy', () => {
      const parsed = parser.parseFormat('dd-mm-yy');

      expect(parsed.format).toEqual('dd-MM-yy');
      expect(parsed.items).toEqual(3);
      expect(parsed.separator).toEqual('-');

      expect(parsed.index).toEqual({ day: 0, month: 1, year: 2 });
      expect(parsed.length).toEqual({ day: 2, month: 2, year: 2 });
      expect(parsed.order).toEqual(['day', 'month', 'year']);
    });

    it('should parse "mmm.dd.yyyy"', () => {
      const parsed = parser.parseFormat('mmm.dd.yyyy');

      expect(parsed.format).toEqual('MMM.dd.yyyy');
      expect(parsed.items).toEqual(3);
      expect(parsed.separator).toEqual('.');

      expect(parsed.index).toEqual({ day: 1, month: 0, year: 2 });
      expect(parsed.length).toEqual({ day: 2, month: 3, year: 4 });
      expect(parsed.order).toEqual(['month', 'day', 'year']);
    });

    it('should parse "mm yyyy"', () => {
      const parsed = parser.parseFormat('mm yyyy');

      expect(parsed.format).toEqual('MM yyyy');
      expect(parsed.items).toEqual(2);
      expect(parsed.separator).toEqual(' ');

      expect(parsed.index).toEqual({ day: 2, month: 0, year: 1 });
      expect(parsed.length).toEqual({ day: 0, month: 2, year: 4 });
      expect(parsed.order).toEqual(['month', 'year', 'day']);
    });

    it('should parse "yyyy"', () => {
      const parsed = parser.parseFormat('yyyy');

      expect(parsed.format).toEqual('yyyy');
      expect(parsed.items).toEqual(1);
      expect(parsed.separator).toEqual('/');

      expect(parsed.index).toEqual({ day: 1, month: 2, year: 0 });
      expect(parsed.length).toEqual({ day: 0, month: 0, year: 4 });
      expect(parsed.order).toEqual(['year', 'day', 'month']);
    });

    it('should parse "dd/mmm"', () => {
      const parsed = parser.parseFormat('dd/mmm');

      expect(parsed.format).toEqual('dd/MMM');
      expect(parsed.items).toEqual(2);
      expect(parsed.separator).toEqual('/');

      expect(parsed.index).toEqual({ day: 0, month: 1, year: 2 });
      expect(parsed.length).toEqual({ day: 2, month: 3, year: 0 });
      expect(parsed.order).toEqual(['day', 'month', 'year']);
    });
  });

  describe('parseDate', () => {
    Object.keys(DateParseServiceTest).forEach(format => {
      Object.keys(DateParseServiceTest[format]).forEach(date => {
        it(`should parse '${date}' to '${
          DateParseServiceTest[format][date].result
        }', using format '${format}'`, () => {
          const parsed = parser.parseDate(format as any, date);
          expect(parsed.value).toEqual(
            DateParseServiceTest[format][date].result
          );
        });

        it(`should parse '${date}' to '${
          DateParseServiceTest[format][date].resultStrict
        }', using format '${format}', strict mode`, () => {
          const parsedStrict = parser.parseDate(format as any, date, true);

          expect(parsedStrict.value).toEqual(
            DateParseServiceTest[format][date].resultStrict
          );
        });
      });
    });
  });
});
