import { PlachholderRteConverterService } from './plachholder-rte-converter.service';

describe('PlachholderRteConverterService', () => {
  let templateTextEditorService: PlachholderRteConverterService;
  const listOptions = [
    {
      sample: 'Jon',
      displayName: 'First name',
      id: '/root/firstName'
    },
    {
      sample: 'CTO',
      displayName: 'CTO',
      id: '/work/title'
    },
  ];
  beforeEach(() => {
    templateTextEditorService = new PlachholderRteConverterService();
  });

  describe('convertContentToRtePlaceholderCompatible', () => {
    it('Should convert HTML content with one placeholder to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is cto';
      const expectResult =
        '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">First name</span> my job title is cto';
      expect(templateTextEditorService
        .convertContentToRteCompatible(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should convert HTML plain text content with placeholder at the end to RTE format', () => {
      const htmlInput =
        'Hi, My name is {{/root/firstName}} my job title is cto';
      const expectResult = 'Hi, My name is <span placeholder="/root/firstName">First name</span>' +
        ' my job title is cto';
      expect(templateTextEditorService
        .convertContentToRteCompatible(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should return HTML content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is yossi my job title is cto';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is yossi' +
        ' my job title is cto';
      expect(templateTextEditorService
        .convertContentToRteCompatible(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should return plain text content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        'Hi, My name is yossi my job title is cto';
      const expectResult = 'Hi, My name is yossi my job title is cto';
      expect(templateTextEditorService
        .convertContentToRteCompatible(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should convert HTML content with multiple placeholders to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is {{/work/title}}';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">First name</span>' +
        ' my job title is ' +
        '<span placeholder="/work/title">CTO</span>';
      expect(templateTextEditorService
        .convertContentToRteCompatible(htmlInput, listOptions))
        .toEqual(expectResult);
    });
    it('Should convert HTML content placeholders at the beginning of the content to RTE format', () => {
      const htmlInput =
        '<h1>{{/work/title}}</h1> my job title is cto';
      const expectResult = '<h1><span placeholder="/work/title">CTO</span></h1> ' +
        'my job title is cto';
      expect(templateTextEditorService
        .convertContentToRteCompatible(htmlInput, listOptions))
        .toEqual(expectResult);
    });
  });
});
