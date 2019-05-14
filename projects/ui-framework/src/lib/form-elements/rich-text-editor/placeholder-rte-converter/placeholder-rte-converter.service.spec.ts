import { PlaceholderRteConverterService } from './placeholder-rte-converter.service';
import { RtePlaceholder } from './placeholder-rte-converter.interface';

describe('PlachholderRteConverterService', () => {
  let templateTextEditorService: PlaceholderRteConverterService;
  const placeholders: RtePlaceholder[] = [
    {
      sample: 'Jon',
      displayName: 'First name',
      id: '/root/firstName'
    },
    {
      sample: 'CTO',
      displayName: 'Work | title',
      id: '/work/title'
    },
    {
      sample: 'Dev',
      displayName: 'Work | department',
      id: '/work/department'
    }
  ];
  beforeEach(() => {
    templateTextEditorService = new PlaceholderRteConverterService();
  });

  describe('toRte', () => {
    it('Should convert HTML content with one placeholder to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is cto';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is <span ' +
        'data-placeholder-id="/root/firstName" data-placeholder-category="">  First name  </span> my job title is cto';
      const toRteRe = templateTextEditorService.toRte(htmlInput, placeholders);
      expect(toRteRe).toEqual(expectResult);
    });
    it('Should convert plain text content with placeholder at the end to RTE format', () => {
      const htmlInput =
        'Hi, My name is {{/root/firstName}} my job title is cto';
      const expectResult = 'Hi, My name is <span ' +
        'data-placeholder-id="/root/firstName" data-placeholder-category="">';
      const toRteRe = templateTextEditorService.toRte(htmlInput, placeholders);
      expect(toRteRe).toContain(expectResult);
    });
    it('Should return HTML content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is yossi my job title is cto';
      expect(templateTextEditorService.toRte(htmlInput, placeholders)).toEqual(
        htmlInput
      );
    });
  });
  describe('fromRte', () => {
    it('Should convert RTE placeholder', () => {
      const rteInnerHtmlInput =
        '<div>Hello <span data-placeholder-id="/root/firstName">First name</span></div>';
      const fromRteResult = '<div>Hello {{/root/firstName}}</div>';
      expect(templateTextEditorService.fromRte(rteInnerHtmlInput)).toEqual(
        fromRteResult
      );
    });

    it('Should convert multiple RTE placeholders', () => {
      const rteInnerHtmlInput =
        '<div>Hello <span data-placeholder-id="/root/firstName">First name</span></div>' +
        'Welcome to the <span data-placeholder-id="/work/department">Work | department</span> department';
      const fromRteResult =
        '<div>Hello {{/root/firstName}}</div>Welcome to the {{/work/department}} department';
      expect(templateTextEditorService.fromRte(rteInnerHtmlInput)).toEqual(
        fromRteResult
      );
    });

    it('Should not convert RTE placeholder in cases there is none', () => {
      const rteInnerHtmlInput = '<div>Hello Jon</div>';
      const fromRteResult = '<div>Hello Jon</div>';
      expect(templateTextEditorService.fromRte(rteInnerHtmlInput)).toEqual(
        fromRteResult
      );
    });
  });
});
