export interface RteMentionsOption {
  avatar?: string;
  displayName: string;
  link: string;
}

export interface RtePlaceholder {
  id: string;
  displayName: string;
  sample?: string;
  value?: string;
}

export interface RtePlaceholderList {
  groupName: string;
  key?: string;
  options: RtePlaceholder[];
}
