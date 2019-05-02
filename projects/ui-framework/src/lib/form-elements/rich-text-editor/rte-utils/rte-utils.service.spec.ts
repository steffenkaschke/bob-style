import { RteUtilsService } from './rte-utils.service';
import { PlaceholderRteConverterService } from '../placeholder-rte-converter/placeholder-rte-converter.service';
import { TestBed } from '@angular/core/testing';
import { RTEControls } from '../rte.enum';
import Quill from 'quill';
import { concat } from 'lodash';

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
  ];
  const controlsWithPlaceholders = concat(controls, [RTEControls.placeholders]);

  const getHtmlContentConverter = (editorHtml: string, testControls: RTEControls[], result) => {
    const container = document.createElement('div');
    container.innerHTML = editorHtml;
    const quill = new Quill(container);
    expect(rteUtilsService.getHtmlContent(quill, testControls)).toEqual(result);
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [PlaceholderRteConverterService]
    });
    placeholderRteConverterService = TestBed.get(PlaceholderRteConverterService);
    rteUtilsService = new RteUtilsService(placeholderRteConverterService);
  });

  describe('getHtmlContent', () => {
    it('Should convert placeholder bolt', () => {
      const editorHtml = '<h1>Hi</h1>, ' +
        '<b>My</b> name is <span data-placeholder-id="/root/firstName">First name</span> my job title';
      const result = {
        body: '<div>Hi, <strong>My</strong> name is {{/root/firstName}} my job title</div>',
        plainText: 'Hi, My name is First name my job title'
      };
      getHtmlContentConverter(editorHtml, controlsWithPlaceholders, result);
    });
    it('Should preserve HTML content', () => {
      const editorHtml = '<h1>Hi</h1>, ' +
        '<b>My</b> name is jon';
      const result = {
        body: '<div>Hi, <strong>My</strong> name is jon</div>',
        plainText: 'Hi, My name is jon'
      };
      getHtmlContentConverter(editorHtml, controlsWithPlaceholders, result);
    });
    it('Should convert quill HTML tags', () => {
      const editorHtml = '<h1>Hi</h1>, ' +
        '<b>My</b> name is <em>jon</em>';
      const result = {
        body: '<div>Hi, <strong>My</strong> name is <i>jon</i></div>',
        plainText: 'Hi, My name is jon'
      };
      getHtmlContentConverter(editorHtml, controlsWithPlaceholders, result);
    });
  });
});
