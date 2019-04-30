import { TemplateTextEditorService } from './template-text-editor.service';

describe('templateTextEditorService', () => {
  let templateTextEditorService: TemplateTextEditorService;
  beforeEach(() => {
    templateTextEditorService = new TemplateTextEditorService();
  });

  fdescribe('convertContentToRtePlaceholderCompatible', () => {
    it('Should convert HTML content with one placeholder to RTE format placeholder', () => {
      const htmlString =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is killer machine';
      const resString = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">/root/firstName</span>' +
        ' my job title is killer machine';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlString))
        .toEqual(resString);
    });
    it('Should convert HTML plain text content with placeholder at the end to RTE format placeholder', () => {
      const htmlString =
        'Hi, My name is {{/root/firstName}} my job title is killer machine';
      const resString = 'Hi, My name is <span placeholder="/root/firstName">/root/firstName</span>' +
        ' my job title is killer machine';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlString))
        .toEqual(resString);
    });
    it('Should return HTML content untouched when content has no placeHolder to convert', () => {
      const htmlString =
        '<h1>Hi</h1>, <b>My</b> name is yossi my job title is killer machine';
      const resString = '<h1>Hi</h1>, <b>My</b> name is yossi' +
        ' my job title is killer machine';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlString))
        .toEqual(resString);
    });
    it('Should return plain text content untouched when content has no placeHolder to convert', () => {
      const htmlString =
        'Hi, My name is yossi my job title is killer machine';
      const resString = 'Hi, My name is yossi my job title is killer machine';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlString))
        .toEqual(resString);
    });
    it('Should convert HTML content with multiple placeholders to RTE format', () => {
      const htmlString =
        '<h1>Hi</h1>, <b>My</b> name is {{/root/firstName}} my job title is killer machine {{/work/jobTitle}}';
      const resString = '<h1>Hi</h1>, <b>My</b> name is <span placeholder="/root/firstName">/root/firstName</span>' +
        ' my job title is killer machine ' +
        '<span placeholder="/work/jobTitle">/work/jobTitle</span>';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlString))
        .toEqual(resString);
    });
    it('Should convert HTML content placeholders at the beginning of the content to RTE format', () => {
      const htmlString =
        '<h1>{{/root/title}}</h1> my job title is killer machine';
      const resString = '<h1><span placeholder="/root/title">/root/title</span></h1> ' +
        'my job title is killer machine';
      expect(templateTextEditorService
        .convertContentToRtePlaceholderCompatible(htmlString))
        .toEqual(resString);
    });
  });
});
