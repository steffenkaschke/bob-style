import { EmojiFromCodePipe } from './emoji-from-code.pipe';

describe('EmojiFromCodePipe', () => {
  it('create an instance', () => {
    const pipe = new EmojiFromCodePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform method convert emoji code to emoji UTF8 string', () => {
    const pipe = new EmojiFromCodePipe();
    expect(pipe.transform('1F45B')).toEqual('👛');
    expect(pipe.transform('1F45C')).toEqual('👜');
    expect(pipe.transform('1F412')).toEqual('🐒');
    expect(pipe.transform('1F414')).toEqual('🐔');
  });
});
