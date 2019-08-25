import {Icons} from '../icons/icons.enum';

export const COMMENT_ITEM = {
  avatar: 'https://process.filestackapi.com/Ardrnenq6TgKWX0jh6qvYz/security=' +
    'policy:eyJleHBpcnkiOjQ2MzU5MTg3MDQsImNhbGwiOlsiY29udmVydCJdLCJ1cmwiOiJodHRwczovL2ltYWdlcy5o' +
    'aWJvYi5jb20vZGVmYXVsdC1hdmF0YXJzLy4qIn0=,signature:1da622e7f0217d91d3e8576811f0303f40896e8e' +
    'aa1855af82a5296970b62569/resize=width:36,height:36,fit:crop/quality=value:70/https%3A%2F%2F' +
    'images.hibob.com%2Fdefault-avatars%2FHL_10.png',
  name: 'Harel Levy',
  content: 'This is a comment example',
  menuConfig: [
    {
      label: 'duplicate',
      action: () => console.log('duplicate')
    },
    {
      label: 'delete',
      action: () => console.log('delete')
    }
  ],
};
export const LONG_COMMENT_ITEM = {
  avatar: 'https://process.filestackapi.com/Ardrnenq6TgKWX0jh6qvYz/security=' +
    'policy:eyJleHBpcnkiOjQ2MzU5MTg3MDQsImNhbGwiOlsiY29udmVydCJdLCJ1cmwiOiJodHRwczovL2ltYWdlcy5o' +
    'aWJvYi5jb20vZGVmYXVsdC1hdmF0YXJzLy4qIn0=,signature:1da622e7f0217d91d3e8576811f0303f40896e8e' +
    'aa1855af82a5296970b62569/resize=width:36,height:36,fit:crop/quality=value:70/https%3A%2F%2F' +
    'images.hibob.com%2Fdefault-avatars%2FSB_20.png',
  name: 'Shmulik budagov',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' +
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' +
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  actionConfig: {
    icon: Icons.delete,
    tooltip: 'Delete',
    action: () => console.log('delete')
  }
};
export interface CommentItemDto {
  content: string;
}
