import { RteUtilsService } from './rte-utils.service';
import { PlaceholderRteConverterService } from '../placeholder-rte-converter/placeholder-rte-converter.service';
import {TestBed} from '@angular/core/testing';
import {RTEControls} from '../rte.enum';
import Quill from 'quill';


describe('RteUtilsService', () => {
  let rteUtilsService: RteUtilsService;
  let placeholderRteConverterService: PlaceholderRteConverterService;
  const controls: RTEControls[] = [
    RTEControls.size,
    RTEControls.bold,
    RTEControls.italic,
    RTEControls.underline,
    RTEControls.link,
    RTEControls.list,
    RTEControls.align,
    RTEControls.dir,
    RTEControls.placeholders,
  ];
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [PlaceholderRteConverterService]
    });
    placeholderRteConverterService = TestBed.get(PlaceholderRteConverterService);
    rteUtilsService = new RteUtilsService(placeholderRteConverterService);
  });

  describe('getHtmlContent', () => {
    it('Should convert placeholder bolt', () => {
      const container = document.createElement('div');
      const editorHtml = '<h1>Hi</h1>, ' +
        '<b>My</b> name is <span data-placeholder-id="/root/firstName">First name</span> my job title';
      const result = {
        body: '<div>Hi, <strong>My</strong> name is {{/root/firstName}} my job title</div>',
        plainText: 'Hi, My name is First name my job title'
      };
      container.innerHTML = editorHtml;
      const quill = new Quill(container);
      expect(rteUtilsService.getHtmlContent(quill, controls)).toEqual(result);
    });
    it('Should preserve HTML content', () => {
      const container = document.createElement('div');
      const editorHtml = '<h1>Hi</h1>, ' +
        '<b>My</b> name is jon';
      const result = {
        body: '<div>Hi, <strong>My</strong> name is jon</div>',
        plainText: 'Hi, My name is jon'
      };
      container.innerHTML = editorHtml;
      const quill = new Quill(container);
      expect(rteUtilsService.getHtmlContent(quill, controls)).toEqual(result);
    });
    it('should Quill tag to email compatible tag', () => {
      const controlsWithoutPlaceholder: RTEControls[] = [
        RTEControls.size,
        RTEControls.bold,
        RTEControls.italic,
        RTEControls.underline,
        RTEControls.link,
        RTEControls.list,
        RTEControls.align,
        RTEControls.dir,
      ];
      const container = document.createElement('div');
      const editorHtml = '<h1>Hi</h1>, ' +
        '<b>My</b> name is <em>jon</em>';
      const result = {
        body: '<div>Hi, <strong>My</strong> name is <i>jon</i></div>',
        plainText: 'Hi, My name is jon'
      };
      container.innerHTML = editorHtml;
      const quill = new Quill(container);
      expect(rteUtilsService.getHtmlContent(quill, controlsWithoutPlaceholder)).toEqual(result);
    });
  });
});
