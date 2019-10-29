import { HtmlParserHelpers } from './html-parser.service';

describe('HtmlParserHelpers', () => {
  const parser = new HtmlParserHelpers();

  describe('cleanupHtml', () => {
    const testString = `

    <p>Hello</p>
<div><br></div>
    <p tabindex="0">
    <a class="class" href="blah" contenteditable="true">
      blah
      </a>
      </p>

    <p spellcheck="false"></p>

    <p><br></p> <em>
    </em>

    &nbsp; &nbsp;


    <div><br></div>
    <div><br></div>

    <span>  </span>

    <div><br></div>

    `;

    const processedString = parser.cleanupHtml(testString);

    it('Should replace Ps with DIVs', () => {
      expect(processedString).not.toContain('<p');
    });

    it('Should remove empty tags', () => {
      expect(processedString).not.toContain('<span');
      expect(processedString).not.toContain('<em');
    });

    it('Should remove attributes', () => {
      expect(processedString).not.toContain('class=');
      expect(processedString).not.toContain('contenteditable=');
      expect(processedString).not.toContain('tabindex=');
      expect(processedString).not.toContain('spellcheck=');
    });

    it('Should trim unnecessary white space', () => {
      expect(/&nbsp;/gi.test(processedString)).toBeFalsy();
      expect(/\s\s+/g.test(processedString)).toBeFalsy();
    });

    it('Should remove unnecessary empty lines', () => {
      const regex = /\<div\>\<br\>\<\/div\>/gim;
      expect(processedString.match(regex).length).toEqual(1);
      expect(processedString.endsWith('<div><br></div>')).toBeFalsy();
    });
  });

  describe('enforceAttributes', () => {
    const testString = `
      <div class="mydiv">text</div>
      <a href="link" class="mylink">link</a>
      <span data-blah="blah">text2</span>
    `;

    it('Should add class', () => {
      expect(
        parser.enforceAttributes(testString, 'div', {
          class: 'hello'
        })
      ).toContain('<div class="mydiv hello">');
    });

    it('Should add multiple classes', () => {
      expect(
        parser.enforceAttributes(testString, 'div', {
          class: {
            hello: true,
            world: true
          }
        })
      ).toContain('<div class="mydiv hello world">');
    });

    it('Should remove class', () => {
      expect(
        parser.enforceAttributes(testString, 'div', {
          class: {
            mydiv: false
          }
        })
      ).not.toContain('<div class="mydiv');
    });

    it('Should remove attribute', () => {
      expect(
        parser.enforceAttributes(testString, 'span', {
          'data-blah': null
        })
      ).not.toContain('<span data-blah="blah">');
    });

    it('Should add/remove multiple attributes', () => {
      const parsed = parser.enforceAttributes(testString, 'span', {
        'data-blah': null,
        'data-bruh': 'bro'
      });

      expect(parsed).not.toContain('<span data-blah="blah">');
      expect(parsed).toContain('<span data-bruh="bro">');
    });

    it('Should add attribute', () => {
      expect(
        parser.enforceAttributes(testString, 'a', {
          target: '_blank'
        })
      ).toContain('<a href="link" class="mylink" target="_blank">');
    });
  });

  describe('linkify', () => {
    it('Should linkify and add passed string to tag', () => {
      expect(parser.linkify('abc www.link.com 123', 'class="link"')).toContain(
        '<a href="http://www.link.com" target="_blank" class="link">www.link.com</a>'
      );
    });
  });
});
