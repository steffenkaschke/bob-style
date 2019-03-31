import {
  CardTableMetaData,
  cardTableAllowedCellStyleObj
} from './card-table.interface';

// todo: remove
const checkCssUnit = (value: string): string => {
  const n = parseFloat(value),
    p = value.match(/%|em|rem/);
  return isNaN(n) ? 'auto' : p ? n + '' + p : Math.round(n) + 'px';
};

const getCellWidth = (meta: CardTableMetaData, index: number): string | null => {
  if (!meta[index].width || meta[index].width === 'auto') {
    return null;
  }
  return checkCssUnit(String(meta[index].width));
};

export const generateCellStyle = (
  meta: CardTableMetaData,
  index: number,
  addTextStyles: boolean = true
): cardTableAllowedCellStyleObj => {
  const textStyle = addTextStyles ? meta[index].textStyle : {};
  return {
    maxWidth: getCellWidth(meta, index),
    alignItems: meta[index].align === 'right' ? 'flex-end' : null,
    ...textStyle
  };
};
