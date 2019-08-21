import { EmojiFromCodePipe } from './emoji-from-code.pipe';

describe('EmojiFromCodePipe', () => {
  it('create an instance', () => {
    const pipe = new EmojiFromCodePipe();
    expect(pipe).toBeTruthy();
  });
});
