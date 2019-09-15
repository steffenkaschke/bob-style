import { LinkifyPipe } from './linkify.pipe';

describe('LinkifyPipe', () => {
  it('create transform www link to http://www in a, target blank', () => {
    const pipe = new LinkifyPipe();
    expect(pipe.transform('abc www.hibob.com def'))
      .toEqual('abc <a href="http://www.hibob.com" target="_blank">www.hibob.com</a> def');
  });
  it('create transform email to mailto: email link', () => {
    const pipe = new LinkifyPipe();
    expect(pipe.transform('abc bob@hibob.io def'))
      .toEqual('abc <a href="mailto:bob@hibob.io">bob@hibob.io</a> def');
  });
});
