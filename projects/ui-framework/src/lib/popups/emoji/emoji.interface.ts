export interface EmojiCategory {
  name: string;
  data: Emoji[];
}

export interface Emoji {
  code: string;
  shortname: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
}
