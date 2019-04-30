import { TemplateTextEditorService } from './template-text-editor.service';

describe('templateTextEditorService', () => {
  let templateTextEditorService: TemplateTextEditorService;
  beforeEach(() => {
    templateTextEditorService = new TemplateTextEditorService();
  });

  fdescribe('convertContentToRtePlaceholderCompatible', () => {
    it('Should convert HTML content with one placeholder to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is cto';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">/root/firstName</span>' +
        ' my job title is cto';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlInput))
        .toEqual(expectResult);
    });
    it('Should convert HTML plain text content with placeholder at the end to RTE format', () => {
      const htmlInput =
        'Hi, My name is {{/root/firstName}} my job title is cto';
      const expectResult = 'Hi, My name is <span placeholder="/root/firstName">/root/firstName</span>' +
        ' my job title is cto';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlInput))
        .toEqual(expectResult);
    });
    it('Should return HTML content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is yossi my job title is cto';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is yossi' +
        ' my job title is cto';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlInput))
        .toEqual(expectResult);
    });
    it('Should return plain text content untouched when content has no placeHolder to convert', () => {
      const htmlInput =
        'Hi, My name is yossi my job title is cto';
      const expectResult = 'Hi, My name is yossi my job title is cto';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlInput))
        .toEqual(expectResult);
    });
    it('Should convert HTML content with multiple placeholders to RTE format', () => {
      const htmlInput =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is {{/work/jobTitle}}';
      const expectResult = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">/root/firstName</span>' +
        ' my job title is ' +
        '<span placeholder="/work/jobTitle">/work/jobTitle</span>';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlInput))
        .toEqual(expectResult);
    });
    it('Should convert HTML content placeholders at the beginning of the content to RTE format', () => {
      const htmlInput =
        '<h1>{{/root/title}}</h1> my job title is cto';
      const expectResult = '<h1><span placeholder="/root/title">/root/title</span></h1> ' +
        'my job title is cto';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlInput))
        .toEqual(expectResult);
    });
  });
});
