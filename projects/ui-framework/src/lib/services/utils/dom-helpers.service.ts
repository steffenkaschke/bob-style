import { Injectable } from '@angular/core';
import { FunctionalUtils } from './functional.service';

export interface TextProps {
  [key: string]: number;
}

export interface NotEmptyChildren {
  total: number;
  firstIndex: number | null;
}

@Injectable()
export class DOMhelpers {
  constructor(private fnc: FunctionalUtils) {}

  public setCssProps(element: HTMLElement, props: object): void {
    for (const prop of Object.keys(props)) {
      element.style.setProperty(prop, props[prop]);
    }
  }

  public getElementTextProps(element: HTMLElement): TextProps {
    const computedStyle = getComputedStyle(element),
      fontSize = parseFloat(computedStyle.fontSize),
      lineHeight =
        computedStyle.lineHeight.indexOf('px') !== -1
          ? parseFloat(computedStyle.lineHeight) / fontSize
          : computedStyle.lineHeight.indexOf('%') !== -1
          ? parseFloat(computedStyle.lineHeight) / 100
          : 1.2;
    return {
      fontSize: fontSize,
      lineHeight: lineHeight
    };
  }

  public hasNotEmptyChildren(element: HTMLElement): NotEmptyChildren {
    return Array.from(element.children).reduce(
      (acc, node, index) => {
        const hasText = !!(node as HTMLElement).innerText;
        return {
          total: hasText ? acc.total + 1 : acc.total,
          firstIndex:
            hasText && acc.firstIndex === null ? index : acc.firstIndex
        };
      },
      { total: 0, firstIndex: null }
    );
  }

  public hasTextNodes(element: HTMLElement): boolean {
    return !!Array.from(element.childNodes).find(
      node => node.nodeType === Node.TEXT_NODE
    );
  }

  public getDeepTextElement(element: HTMLElement): HTMLElement {
    const memoHasNotEmptyChildren = this.fnc.memoizeOne(
      this.hasNotEmptyChildren
    );

    while (
      memoHasNotEmptyChildren(element).total === 1 &&
      !this.hasTextNodes(element)
    ) {
      element = element.children[
        memoHasNotEmptyChildren(element).firstIndex
      ] as HTMLElement;
    }
    return element;
  }
}
