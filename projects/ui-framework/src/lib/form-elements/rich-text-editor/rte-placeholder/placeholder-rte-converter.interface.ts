export interface RtePlaceholder {
  id: string;
  displayName: string;
  sample?: string;
}

export interface RtePlaceholderList {
  groupName: string;
  key?: string;
  options: RtePlaceholder[];
}

