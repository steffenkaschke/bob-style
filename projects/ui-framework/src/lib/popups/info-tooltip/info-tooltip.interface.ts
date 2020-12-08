import { Icons, IconSize, Link } from 'bob-style';


export interface InfoTooltip {
  title: string;
  text: string;
  link: Link;
  icon?: Icons;
  iconSize?: IconSize;
  linkClicked?: Function;
}
