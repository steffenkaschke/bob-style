import { MetaData, allowedStyleObj } from './card-table.interface';

const checkCssUnit = (value: string): string => {
  const n = parseFloat(value),
    p = value.match(/%|em|rem/);
  return isNaN(n) ? 'auto' : p ? n + '' + p : Math.round(n) + 'px';
};

const getCellWidth = (meta: MetaData, index: number): string | null => {
  if (!meta[index].width || meta[index].width === 'auto') {
    return null;
  }
  return checkCssUnit(String(meta[index].width));
};

export const generateCellStyle = (
  meta: MetaData,
  index: number,
  addTextStyles: boolean = true
): allowedStyleObj => {
  const textStyle = addTextStyles ? meta[index].textStyle : {};
  return {
    maxWidth: getCellWidth(meta, index),
    alignItems: meta[index].align === 'right' ? 'flex-end' : null,
    ...textStyle
  };
};
