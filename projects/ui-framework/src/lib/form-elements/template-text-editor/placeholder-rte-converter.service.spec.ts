import { PlaceholderRteConverterService } from './placeholder-rte-converter.service';

describe('PlachholderRteConverterService', () => {
  let templateTextEditorService: PlaceholderRteConverterService;
  const placeholders = [
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
      const expectResult =
        '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">First name</span> my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, placeholders))
        .toEqual(expectResult);
    });
    it('Should convert plain text content with placeholder at the end to RTE format', () => {
      const htmlInput =
        'Hi, My name is {{/root/firstName}} my job title is cto';
      const expectResult = 'Hi, My name is <span placeholder="/root/firstName">First name</span>' +
        ' my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, placeholders))
        .toEqual(expectResult);
    });
    it('Should return HTML content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is yossi my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, placeholders))
        .toEqual(htmlInput);
    });
    it('Should convert HTML content with multiple placeholders to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is {{/work/title}}';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">First name</span>' +
        ' my job title is ' +
        '<span placeholder="/work/title">Work | title</span>';
      expect(templateTextEditorService
        .toRte(htmlInput, placeholders))
        .toEqual(expectResult);
    });
    it('Should convert HTML content placeholders at the beginning of the content to RTE format', () => {
      const htmlInput =
        '<h1>{{/work/title}}</h1> my job title is cto';
      const expectResult = '<h1><span placeholder="/work/title">Work | title</span></h1> ' +
        'my job title is cto';
      expect(templateTextEditorService
        .toRte(htmlInput, placeholders))
        .toEqual(expectResult);
    });
    it('Should convert HTML content and fallback to id in case there are no placeholders found at list', () => {
      const htmlInput =
        '<h1>{{/address/city}}</h1> lives';
      const expectResult = '<h1><span placeholder="/address/city">/address/city</span></h1>' +
        ' lives';
      expect(templateTextEditorService
        .toRte(htmlInput, placeholders))
        .toEqual(expectResult);
    });
  });
  describe('fromRte', () => {
    it('Should convert RTE placeholder', () => {
      const rteInnerHtmlInput = '<div>Hello <span placeholder="/root/firstName">First name</span></div>';
      const fromRteResult = '<div>Hello {{/root/firstName}}</div>';
      expect(templateTextEditorService.fromRte(rteInnerHtmlInput, placeholders)).toEqual(fromRteResult);
    });

    it('Should convert multiple RTE placeholders', () => {
      const rteInnerHtmlInput = '<div>Hello <span placeholder="/root/firstName">First name</span></div>' +
        'Welcome to the <span placeholder="/work/department">Work | department</span> department';
      const fromRteResult = '<div>Hello {{/root/firstName}}</div>Welcome to the {{/work/department}} department';
      expect(templateTextEditorService.fromRte(rteInnerHtmlInput, placeholders)).toEqual(fromRteResult);
    });

    it('Should not convert RTE placeholder in cases there is none', () => {
      const rteInnerHtmlInput = '<div>Hello Jon</div>';
      const fromRteResult = '<div>Hello Jon</div>';
      expect(templateTextEditorService.fromRte(rteInnerHtmlInput, placeholders)).toEqual(fromRteResult);
    });
  });
});
