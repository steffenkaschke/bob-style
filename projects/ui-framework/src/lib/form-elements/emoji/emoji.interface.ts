export interface EmojiMap {
  people?: EmojiCategory;
  nature?: EmojiCategory;
  foods?: EmojiCategory;
  activity?: EmojiCategory;
  places?: EmojiCategory;
  objects?: EmojiCategory;
  symbols?: EmojiCategory;
}

export interface EmojiCategory {
  emojis: any;
  name: string;
  icon: string;
}
