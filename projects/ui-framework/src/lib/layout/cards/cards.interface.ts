import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';

export type TextOrComponent = string | RenderedComponent;

export interface CardDataType {
  text: string;
  header?: TextOrComponent;
  footer?: TextOrComponent;
}

export interface CardData {
  data: CardDataType;
  menu?: MenuItem[];
}

export interface AddCardData {
  title: string;
  subtitle?: string;
}

export interface CardsData extends Array<CardData> {}
