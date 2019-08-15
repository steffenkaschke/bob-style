export interface EmojiMap {
  people?: EmojiCategory[];
  nature?: EmojiCategory[];
  foods?: EmojiCategory[];
  activity?: EmojiCategory[];
  places?: EmojiCategory[];
  objects?: EmojiCategory[];
  symbols?: EmojiCategory[];
}

export interface EmojiCategory {
  code: string;
  shortname: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
}
