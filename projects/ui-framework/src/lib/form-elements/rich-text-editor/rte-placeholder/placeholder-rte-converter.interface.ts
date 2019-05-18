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
export interface RtePlaceholderUpdate {
  id: string;
  category?: string;
  text: string;
  tag: string;
}
